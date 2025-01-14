import User from "../models/user.model.js";

export const getUsersForSideBar = async (req,res)=>{
    try {
        
        const LoggedInUserId = req.user._id;

        const filteredUsers = await User.find({_id:{$ne:LoggedInUserId}}).select('-password')
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log(getUsersForSideBar)
        res.status(400).json({                      
            error:'Internal Server error'
        })
    }
}

