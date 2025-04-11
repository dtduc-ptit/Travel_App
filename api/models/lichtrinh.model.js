import mongoose from 'mongoose';

const hoatDongSchema = new mongoose.Schema({
  thoiGian: {
    type: String, // ví dụ: "08:00"
    required: true,
  },
  noiDung: {
    type: String, // ví dụ: "Đến nhà nghỉ"
    required: true,
  },
  diaDiem: {
    type: String, // ví dụ: "Nhà nghỉ Hà Tĩnh"
  },
  ghiChu: String,
});

const lichTrinhSchema = new mongoose.Schema({
  tenLichTrinh: {
    type: String,
    required: true,
  },
  ngay: {
    type: Date, // ví dụ: ngày áp dụng lịch trình
    required: true,
  },
  suKien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuKien',
  },
  diTich: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiTich',
  },
  hoatDongs: [hoatDongSchema], // danh sách hoạt động theo giờ
});

export const LichTrinh = mongoose.model('LichTrinh', lichTrinhSchema);