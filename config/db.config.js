import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
    try {
        const mongoURI = process.env.MONGODB_URI;
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
        return;
    } catch (error) {
        console.error("Error connecting to MongoDB", error.message);
    }
}