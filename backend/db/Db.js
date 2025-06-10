import mongoose from "mongoose";
const ConnectToDb = async ()=>{
    try {
        // Mongoose connection options can be passed as a second argument to mongoose.connect()
        // e.g., { poolSize: 10 } to set the connection pool size.
        // Currently, this is using Mongoose's default connection pool settings (poolSize: 5).
        // These can be tuned based on application load and database performance characteristics.
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Connected to db');
        
    } catch (error) {
        console.log('db connection error',error.message);
        
    }
}


export default ConnectToDb