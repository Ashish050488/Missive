import mongoose from "mongoose";
const ConnectToDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Connected to db');
        
    } catch (error) {
        console.log('db connection error',error.message);
        
    }
}


export default ConnectToDb