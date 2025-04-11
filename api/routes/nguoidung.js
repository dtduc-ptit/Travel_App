import express from 'express';
import { NguoiDung } from '../models/nguoidung.model.js';

const router = express.Router();

// Lấy danh sách tất cả người dùng
router.get('/', async (req, res) => {
  try {
    const nguoidung = await NguoiDung.find(); // bạn có thể thêm `.select('-password')` nếu có mật khẩu
    res.json(nguoidung);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
  }
});

export default router;
