import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from '../../zustand/useConversation';
import useGetConversation from '../../hooks/useGetConversations'
import toast from 'react-hot-toast';

const SearchInput = () => {
  const [search,setSearch] = useState('');
  const {setSelectedConversations} = useConversation()
  const {conversations} = useGetConversation()

  const handleSubmit =(e)=>{
    e.preventDefault();
    if(!search) return;
    if(search.length<3){
      toast.error('Search term must be atleast 3 character long')
      return
    }

    const  conversation = conversations.find((c)=>c.fullName.toLowerCase().includes(search.toLowerCase()));
    if(conversation){
      setSelectedConversations(conversation);
      setSearch('');
    }else{
      toast.error('user not found')
    }

  }

  return (
    <form className='flex items-center gap-2' onSubmit={handleSubmit}>
      <input type="text"  placeholder='Search' className='input input-bordered rounded-full' 
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      />
      <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
        {/* Icon */}
        {/* <FaSearch /> */}
        <IoSearchSharp className='w-6 h-6 outline-none' />
      </button>
    </form>      
  )
}

export default SearchInput
