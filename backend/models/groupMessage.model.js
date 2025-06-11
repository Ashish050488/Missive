import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        groupConversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupConversation",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        messageType: {
            type: String,
            enum: ['text', 'image', 'file', 'system'], // system for "User X joined", "User Y left", etc.
            default: 'text',
        },
        // readBy: [ // Optional: For future implementation of read receipts
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "User",
        //     },
        // ],
    },
    { timestamps: true }
);

// Indexes for quicker lookups
groupMessageSchema.index({ groupConversationId: 1 });
groupMessageSchema.index({ senderId: 1 });
groupMessageSchema.index({ createdAt: -1 }); // For fetching recent messages

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

export default GroupMessage;
