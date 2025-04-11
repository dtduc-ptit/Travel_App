import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/nguoidung.js'; // nhớ thêm .js
import phongtucRoutes from './routes/phongtuc.js'; // nhớ thêm .js

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Sử dụng route
app.use('/api/users', userRoutes);
app.use('/api/phongtucs', phongtucRoutes);

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
