// src/schemas/bai-viet.schema.ts

import { Schema, Types } from 'mongoose';

export const BaiVietSchema = new Schema(
  {
    // Tham chiếu người dùng viết bài
    nguoiDung: {
      type: Types.ObjectId,
      ref: 'NguoiDung',
      required: true,
    },

    // Đường dẫn hình ảnh đại diện của bài viết
    hinhAnh: {
      type: String,
      required: true,
    },

    noiDung: {
        type: String,
        required: true,
      },

    // Thời gian đăng bài
    thoiGian: {
      type: Date,
      default: Date.now,
    },

    // Danh sách lượt thích liên kết
    luotThich: [
      {
        type: Types.ObjectId,
        ref: 'LuotThich',
      },
    ],

    // Danh sách bình luận liên kết
    luotBinhLuan: [
      {
        type: Types.ObjectId,
        ref: 'LuotBinhLuan',
      },
    ],
  },
  {
    timestamps: true, // tự động tạo createdAt & updatedAt
  },
);
