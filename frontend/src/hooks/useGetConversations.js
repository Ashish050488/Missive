import { useEffect, useState } from "react"
import toast from 'react-hot-toast'
import { BaseURL } from "../Api/Urls";

const useGetConversations = () => {
    const [loading,setLoading] = useState(false);
    const [conversations,setConversations]= useState([]);

    useEffect(()=>{
        const getConversations = async ()=>{
            setLoading(true);
            try {
               const res = await fetch(BaseURL + '/api/users', {
    method: 'GET',
    credentials: 'include', // 👈 This is required to send the cookie
    headers: {
        'Content-Type': 'application/json'
    }
});
                const data = await res.json();                
                if(data.error){
                    throw new Error(data.error);
                }
                setConversations(data)
                // console.log(conversations);
                
            } catch (error) {
                toast.error(error.message)
            }finally{
                setLoading(false)
            }
        }
        getConversations();
    },[]);

    return {loading,conversations}

}

export default useGetConversations
