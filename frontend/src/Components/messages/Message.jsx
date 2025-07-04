import React from 'react'
import {useAuthContext} from '../../context/AuthContext'
import useConversation from '../../zustand/useConversation';
import {extractTime} from '../../utils/extractTime'
import LazyImage from '../common/LazyImage'; // Import LazyImage

const Message = ({message}) => {
  const {authUser} = useAuthContext();
  const {selectedConversation} = useConversation()
  const fromMe = message.senderId === authUser._id;
  const chatClassName =  fromMe ? 'chat-end':'chat-start';
  const profilePic =  fromMe ? authUser?.profilePic :selectedConversation?.profilePic
  const bubbleBgColor = fromMe ? 'bg-blue-500' : '';
  const  FormattedTime = extractTime(message.createdAt)

  return (
    <div className={`chat ${chatClassName}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <LazyImage
            src={profilePic}
            alt="User Avatar"
            className='w-10 rounded-full'
            placeholderSrc='/default-avatar.png'
          />
        </div>
      </div>

        <div className={`chat-bubble text-white  ${bubbleBgColor}  p-2`}>
        {message.message}
        </div>
        <div className='chat-footer opacity-50 text-xs flex gap-1 items-center text-white'>
          {FormattedTime}
        </div>

    </div>
  )
}

export default Message