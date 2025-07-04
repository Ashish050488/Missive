import { useState } from "react"
import {useAuthContext} from '../context/AuthContext'
import {toast} from 'react-hot-toast'
import { BaseURL } from "../Api/Urls";

const useLogin = ()=>{
    const [loading, setloading] = useState(false);
    const {setAuthUser} = useAuthContext();


    const login = async (username,password )=>{
        const success = handleInputErrors({ username, password } )
        if(!success) return false;
        setloading(true)
        try {
            const res = await fetch(BaseURL+"/api/auth/login",{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                 credentials: 'include', 
                body:JSON.stringify({username,password})
            })
            const data = await   res.json()
            if (data.error) {
                throw new Error(data.error)
            }

            localStorage.setItem("chat-user",JSON.stringify(data))
            setAuthUser(data)

        } catch (error) {
            toast.error(error.message)
        }finally{
            setloading(false)
        }
    }
return {loading,login}

}
export default useLogin;




function handleInputErrors({ username, password, }) {
	if (!username || !password ) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}