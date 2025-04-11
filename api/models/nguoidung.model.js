import mongoose from 'mongoose';

const nguoiDungSchema = new mongoose.Schema({
  ten: {
    type: String,
    required: true,
  },
  taiKhoan: {
    type: String,
    required: true,
    unique: true,
  },
  matKhau: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  anhDaiDien: String,
  moTa: String,
  ngayTao: {
    type: Date,
    default: Date.now,
  },
  yeuThich: {
    type: Number,
    default: 0,
  },

  // Một người dùng có thể viết nhiều bài viết
  baiViets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiViet',
  }],

  // Lượt thích mà người dùng đã thực hiện
  luotThichs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LuotThich',
  }],

  // Bình luận mà người dùng đã đăng
  binhLuans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LuotBinhLuan',
  }],

  // Nội dung lưu trữ của người dùng
  noiDungLuuTrus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NoiDungLuuTru',
  }],

  // Thông báo gửi tới người dùng
  thongBaos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThongBao',
  }],

  // Lịch sử tìm kiếm
  lichSuTimKiems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LichSuTimKiem',
  }],
});

export const NguoiDung = mongoose.model('NguoiDung', nguoiDungSchema);
