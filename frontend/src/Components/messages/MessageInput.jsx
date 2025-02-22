import { useState,useRef } from 'react'; 
import {BsSend} from 'react-icons/bs'
import useSendMessage from '../../hooks/useSendMessage';

const MessageInput = () => {
  const [message,setMessage] = useState('');
  const {loading,sendMessage}=useSendMessage();
  const inputRef = useRef(null);



  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!message.trim()) return;
    await sendMessage(message);
    setMessage('');
    inputRef.current && inputRef.current.focus();
  }
  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
         ref={inputRef}
         autoFocus
        type="text" 
        className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white' 
        placeholder='Send a message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
        />
        <button type='submit'  disabled={loading} className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend/>}
        </button>
        
      </div>
    </form>
  )
}

export default MessageInput