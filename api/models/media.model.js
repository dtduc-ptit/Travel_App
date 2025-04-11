import mongoose from 'mongoose';

const media = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  doiTuong: {
    type: String,
    enum: ['SuKien', 'DTTich', 'PhongTuc'], // Tùy vào đối tượng gắn media
    required: true,
  },
  doiTuongId: {
    type: mongoose.Schema.Types.String,
    required: true,
    refPath: 'doiTuong',
  },
  moTa: {
    type: String,
  },
}, {
  timestamps: true,
});
export const Media = mongoose.model('Media', media);