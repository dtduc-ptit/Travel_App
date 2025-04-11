import { Schema, Types } from 'mongoose';

export const KienThucSchema = new Schema(
  {
    tieuDe: {
      type: String,
      required: true,
      trim: true,
    },
    noiDung: {
      type: String,
      required: true,
    },
    moTaNgan: {
      type: String,
      default: '',
    },
    tacGia: {
      type: Types.ObjectId,
      ref: 'NguoiDung',
      required: true,
    },
    hinhAnh: [
      {
        type: String, // Đường dẫn ảnh hoặc URL
      },
    ],
    the: [
      {
        type: String, // Tags như: “phuot”, “kinh-nghiem”, “du-lich-bui”
        lowercase: true,
        trim: true,
      },
    ],
    daDuyet: {
      type: Boolean,
      default: false,
    },
    soLuotXem: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);



// Trường	Ý nghĩa
// tieuDe	Tiêu đề bài viết
// noiDung	Nội dung đầy đủ
// moTaNgan	Mô tả ngắn, dùng cho preview
// tacGia	Liên kết đến người đăng
// hinhAnh	Danh sách ảnh minh họa
// the	Tags để dễ phân loại, tìm kiếm
// daDuyet	Admin kiểm duyệt
// soLuotXem	Đếm lượt đọc