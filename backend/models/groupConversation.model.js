import mongoose from "mongoose";

const groupConversationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMessage",
            default: null,
        },
        groupIcon: {
            type: String,
            default: "",
        },
        isDM: { // To differentiate from 1-on-1 conversations if ever unified
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

const GroupConversation = mongoose.model("GroupConversation", groupConversationSchema);

export default GroupConversation;
