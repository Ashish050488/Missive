import { Server } from "socket.io";
import http from 'http'
import express from 'express'



const  app = express();

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:['http://localhost:3000'],
        methods:['GET','POST']
    },
    pingInterval: 25000,  // Default is 25000ms (25 sec)
    pingTimeout: 60000,   // Default is 60000ms (60 sec)
})

export const getReceiverSocketId = (receiverId)=>{
    return userSocketMap[receiverId];
    
}

const userSocketMap = {};   //  {userid,socketid}

io.on('connection',(socket )=>{
    console.log('a user is connected',socket.id);
    const userId  = socket.handshake.query.userId;
    if(userId != 'undefined') userSocketMap[userId] = socket.id;

    //  io.emit is used to send events to all connected clients
    io.emit('getOnlineUsers',Object.keys(userSocketMap));


    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on('disconnect',()=>{
        // console.log('user disconnected',socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
        
    })
})


export {app,io,server} 
