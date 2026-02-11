import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Data Base Connected Successfully");
    } catch (error) {
        console.log("Data Base Connection Failed", error.message);
        process.exit(1);
    }
};