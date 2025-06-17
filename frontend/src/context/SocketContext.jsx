import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, useAuthContext } from './AuthContext';
import io from 'socket.io-client';


const SocketContext = createContext();

export const  useSocketContext = ()=>{
    return useContext(SocketContext);
}

export const SocketContextProvider = ({children})=>{

    const [socket,setSocket] = useState(null)
    const [onlineUser,setOnlineUser] = useState([]);
    const {authUser} = useAuthContext()

    useEffect(()=>{
        if(authUser){
            // https://missive.onrender.com
            // http://localhost:5000
            const socket  = io('http://localhost:5000',{ // Changed to local development URL
                query:{
                    userId:authUser._id,
                    transports: ['websocket'],
                }
            });

            setSocket(socket);

            // Listener for the initial list of online users
            socket.on('current_online_users', (users) => {
                setOnlineUser(users);
            });

            // Listener for when a new user comes online
            socket.on('user_online', (userId) => {
                setOnlineUser(prevOnlineUsers => {
                    // Ensure no duplicates, though the server-side logic with Redis Sets should prevent this
                    if (!prevOnlineUsers.includes(userId)) {
                        return [...prevOnlineUsers, userId];
                    }
                    return prevOnlineUsers;
                });
            });

            // Listener for when a user goes offline
            socket.on('user_offline', (userId) => {
                setOnlineUser(prevOnlineUsers => prevOnlineUsers.filter(id => id !== userId));
            });

            return () => {
                socket.close();
            }


            
        }else{
            if(socket){
                socket.close();
                setSocket(null)
            }
        }
    },[authUser]);

    return (<SocketContext.Provider value={{socket,onlineUser}}>{children}</SocketContext.Provider>)
    
}