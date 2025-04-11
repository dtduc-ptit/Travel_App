import express from 'express';
import { PhongTuc } from '../models/phongtuc.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const phongtuc = await PhongTuc.find(); 
    res.json(phongtuc);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách phong tục' });
  }
});

export default router;
