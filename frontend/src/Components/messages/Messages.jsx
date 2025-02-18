import React, { useEffect, useRef } from 'react'
import Message from './Message'
import  MessageSkeleton from '../../skleton/MessageSkeleton'
import useGetMessage from '../../hooks/useGetMessage'


const Messages = () => {
  const {messages,loading} =  useGetMessage()
  const  lastmessageRef = useRef()
  useEffect(()=>{(
    setTimeout(() => {
      lastmessageRef.current?.scrollIntoView({behavior:'smooth'})
    }, 100)
  ),[messages]})

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {!loading && messages.length >0 && messages.map((message)=><div key={message._id} ref={lastmessageRef}>
        <Message message={message} />
      </div>)}

      {loading &&  [...Array(3)].map((_,idx)=><MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start a conversation</p>
      )}
    </div>
  )
}

export default Messages