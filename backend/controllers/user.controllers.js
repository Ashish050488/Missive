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

