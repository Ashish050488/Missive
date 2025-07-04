import React from 'react'
import useConversation from '../../zustand/useConversation'
import { useSocketContext } from '../../context/SocketContext'
import LazyImage from '../common/LazyImage'; // Import LazyImage

const Conversation = ({conversation,lastIdx,emoji}) => {

  const {selectedConversation,setSelectedConversations} = useConversation ()
  const isSelected = selectedConversation?._id ===conversation._id
  const {onlineUser} = useSocketContext();
  const isOnline = onlineUser.includes(conversation._id)

  
  return (
    <>
    <div className={`flex gap-2 items-center hover:bg-sky-500 rounded px-2 py-1 cursor-pointer
        ${isSelected  ? 'bg-sky-500':''}
      `}
      onClick={()=>setSelectedConversations(conversation)}
      >
        <div className={`avatar ${isOnline ? 'online':''}`}>
            <div className='w-12 rounded-full'>
                <LazyImage
                    src={conversation.profilePic}
                    alt='ProfilePic'
                    className='w-12 rounded-full'
                    placeholderSrc='/default-avatar.png' // Example placeholder path
                />
            </div>
        </div>      

        <div className='flex flex-col flex-1'>
      <div className='flex gap-3 justify-between'>
        <p className=' font-bold text-green-200'>{conversation.fullName}</p>
        <span className='text-xl'>{emoji}</span>
      </div>
    </div>

    </div>

    {!lastIdx  && <div className=' divider my-0 py-0 h-1'/>}
    </>

  )
}

export default Conversation
