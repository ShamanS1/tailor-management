import cors from 'cors';

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());
const PORT = 5010;

app.use('/api/customer', createProxyMiddleware({ target: 'http://localhost:5000/api/customer', changeOrigin: true }));
app.use('/api/tailor', createProxyMiddleware({ target: 'http://localhost:5001/api/tailor', changeOrigin: true }));
app.use('/api/order', createProxyMiddleware({ target: 'http://localhost:5002/api/order', changeOrigin: true }));
app.use('/api/measurement', createProxyMiddleware({ target: 'http://localhost:5003/api/measurement', changeOrigin: true }));
app.use('/api/review', createProxyMiddleware({ target: 'http://localhost:5004/api/review', changeOrigin: true }));
app.use('/api/user', createProxyMiddleware({ target: 'http://localhost:5005/api/user', changeOrigin: true }));


app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});