import { useState } from "react";
import toast from 'react-hot-toast'
import { useAuthContext } from "../context/AuthContext";
import { BaseURL } from "../Api/Urls";

const useSignup = () => {
  const [loading,setLoading] =useState(false);
  const {setAuthUser} = useAuthContext()


  // const userData = { fullName, username, password, confirmPassword, gender }

  const signup = async({ fullName, username, password, confirmPassword, gender } )=>{
    const success = handleInputErrors({ fullName, username, password, confirmPassword, gender } )
    if(!success) return false;

    setLoading(true);
    try {
      const res = await fetch(BaseURL+"/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
			});

			const data = await res.json();

       if (data.error) {
        throw new Error(data.error)
       }
       console.log(data);

       // Local storage
       localStorage.setItem("chat-user",JSON.stringify(data))
       // Context
       setAuthUser(data)


       
    } catch (error) {
      toast.error(error.message)
    }finally{
      setLoading(false)
    }

  }
  return {loading,signup}
}

export default useSignup;




//validation
function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}