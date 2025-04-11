import mongoose from 'mongoose';

const phongTucSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  moTa: { type: String },
  yNghia: { type: String },
  loai: { type: String },
  danhGia: { type: Number, default: 0 },
  thoiGianCapNhat: { type: Date },
  luotXem: { type: Number, default: 0 },
  diaDiem: { type: String },
  huongDan: { type: String },

  // Liên kết tới bảng NoiDungLuuTru
  noiDungLuuTru: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NoiDungLuuTru',
  },

  // Liên kết tới bảng Media (HinhAnh cũ)
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
  ],
});

export const PhongTuc = mongoose.model('PhongTuc', phongTucSchema);
