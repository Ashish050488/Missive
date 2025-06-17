import { useState } from "react";
import {useAuthContext} from '../context/AuthContext'
import { BaseURL } from "../Api/Urls";

const userLogout=()=>{
 const [loading,setLoading]=useState(false);
 const {setAuthUser}  = useAuthContext() 



 const logout = async ()=>{
    setLoading(true)
    try {
        const res =await fetch(BaseURL+'/api/auth/logout',{
            method:'POST',
            headers:{'Content-Type':'application/json'}
        });
        const data = await res.json();
        if(data.error){
            throw new Error(data.error)
        }
        localStorage.removeItem("chat-user")
        setAuthUser(null)
    } catch (error) {
        toast.error(error.message)
    }finally{
        setLoading(false)
    }
 }

 return {loading,logout}


}
export default userLogout;