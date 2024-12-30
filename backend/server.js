import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import ConnectToDb from './db/Db.js'

const  app = express();
const PORT  = process.env.PORT || 4000;


dotenv.config();

app.use(express.json()); // to parse incoming request from req.body
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

// app.get('/',(req,res)=>{
//    res.send("hello")
// })



app.listen(PORT ,() => { 
   ConnectToDb()
   console.log(PORT)
});
