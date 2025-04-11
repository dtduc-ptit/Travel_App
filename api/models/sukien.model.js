import mongoose from 'mongoose';

const suKienSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  moTa: { type: String },
  thoiGianBatDau: { type: String, required: true }, // time (hh:mm:ss)
  thoiGianKetThuc: { type: String },
  thoiGianCapNhat: { type: String },
  diaDiem: { type: String },
  danhGia: { type: Number, default: 0 },
  luotXem: { type: Number, default: 0 },
  huongDan: { type: String },

  // Liên kết tới nội dung chi tiết
  noiDungLuuTruId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NoiDungLuuTru',
  },

  // Danh sách media
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    }
  ]
});

export const SuKien = mongoose.model('SuKien', suKienSchema);
