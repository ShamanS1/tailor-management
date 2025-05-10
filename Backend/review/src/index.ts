import express from 'express';
import connectDB from './config/database'; 
import reviewRoutes from './route/ReviewRoutes'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(express.json()); 

connectDB();

app.use('/api/review', reviewRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
