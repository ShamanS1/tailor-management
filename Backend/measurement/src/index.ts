import express from 'express';
import connectDb from './config/database';
import measurementRoute from './route/MeasurementRoute';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());

connectDb();

app.use('/api/measurement', measurementRoute);

app.listen ( PORT , () => {
    console.log(`Server is running on http://localhost:${PORT}`);  
});