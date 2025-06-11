import express from "express";
import {
    createGroup,
    getUserGroups,
    getGroupDetails,
    updateGroupName,
    updateGroupIcon,
    deleteGroup,
    addMembersToGroup,
    removeMemberFromGroup,
    leaveGroup,
    sendGroupMessage,
    getGroupMessages
} from "../controllers/group.controller.js";
import protectedRoute from "../middleware/protectedRoute.js";

const router = express.Router();

// Route to create a new group
router.post("/", protectedRoute, createGroup);

// Route to get all groups for the logged-in user
router.get("/", protectedRoute, getUserGroups);

// Route to get specific group details
router.get("/:groupId", protectedRoute, getGroupDetails);

// Route to update group name
router.put("/:groupId/name", protectedRoute, updateGroupName);

// Route to update group icon
router.put("/:groupId/icon", protectedRoute, updateGroupIcon);

// Route to delete a group
router.delete("/:groupId", protectedRoute, deleteGroup);

// Route to add members to a group
router.post("/:groupId/members", protectedRoute, addMembersToGroup);

// Route to remove a member from a group
router.delete("/:groupId/members/:userId", protectedRoute, removeMemberFromGroup);

// Route for a user to leave a group
router.post("/:groupId/members/leave", protectedRoute, leaveGroup);

// Route to send a message in a group
router.post("/:groupId/messages", protectedRoute, sendGroupMessage);

// Route to get messages for a group (paginated)
router.get("/:groupId/messages", protectedRoute, getGroupMessages);

export default router;
