import mongoose from "mongoose";
import GroupConversation from "../models/groupConversation.model.js";
import User from "../models/user.model.js";
// import Message from "../models/message.model.js"; // For 1-on-1, not directly used here yet
import GroupMessage from "../models/groupMessage.model.js"; // Used for lastMessage population
import { io } from "../socket/socket.js"; // Import io for Socket.IO emissions

export const createGroup = async (req, res) => {
    try {
        const { name, participants: participantIds } = req.body;
        const creatorId = req.user._id;

        if (!name || !participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({ error: "Group name and participant IDs are required." });
        }

        // Ensure creator is implicitly part of the participants for validation logic,
        // but don't add them to participantIds if they already included themselves.
        const allParticipantIdsForValidation = [...new Set([...participantIds, creatorId.toString()])];


        if (allParticipantIdsForValidation.length < 2) { // Require at least one other member besides the creator
            return res.status(400).json({ error: "A group must have at least 2 participants (including the creator)." });
        }

        // Validate participant IDs and check if they are valid users
        const users = await User.find({ _id: { $in: allParticipantIdsForValidation } }).select("_id");
        if (users.length !== allParticipantIdsForValidation.length) {
            const foundUserIds = users.map(u => u._id.toString());
            const notFoundIds = allParticipantIdsForValidation.filter(id => !foundUserIds.includes(id));
            return res.status(400).json({ error: `Invalid user IDs provided for participants: ${notFoundIds.join(", ")}` });
        }

        // Actual participants for the group: creator + provided IDs, ensuring no duplicates.
        const finalParticipantObjectIds = [
            creatorId,
            ...participantIds
                .map(id => new mongoose.Types.ObjectId(id)) // Ensure string IDs are converted
                .filter(id => !id.equals(creatorId)) // Filter out creator if they were passed in participants
        ];
        // Remove duplicates that might arise if creatorId was also in participantIds
        const uniqueFinalParticipantObjectIds = Array.from(new Set(finalParticipantObjectIds.map(id => id.toString())))
                                                .map(idStr => new mongoose.Types.ObjectId(idStr));


        const newGroup = new GroupConversation({
            name,
            participants: uniqueFinalParticipantObjectIds,
            admins: [creatorId], // Creator is the first admin
            // lastMessage will be null by default
            // groupIcon will be "" by default
        });

        await newGroup.save();

        // Populate admin and participant details for the response
        await newGroup.populate([
            { path: "participants", select: "fullName username profilePic" },
            { path: "admins", select: "fullName username profilePic" }
        ]);

        res.status(201).json(newGroup);

    } catch (error) {
        console.error("Error in createGroup controller: ", error.message);
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid ID format provided for participants." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { message, messageType = 'text' } = req.body; // messageType defaults to 'text'
        const senderId = req.user._id;

        if (!message) {
            return res.status(400).json({ error: "Message content cannot be empty." });
        }
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID format." });
        }

        const group = await GroupConversation.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        // Ensure the sender is a participant of the group
        if (!group.participants.map(pId => pId.toString()).includes(senderId.toString())) {
            return res.status(403).json({ error: "Forbidden. You are not a participant of this group." });
        }

        const newGroupMessage = new GroupMessage({
            senderId,
            groupConversationId: groupId,
            message,
            messageType,
        });

        await newGroupMessage.save();

        // Update the lastMessage field in the GroupConversation
        group.lastMessage = newGroupMessage._id;
        await group.save();

        // Populate sender details for the response
        await newGroupMessage.populate({
            path: "senderId",
            select: "fullName username profilePic"
        });

        // Emit the new message via Socket.IO to group members
        // The room name is 'group_' + groupId
        io.to('group_' + groupId.toString()).emit('newGroupMessage', newGroupMessage);

        res.status(201).json(newGroupMessage);

    } catch (error) {
        console.error("Error in sendGroupMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30; // Default to 30 messages
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID format." });
        }

        const group = await GroupConversation.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        // Ensure the user is a participant of the group to fetch messages
        if (!group.participants.map(pId => pId.toString()).includes(userId.toString())) {
            return res.status(403).json({ error: "Forbidden. You are not a participant of this group." });
        }

        const messages = await GroupMessage.find({ groupConversationId: groupId })
            .populate({
                path: "senderId",
                select: "fullName username profilePic",
            })
            .sort({ createdAt: -1 }) // Most recent messages first
            .skip(skip)
            .limit(limit);

        // For client-side, it's often better to reverse the order to show oldest first in the current page
        // but allow infinite scroll to load older messages (which appear on top)
        // So, sending them in descending order (newest first) is fine. Client can reverse if needed.

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in getGroupMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateGroupName = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name } = req.body;
        const userId = req.user._id;

        if (!name) {
            return res.status(400).json({ error: "Group name is required." });
        }

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID format." });
        }

        const group = await GroupConversation.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        // Check if the logged-in user is an admin
        if (!group.admins.map(adminId => adminId.toString()).includes(userId.toString())) {
            return res.status(403).json({ error: "Forbidden. Only admins can update the group name." });
        }

        group.name = name;
        await group.save();

        // Populate for consistent response
        const populatedGroup = await group.populate([
            { path: "participants", select: "fullName username profilePic" },
            { path: "admins", select: "fullName username profilePic" }
        ]);

        // Emit event to group room
        io.to('group_' + groupId.toString()).emit('groupUpdated', {
            groupId: populatedGroup._id,
            name: populatedGroup.name,
            // You could send more fields or the whole populatedGroup if needed by clients
        });

        res.status(200).json(populatedGroup);
    } catch (error) {
        console.error("Error in updateGroupName controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addMembersToGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberUsernames } = req.body; // Expect memberUsernames (array of strings)
        const adminUserId = req.user._id; // Logged-in user, must be an admin

        if (!memberUsernames || !Array.isArray(memberUsernames) || memberUsernames.length === 0) {
            return res.status(400).json({ error: "Member usernames array is required and cannot be empty." });
        }
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID format." });
        }

        const group = await GroupConversation.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        if (!group.admins.map(adminId => adminId.toString()).includes(adminUserId.toString())) {
            return res.status(403).json({ error: "Forbidden. Only admins can add members." });
        }

        // Resolve usernames to user IDs
        const usersToAdd = await User.find({ username: { $in: memberUsernames } }).select('_id username');

        const foundUsernames = usersToAdd.map(u => u.username);
        const notFoundUsernames = memberUsernames.filter(username => !foundUsernames.includes(username));

        if (notFoundUsernames.length > 0) {
            return res.status(400).json({
                error: `The following usernames were not found: ${notFoundUsernames.join(", ")}. Please ensure usernames are correct.`
            });
        }

        const userIdsToAdd = usersToAdd.map(u => u._id);
        const alreadyParticipantUsernames = [];
        const finalUserIdsToPush = [];

        for (const user of usersToAdd) {
            if (group.participants.map(pId => pId.toString()).includes(user._id.toString())) {
                alreadyParticipantUsernames.push(user.username);
            } else {
                finalUserIdsToPush.push(user._id); // This is already an ObjectId
            }
        }

        if (finalUserIdsToPush.length === 0) {
            let message = "No new members to add.";
            if (alreadyParticipantUsernames.length > 0) {
                message += ` Users ${alreadyParticipantUsernames.join(", ")} are already participants.`;
            }
            return res.status(400).json({
                error: message,
                alreadyParticipantUsernames: alreadyParticipantUsernames // Send back for client info
            });
        }

        group.participants.push(...finalUserIdsToPush);
        await group.save();

        const populatedGroup = await GroupConversation.findById(groupId).populate([
            { path: "participants", select: "fullName username profilePic _id" },
            { path: "admins", select: "fullName username profilePic _id" },
            {
                path: "lastMessage",
                select: "message senderId createdAt messageType",
                populate: { path: "senderId", select: "fullName username profilePic _id" }
            }
        ]);

        // Fetch details of newly added members (using finalUserIdsToPush) to send in the event
        const addedMemberDetails = await User.find({ _id: { $in: finalUserIdsToPush } }).select("fullName username profilePic _id");

        // Emit general update to the group room
        io.to('group_' + groupId.toString()).emit('groupMembersUpdated', {
            groupId,
            participants: populatedGroup.participants,
            action: 'added',
            addedMemberIds: finalUserIdsToPush.map(id => id.toString()),
            // Consider sending addedMemberDetails if client needs immediate full details of new members
        });

        // Emit specific event to each newly added user's personal room
        addedMemberDetails.forEach(member => {
            io.to(member._id.toString()).emit('addedToGroup', populatedGroup);

            const userSockets = io.sockets.adapter.rooms.get(member._id.toString());
            if (userSockets) {
                userSockets.forEach(socketId => {
                    const socketInstance = io.sockets.sockets.get(socketId);
                    if (socketInstance) {
                        socketInstance.join('group_' + groupId.toString());
                        console.log(`Socket ${socketId} for user ${member._id.toString()} made to join new group room: group_${groupId.toString()}`);
                    }
                });
            }
        });

        res.status(200).json({
            message: "Members added successfully.",
            group: populatedGroup,
            addedMembers: addedMemberDetails, // Send details of members actually added
            alreadyParticipantUsernames // Send usernames of those already in group
        });

    } catch (error) {
        console.error("Error in addMembersToGroup controller: ", error.message);
        // CastError check might be less relevant now as primary input is usernames
        res.status(500).json({ error: "Internal server error" });
    }
};


// Placeholder for getUserGroups
export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id;

        const groups = await GroupConversation.find({ participants: userId })
            .populate({
                path: "participants",
                select: "fullName username profilePic",
            })
            .populate({
                path: "admins",
                select: "fullName username profilePic",
            })
            .populate({ // Basic population for lastMessage
                path: "lastMessage",
                select: "message senderId createdAt messageType",
                populate: { // Populate sender of last message
                    path: "senderId",
                    select: "fullName username profilePic"
                }
            })
            .sort({ updatedAt: -1 }); // Sort by last activity (creation or new message)

        res.status(200).json(groups);
    } catch (error) {
        console.error("Error in getUserGroups controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const removeMemberFromGroup = async (req, res) => {
    try {
        const { groupId, userId: memberToRemoveId } = req.params;
        const loggedInUserId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(memberToRemoveId)) {
            return res.status(400).json({ error: "Invalid group ID or user ID format." });
        }

        const group = await GroupConversation.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        const memberToRemoveObjectId = new mongoose.Types.ObjectId(memberToRemoveId);
        const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUserId);

        // Authorization: Logged-in user must be an admin to remove someone,
        // OR they can remove themselves (though leaveGroup is preferred for self-removal).
        const isAdmin = group.admins.some(adminId => adminId.equals(loggedInUserObjectId));

        if (!isAdmin && !memberToRemoveObjectId.equals(loggedInUserObjectId)) {
            return res.status(403).json({ error: "Forbidden. Only admins can remove other members." });
        }

        // If admin is trying to remove another admin who is not themselves
        if (isAdmin && !memberToRemoveObjectId.equals(loggedInUserObjectId) && group.admins.some(adminId => adminId.equals(memberToRemoveObjectId))) {
            // Allow admin to remove another admin.
        }


        // Check if the user to be removed is a participant
        if (!group.participants.some(pId => pId.equals(memberToRemoveObjectId))) {
            return res.status(404).json({ error: "User is not a participant of this group." });
        }

        // Prevent removal of the last admin if they are removing themselves via this route
        // and they are the only admin left.
        if (memberToRemoveObjectId.equals(loggedInUserObjectId) &&
            group.admins.every(adminId => adminId.equals(memberToRemoveObjectId)) &&
            group.admins.length === 1 &&
            group.participants.length > 1) { // only if other participants exist
             return res.status(400).json({ error: "Cannot remove the last admin if other participants remain. Delete the group or promote another admin first." });
        }


        group.participants = group.participants.filter(pId => !pId.equals(memberToRemoveObjectId));

        // If the removed member was also an admin, remove them from admins list
        if (group.admins.some(adminId => adminId.equals(memberToRemoveObjectId))) {
            group.admins = group.admins.filter(adminId => !adminId.equals(memberToRemoveObjectId));
        }

        // If no admins are left (e.g. last admin removed themselves or was removed),
        // and there are still participants, promote the oldest participant? Or delete group?
        // For now, allows group to become admin-less if not handled by above check.
        // A more robust solution would be to enforce at least one admin if participants > 0.
        // Or if the group becomes adminless and has no participants, delete it.
        if (group.participants.length === 0) {
            await GroupConversation.findByIdAndDelete(groupId);
            return res.status(200).json({ message: "Member removed and group was empty, group deleted." });
        }
         if (group.admins.length === 0 && group.participants.length > 0) {
            // Option: promote the first participant to admin
            // group.admins.push(group.participants[0]);
            // For now, we'll leave it potentially admin-less as per simplified requirement.
            console.warn(`Group ${groupId} now has no admins but still has participants.`);
        }


        await group.save();

        const populatedGroup = await GroupConversation.findById(groupId).populate([ // Repopulate after save if needed, or use the already modified group object
            { path: "participants", select: "fullName username profilePic _id" },
            { path: "admins", select: "fullName username profilePic _id" }
        ]);

        // Emit general update to the group room
        io.to('group_' + groupId.toString()).emit('groupMembersUpdated', {
            groupId,
            participants: populatedGroup ? populatedGroup.participants : group.participants, // Use populated if available
            removedUserId: memberToRemoveId.toString(),
            action: 'removed'
        });

        // Emit specific event to the removed user's personal room
        io.to(memberToRemoveId.toString()).emit('removedFromGroup', {
            groupId,
            groupName: group.name // Send group name for context
        });

        // Instruct the removed user's socket(s) to leave the group room server-side.
        const userSockets = io.sockets.adapter.rooms.get(memberToRemoveId.toString());
        if (userSockets) {
            userSockets.forEach(socketId => {
                const socketInstance = io.sockets.sockets.get(socketId);
                if (socketInstance) {
                    socketInstance.leave('group_' + groupId.toString());
                    console.log(`Socket ${socketId} for user ${memberToRemoveId.toString()} made to leave group room: group_${groupId.toString()}`);
                }
            });
        }

        res.status(200).json({ message: "Member removed successfully.", group: populatedGroup || group });

    } catch (error) {
        console.error("Error in removeMemberFromGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userIdToLeave = req.user._id; // Logged-in user

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID format." });
        }

        const group = await GroupConversation.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        const userToLeaveObjectId = new mongoose.Types.ObjectId(userIdToLeave);

        if (!group.participants.some(pId => pId.equals(userToLeaveObjectId))) {
            return res.status(400).json({ error: "You are not a participant of this group." });
        }

        // Remove user from participants
        group.participants = group.participants.filter(pId => !pId.equals(userToLeaveObjectId));

        // If the leaving user was an admin, remove them from admins
        let wasAdmin = false;
        if (group.admins.some(adminId => adminId.equals(userToLeaveObjectId))) {
            group.admins = group.admins.filter(adminId => !adminId.equals(userToLeaveObjectId));
            wasAdmin = true;
        }

        // If the group becomes empty after leaving, delete it.
        if (group.participants.length === 0) {
            await GroupConversation.findByIdAndDelete(groupId);
            return res.status(200).json({ message: "You have left the group, and the group is now empty and has been deleted." });
        }

        // If the last admin is leaving
        if (wasAdmin && group.admins.length === 0 && group.participants.length > 0) {
            // Option 1: Promote the first remaining participant (oldest member) to admin
            // group.admins.push(group.participants[0]);
            // console.log(`User ${userIdToLeave} left. Group ${groupId} had no admins. ${group.participants[0]} was promoted.`);
            // Option 2: Group becomes admin-less (current simpler approach)
            console.warn(`User ${userIdToLeave} (an admin) left group ${groupId}. The group now has no admins but still has participants.`);
        }

        await group.save();

        // Emit update to the group room
        io.to('group_' + groupId.toString()).emit('groupMembersUpdated', {
            groupId,
            removedUserId: userIdToLeave.toString(), // Send the ID of the user who left
            action: 'left'
            // Optionally send updated participant list if client doesn't want to refetch/filter
            // participants: group.participants
        });

        // Instruct the leaving user's socket(s) to leave the group room server-side.
        const userSockets = io.sockets.adapter.rooms.get(userIdToLeave.toString());
        if (userSockets) {
            userSockets.forEach(socketId => {
                const socketInstance = io.sockets.sockets.get(socketId);
                if (socketInstance) {
                    socketInstance.leave('group_' + groupId.toString());
                    console.log(`Socket ${socketId} for user ${userIdToLeave.toString()} (who left) made to leave group room: group_${groupId.toString()}`);
                }
            });
        }

        res.status(200).json({ message: "Successfully left the group." });

    } catch (error) {
        console.error("Error in leaveGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateGroupIcon = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { groupIcon } = req.body; // Assuming groupIcon is a URL string
        const userId = req.user._id;

        if (typeof groupIcon !== 'string') { // Basic validation for the icon URL/path
            return res.status(400).json({ error: "Group icon must be a string (URL or path)." });
        }

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID format." });
        }

        const group = await GroupConversation.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        if (!group.admins.map(adminId => adminId.toString()).includes(userId.toString())) {
            return res.status(403).json({ error: "Forbidden. Only admins can update the group icon." });
        }

        group.groupIcon = groupIcon;
        await group.save();

        // Populate for consistent response
        const populatedGroup = await group.populate([
            { path: "participants", select: "fullName username profilePic" },
            { path: "admins", select: "fullName username profilePic" }
        ]);

        // Emit event to group room
        io.to('group_' + groupId.toString()).emit('groupUpdated', {
            groupId: populatedGroup._id,
            groupIcon: populatedGroup.groupIcon
        });

        res.status(200).json(populatedGroup);
    } catch (error) {
        console.error("Error in updateGroupIcon controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID format." });
        }

        const group = await GroupConversation.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        if (!group.admins.map(adminId => adminId.toString()).includes(userId.toString())) {
            return res.status(403).json({ error: "Forbidden. Only admins can delete the group." });
        }

        // Consideration: Group messages (GroupMessage documents) are not explicitly deleted here.
        // They will be orphaned. For a production system, a cleanup strategy for orphaned messages
        // (e.g., a background job, or cascading delete if DB/ODM supports it and it's desired)
        // might be necessary, or they could be kept for archival purposes if the GroupConversation ID is retained.
        await GroupConversation.findByIdAndDelete(groupId);

        res.status(200).json({ message: "Group deleted successfully." });
    } catch (error) {
        console.error("Error in deleteGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Placeholder for getGroupDetails
export const getGroupDetails = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ error: "Invalid group ID format." });
        }

        const group = await GroupConversation.findOne({ _id: groupId, participants: userId })
            .populate({
                path: "participants",
                select: "fullName username profilePic gender", // Added gender for more detail
            })
            .populate({
                path: "admins",
                select: "fullName username profilePic",
            })
            .populate({
                path: "lastMessage",
                // select: "message senderId createdAt messageType readBy", // Include readBy if implemented
                select: "message senderId createdAt messageType",
                 populate: {
                    path: "senderId",
                    select: "fullName username profilePic"
                }
            });

        if (!group) {
            return res.status(404).json({ error: "Group not found or you are not a participant." });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error("Error in getGroupDetails controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
