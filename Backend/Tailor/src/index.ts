// index.ts
import express from 'express';
import bodyParser from 'body-parser';
import tailorRoutes from './routes/tailorRoutes';
import dbConnection from './config/db';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use('/api/tailor', tailorRoutes);

// Connect to MongoDB
dbConnection();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
