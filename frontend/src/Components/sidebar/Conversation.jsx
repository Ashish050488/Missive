import React from 'react'

const Conversation = () => {
  return (
    <>
    <div className='flex gap-2 items-center hover:bg-sky-500 rounded px-2 py-1 cursor-pointer'>
        <div className='avatar online'>
            <div className='w-12 rounded-full'>
                <img src="https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg" alt="User Avatar" />
            </div>
        </div>      

        <div className='flex flex-col flex-1'>
      <div className='flex gap-3 justify-between'>
        <p className=' font-bold text-green-200'>Jhon Doe</p>
        <span className='text-xl'>🍉</span>
      </div>
    </div>

    </div>

    <div className=' divider my-0 py-0 h-1'/>
    </>

  )
}

export default Conversation
