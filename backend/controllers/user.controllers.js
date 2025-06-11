import mongoose from "mongoose"; // Ensure mongoose is imported for ObjectId.isValid
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req,res)=>{
    try {
        const LoggedInUserId = req.user._id;

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filteredUsers = await User.find({ _id: { $ne: LoggedInUserId } })
            .select('-password')
            .skip(skip)
            .limit(limit);

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSideBar: ", error.message); // Log the actual error message
        res.status(500).json({ // Use 500 for server errors
            error: 'Internal Server error'
        });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format." });
        }

        const user = await User.findById(userId).select("-password -__v"); // Exclude password and version key

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Fields to return: _id, fullName, username, profilePic, bio, statusMessage, lastSeen, createdAt, updatedAt
        // Most are already selected by excluding password. Gender is also there.
        res.status(200).json(user);

    } catch (error) {
        console.error("Error in getUserProfile: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { bio, statusMessage, profilePic, fullName, username } = req.body; // Allow fullName & username updates too

        const user = await User.findById(loggedInUserId);
        if (!user) {
            // This should ideally not happen if protectedRoute is working
            return res.status(404).json({ error: "User not found." });
        }

        // Update allowed fields
        if (bio !== undefined) user.bio = bio;
        if (statusMessage !== undefined) user.statusMessage = statusMessage;
        if (profilePic !== undefined) user.profilePic = profilePic;
        if (fullName !== undefined) user.fullName = fullName;

        // Handle username update separately due to uniqueness
        if (username !== undefined && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== loggedInUserId.toString()) {
                return res.status(400).json({ error: "Username already taken." });
            }
            user.username = username;
        }

        // Note: lastSeen is not updated here; it should be handled by activity tracking.

        const updatedUser = await user.save();

        // Prepare response object, excluding sensitive data
        const userResponse = {
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            username: updatedUser.username,
            profilePic: updatedUser.profilePic,
            gender: updatedUser.gender,
            bio: updatedUser.bio,
            statusMessage: updatedUser.statusMessage,
            lastSeen: updatedUser.lastSeen,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };

        res.status(200).json(userResponse);

    } catch (error) {
        console.error("Error in updateUserProfile: ", error.message);
        if (error.code === 11000) { // Mongoose duplicate key error for username
            return res.status(400).json({ error: "Username already taken." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};
