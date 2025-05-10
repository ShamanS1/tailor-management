import express from 'express';
import connectDB from './config/database';
import customerRoute from './route/CustomerRoute';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
connectDB();

app.use('/api/customer', customerRoute);

app.listen( PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
}); 