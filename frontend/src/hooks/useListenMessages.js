import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import notificationSound from '../assets/sound/notification.mp3'; // Corrected import name

export const useListenMessages = () => {
    const { socket } = useSocketContext();
    // No need to destructure setMessages/addMessage directly from useConversation() for the effect's dependencies,
    // as we'll use getState() inside the handler to avoid stale closures and simplify deps.
    // selectedConversation is needed in the dependency array to re-evaluate which event to listen to.
    const { selectedConversation } = useConversation();

    useEffect(() => {
        if (!socket || !selectedConversation?._id) {
            // If no socket or no selected conversation, do nothing and ensure no listeners are active.
            // It's important to clean up listeners if socket exists but selectedConversation becomes null.
            if (socket) {
                socket.off('newMessage');
                socket.off('newGroupMessage');
            }
            return;
        }

        const handleNewMessage = (newMessage) => {
            // Access the latest state directly from the store
            const currentSelectedConv = useConversation.getState().selectedConversation;
            const addMsgFunc = useConversation.getState().addMessage;

            let isForCurrentChat = false;
            if (currentSelectedConv?.isDM === false && newMessage.groupConversationId === currentSelectedConv._id) {
                isForCurrentChat = true;
            } else if (currentSelectedConv?.isDM !== false) {
                // For DMs, check if the message's sender or receiver matches the selected conversation partner,
                // AND that the message is not a group message (which it shouldn't be if coming via 'newMessage' event)
                // This logic assumes 'newMessage' events are only for DMs.
                // A robust DM system might include a conversationId in the message payload.
                if (newMessage.senderId === currentSelectedConv._id || newMessage.receiverId === currentSelectedConv._id) {
                     // Additionally, ensure it's not a group message accidentally caught, if structure allows
                    if (!newMessage.groupConversationId) {
                        isForCurrentChat = true;
                    }
                }
            }

            if (isForCurrentChat) {
                const sound = new Audio(notificationSound);
                sound.play().catch(e => console.error("Error playing sound:", e)); // Handle potential play error
                addMsgFunc(newMessage);
            } else {
                // Optional: Handle background notification for messages not for the current chat
                // This could involve updating unread counts, showing a toast, etc.
                // For now, we only add messages to the store if they are for the selected chat.
                console.log("Received message for a different chat:", newMessage);
            }
        };

        const eventName = selectedConversation.isDM === false ? 'newGroupMessage' : 'newMessage';

        // Clean up previous listeners first to prevent duplicates if selectedConversation changes rapidly
        socket.off('newMessage');
        socket.off('newGroupMessage');

        // Add the new listener for the determined event
        socket.on(eventName, handleNewMessage);

        // Cleanup function for this effect
        return () => {
            if (socket) { // Check if socket still exists on cleanup
                socket.off(eventName, handleNewMessage);
            }
        };
    }, [socket, selectedConversation]); // Re-run effect if socket or selectedConversation changes

};