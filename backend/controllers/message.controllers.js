import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import User from '../models/user.model.js';
// getReceiverSocketId is removed as per new requirements, io is kept for room-based emission
import { io } from '../socket/socket.js';


export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		// Check if receiver exists
		const receiver = await User.findById(receiverId);
		if (!receiver) {
			return res.status(404).json({ error: "Receiver not found" });
		}

		// Find or create the conversation
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// Create the message
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// TODO: Scalability: For very high message volumes per conversation, consider refactoring.
		// Storing all message IDs in Conversation.messages array might become a bottleneck.
		// A separate query for messages, perhaps paginated, would be more scalable.
		// Note: The above 'if (newMessage)' block was already present and handled the push.
		// The previous diff incorrectly duplicated it. This is the corrected structure.

		// Save both conversation and message
		await Promise.all([conversation.save(), newMessage.save()]);

		// Socket functionality: Emit message to the recipient's room (named after their userId)
		io.to(receiverId).emit('newMessage', newMessage);

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// get messages 
export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate(
			{
				path:"messages",
				options: { sort: { createdAt: -1 }, limit: 20 },
			}
		);   // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;
        // console.log(conversation);
        

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


