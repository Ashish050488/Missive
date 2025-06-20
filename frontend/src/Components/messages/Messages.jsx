import React, { useEffect, useRef } from 'react'
import Message from './Message'
import  MessageSkeleton from '../../skleton/MessageSkeleton'
import useGetMessage from '../../hooks/useGetMessage'
import {useListenMessages} from '../../hooks/useListenMessages'
import useConversation from '../../zustand/useConversation';

const Messages = () => {
  const { loading, loadMoreMessages } =  useGetMessage();
  const { messages } = useConversation();

  useListenMessages()

  const  lastmessageRef = useRef();
  const messagesContainerRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastmessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);


  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) {
      loadMoreMessages(); 
    }
  };

  return (
    <div className='px-4 flex-1 overflow-auto' ref={messagesContainerRef} onScroll={handleScroll}>
     {!loading && Array.isArray(messages) && messages.length > 0 ? (
  messages.map((message) => (
    <div key={message._id} ref={lastmessageRef}>
      <Message message={message} />
    </div>
  ))
) : (
  !loading && <p>No messages found</p> // Show a fallback message when empty
)}

      {loading &&  [...Array(3)].map((_,idx)=><MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start a conversation</p>
      )}
    </div>
  )
}

export default Messages