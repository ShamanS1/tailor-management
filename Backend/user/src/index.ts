import express from 'express';
import connectDB from './config/database';
import UserRoute from './route/UserRoute';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());
app.use(cors());
connectDB();

app.use('/api/user', UserRoute);

app.listen( PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
}); 