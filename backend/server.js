import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import ConnectToDb from './db/Db.js'
import cors from 'cors'


const  app = express();
const PORT  = process.env.PORT || 4000;
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


dotenv.config();

app.use(express.json()); // to parse incoming request from req.body
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/users', userRoutes);

// app.get('/',(req,res)=>{
//    res.send("hello")
// })



app.listen(PORT ,() => { 
   ConnectToDb()
   console.log(PORT)
});
