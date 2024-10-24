import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn  = await mongoose.connect(process.env.MOGO_URI);
        console.log(`MongoDB connected : ${conn.connection.host}`);
        
    } catch (error) {
        console.log("Error connecting the Mongo DB", error.message);
        process.exit(1)
    }
}