import React, { useEffect, useState } from 'react'
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast'

const useGetMessage = () => {
    const [loading,setLoading] = useState(false);
    const {messages,setMessages,selectedConversation} =  useConversation()

    useEffect(()=>{
        const getMessages = async ()=>{
            setLoading(true);
            try {
                const res = await fetch(`/api/message/${selectedConversation._id}?skip=0`); 
                const data  = await res.json()
                console.log("Fetched messages:", data);
                if(data.error) throw new Error(data.error)
                    
                    setMessages(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error(error.message)
            }finally{
                setLoading(false)
            }
        }
        if(selectedConversation?._id) getMessages();
    },[selectedConversation?._id]);
    console.log("Current messages state:", messages);

    const loadMoreMessages = async () => {
        try {
          const res = await fetch(`/api/message/${selectedConversation._id}?skip=${messages.length}`);
          const olderMessages = await res.json();
          console.log("Older messages:", olderMessages);
          setMessages((prev) => [...olderMessages, ...prev]); // Append older messages at the start
        } catch (error) {
          toast.error("Failed to load older messages");
        }
      };

    return {messages,loading,loadMoreMessages};

}

export default useGetMessage
