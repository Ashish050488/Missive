import path from 'path'
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import ConnectToDb from './db/Db.js'
import cors from 'cors'
import { app, server } from "./socket/socket.js";

dotenv.config();
const PORT  = process.env.PORT || 4000;
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const __dirname = path.resolve(); 


app.use(express.json()); // to parse incoming request from req.body
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname,'/frontend/dist')));
app.get('*',(req,res)=>{
   res.sendFile(path.join(__dirname,'/frontend','dist','index.html'))
})

// app.get('/',(req,res)=>{
//    res.send("hello")
// })



server.listen(PORT ,() => { 
   ConnectToDb()
   console.log(PORT)
});
