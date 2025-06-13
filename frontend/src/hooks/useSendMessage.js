import { useState } from "react"
import useConversation from "../zustand/useConversation";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    // selectedConversation is needed to determine the endpoint
    // addMessage (via getState) will be used to update messages
    const { selectedConversation } = useConversation();

    const sendMessage = async (messageContent) => { // Renamed message to messageContent for clarity
        setLoading(true);
        try {
            let url = '';
            let bodyPayload = { message: messageContent }; // Default for DMs

            if (selectedConversation.isDM === false) { // Group conversation
                url = `/api/groups/${selectedConversation._id}/messages`;
                // Backend for group messages expects { message, messageType (optional) }
                // We are sending only text messages from here for now.
            } else { // DM conversation
                url = `/api/message/send/${selectedConversation._id}`;
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyPayload)
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Add the successfully sent message to the Zustand store
            useConversation.getState().addMessage(data);

        } catch (error) {
            // Using toast for user feedback, but console.error is also good for debugging
            // import toast from 'react-hot-toast';
            // toast.error(error.message);
            console.error("Error sending message:", error.message);
        } finally {
            setLoading(false);
        }
    }

    return { sendMessage, loading };

}

export default useSendMessage
