import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { otpRouter } from './routes/otp.js';

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/otp', otpRouter);

// Connect to MongoDB
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); 
    }
};

// Start the server
const startServer = async () => {
    await dbConnect();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};


if (!process.env.MONGOURL || !process.env.PORT) {
    console.error('Required environment variables are missing');
    process.exit(1);
}

startServer();
