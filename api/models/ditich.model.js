
const diTichSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    moTa: { type: String },
    viTri: { type: String },
    danhGia: { type: Number, default: 0 },
    thoiGianCapNhat: { type: String },
    luotXem: { type: Number, default: 0 },
    huongDan: { type: String },
  
    // Liên kết tới nội dung lưu trữ
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
  
  export const DTTich = mongoose.model('DTTich', diTichSchema);
  