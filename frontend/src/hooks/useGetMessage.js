import React, { useEffect, useState } from 'react'
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast'

const useGetMessage = () => {
    const [loading,setLoading] = useState(false);
    const {messages,setMessages,selectedConversation} =  useConversation()

    useEffect(()=>{
        const getMessages = async ()=>{
            setLoading(true);
            setMessages([]); // Clear previous messages when conversation changes
            try {
                let url = '';
                if (selectedConversation.isDM === false) { // Group conversation
                    url = `/api/groups/${selectedConversation._id}/messages?page=1&limit=30`; // Use page/limit for groups
                } else { // DM conversation
                    url = `/api/message/${selectedConversation._id}?skip=0`; // Existing DM endpoint with skip
                }
                const res = await fetch(url);
                const data  = await res.json();
                if(data.error) throw new Error(data.error);

                // Group messages are sorted newest first from backend, DMs might be too.
                // For display, usually want oldest at top, newest at bottom.
                // If data is newest first, reverse it.
                setMessages(Array.isArray(data) ? data.reverse() : []);
            } catch (error) {
                toast.error(error.message);
                setMessages([]); // Clear messages on error
            }finally{
                setLoading(false);
            }
        }
        if(selectedConversation?._id) getMessages();
        // Adding selectedConversation itself to dependency array as isDM property is now used.
    },[selectedConversation, setMessages]);

    const loadMoreMessages = async () => {
        if (!selectedConversation?._id || loading) return;
        setLoading(true);
        try {
            let url = '';
            let nextPageOrSkip = 0;

            if (selectedConversation.isDM === false) { // Group conversation
                // Calculate page based on current messages length and limit (e.g., 30)
                const limit = 30;
                const currentPage = Math.floor(messages.length / limit) + 1;
                nextPageOrSkip = currentPage + 1;
                url = `/api/groups/${selectedConversation._id}/messages?page=${nextPageOrSkip}&limit=${limit}`;
            } else { // DM conversation
                nextPageOrSkip = messages.length;
                url = `/api/message/${selectedConversation._id}?skip=${nextPageOrSkip}`;
            }

            const res = await fetch(url);
            const olderMessages = await res.json();
            if(olderMessages.error) throw new Error(olderMessages.error);

            if (Array.isArray(olderMessages) && olderMessages.length > 0) {
                 // Newest first from backend, reverse for prepending
                setMessages((prev) => [...olderMessages.reverse(), ...prev]);
            } else {
                toast('No more messages to load.');
            }
        } catch (error) {
          toast.error(error.message || "Failed to load older messages");
        } finally {
            setLoading(false);
        }
      };

    return {messages,loading,loadMoreMessages};

}

export default useGetMessage
