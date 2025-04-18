export const uploadToCloudinary = async (localUri: string): Promise<string> => {
    const data = new FormData();
  
    data.append('file', {
      uri: localUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);
  
    data.append('upload_preset', 'TravelAPP'); // 👈 Thay bằng preset thật của bạn
  
    const res = await fetch('https://api.cloudinary.com/v1_1/dguyahutf/image/upload', {
      method: 'POST',
      body: data,
    });
  
    const result = await res.json();
  
    if (!res.ok) {
      console.error('❌ Upload thất bại:', result);
      throw new Error('Lỗi upload ảnh lên Cloudinary');
    }
  
    return result.secure_url;
  };
  