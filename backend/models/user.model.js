import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:['male','female'],
        index: true
    },
    profilePic:{
        type:String,
        default:''
    },
    bio: {
        type: String,
        default: ''
    },
    statusMessage: { // User-settable status message
        type: String,
        default: ''
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    // Note: Group associations for a user are not stored directly in the User model.
    // They can be queried by finding GroupConversation documents where this user's ID
    // is present in the 'participants' array.
},{timestamps:true})

const User = mongoose.model('User',userSchema);

export default User


