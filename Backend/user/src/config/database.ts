import mongoose from 'mongoose';

const mongoURI = 'mongodb://127.0.0.1:27017/User';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to mongoDB");
    } catch (error) {
        console.error("MongoDB connection error: " + error);
        process.exit(1);
    }
};

export default connectDB;