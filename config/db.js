import mongoose from "mongoose";
import colors from 'colors';

// connecting db with mongoose
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Mongodb Database ${conn.connection.host}`.bgMagenta.white)
    }catch(error){
        console.log(`Error is Mongodb ${error}`.bgRed.white);
    }
}

export default connectDB;