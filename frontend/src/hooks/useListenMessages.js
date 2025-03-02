import { useEffect } from 'react';
import {useSocketContext} from '../context/SocketContext'
import useConversation from '../zustand/useConversation'
import notification from '../assets/sound/notification.mp3'

export const useListenMessages = ()=>{
    const {socket}= useSocketContext()
    const {messages,setMessages } = useConversation();
    
    // useEffect(()=>{
    //     socket?.on('newMessage', (newMessage)=>{
    //         const sound = new Audio(notification);
    //         sound.play();
    //         setMessages([...messages,newMessage])
    //     })

    //     return ()=> socket?.off('newMessage')
    // },[socket,setMessages,messages])


    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            const sound = new Audio(notification);
            sound.play();
            
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket?.on('newMessage', handleNewMessage);

        return () => {
            socket?.off('newMessage', handleNewMessage);
        };

    }, [socket, setMessages]); 

}