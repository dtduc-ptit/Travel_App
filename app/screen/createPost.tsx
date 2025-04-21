import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../style/createPost.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const CreatePostScreen = () => {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams(); // Lấy imageUri từ params (nếu có)
  console.log('Received imageUri from params:', imageUri);
  const [content, setContent] = useState('');
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null); // Lưu URL ảnh (cục bộ tạm thời hoặc Cloudinary)
  const [isUploading, setIsUploading] = useState(false); // Trạng thái upload ảnh

  // Lấy thông tin người dùng từ AsyncStorage
  useEffect(() => {
    const fetchNguoiDung = async () => {
      try {
        const idNguoiDung = await AsyncStorage.getItem("idNguoiDung");
        if (idNguoiDung) {
          const res = await axios.get(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`);
          setNguoiDung({ ...res.data, _id: idNguoiDung });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchNguoiDung();
  }, []);

  // Xử lý imageUri từ params (nếu có)
  useEffect(() => {
    if (imageUri && typeof imageUri === 'string') {
      console.log('Cập nhật image từ imageUri params:', imageUri);
      setImage(imageUri); // Lưu đường dẫn (cục bộ hoặc URL)
      // Nếu imageUri không phải URL Cloudinary (tức là đường dẫn cục bộ), upload lên Cloudinary
      if (!imageUri.startsWith('https://res.cloudinary.com')) {
        uploadImageToCloudinary(imageUri);
      }
    }
  }, [imageUri]);

  // Hàm upload ảnh lên Cloudinary
  const uploadImageToCloudinary = async (imageUri: string) => {
    try {
      setIsUploading(true);
      console.log('Bắt đầu upload ảnh:', imageUri);
      const filename = imageUri.split('/').pop();
      const fileType = filename?.split('.').pop() || 'jpg';

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: `upload.${fileType}`,
        type: `image/${fileType}`,
      } as any);
      formData.append('upload_preset', 'mobile_app');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/drsjgc393/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 15000,
        }
      );

      console.log('Upload thành công, URL:', response.data.secure_url);
      setImage(response.data.secure_url); // Cập nhật state với URL từ Cloudinary
      return response.data.secure_url;
    } catch (error) {
      console.error('Lỗi upload ảnh lên Cloudinary:', error);
      if (axios.isAxiosError(error)) {
        console.error('Chi tiết lỗi upload:', error.response?.data || error.message);
      }
      Toast.show({
        type: 'error',
        text1: 'Lỗi upload ảnh',
        text2: 'Không thể upload ảnh lên server. Vui lòng thử lại.',
      });
      setImage(null); // Reset nếu upload thất bại
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần cấp quyền truy cập ảnh!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const newImageUri = result.assets[0].uri;
      console.log('Ảnh mới được chọn:', newImageUri);
      setImage(newImageUri); // Lưu đường dẫn cục bộ để hiển thị ngay lập tức
      // Upload ảnh lên Cloudinary
      await uploadImageToCloudinary(newImageUri);
    }
  };

  // Hàm đăng bài
  const handlePost = async () => {
    if (!content || !image) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập nội dung và chọn ảnh',
      });
      return;
    }

    if (isUploading) {
      Toast.show({
        type: 'error',
        text1: 'Đang upload ảnh',
        text2: 'Vui lòng đợi ảnh upload hoàn tất trước khi đăng bài.',
      });
      return;
    }

    // Kiểm tra xem image có phải là URL hợp lệ từ Cloudinary không
    if (!image.startsWith('https://res.cloudinary.com')) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi ảnh',
        text2: 'Hình ảnh chưa được upload lên server. Vui lòng thử lại.',
      });
      console.warn('Hình ảnh chưa được upload, giá trị image:', image);
      return;
    }

    try {
      const postData = {
        nguoiDung: nguoiDung?._id,
        noiDung: content,
        hinhAnh: image, // Đảm bảo image là URL từ Cloudinary
      };
      console.log('Dữ liệu gửi lên server:', postData);

      const token = await AsyncStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await axios.post(
        `${API_BASE_URL}/api/baiviet`,
        postData,
        config
      );
      console.log('Phản hồi từ server:', response.data);

      Toast.show({
        type: 'success',
        text1: 'Đăng bài thành công!',
      });

      setTimeout(() => router.push('/congdong'), 2000);
    } catch (error) {
      console.error('Post error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Chi tiết lỗi Axios:', error.response?.data, error.status);
      }
      Toast.show({
        type: 'error',
        text1: 'Lỗi khi đăng bài',
        text2: axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Có lỗi xảy ra từ server',
      });
    }
  };

  // Hàm xóa ảnh
  const handleRemoveImage = () => {
    setImage(null); // Reset image về null
    Toast.show({
      type: 'info',
      text1: 'Ảnh đã được xóa',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.boxHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Tạo bài viết</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handlePost}>
          <Text style={styles.buttonText}>Đăng</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.separator, { width: '100%' }]}></View>

      <View style={styles.postContainer}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../auth/trangcanhan",
                params: { id: nguoiDung?._id }
              })
            }
          >
            <Image
              source={
                nguoiDung?.anhDaiDien
                  ? { uri: nguoiDung.anhDaiDien }
                  : require("../../assets/images/logo.jpg")
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.userName}>{nguoiDung?.ten}</Text>
        </View>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChangeText={setContent}
        />

        <View style={[styles.separator, { width: '100%' }]}></View>

        {!image && (
          <TouchableOpacity style={styles.imgContainer} onPress={pickImage}>
            <Ionicons
              name="image"
              size={32}
              color="black"
              style={styles.img}
            />
            <Text>Hình ảnh</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.separator, { width: '100%' }]}></View>

        {image && (
          <View style={styles.imageActions}>
            <Image
              source={{ uri: image }}
              style={styles.selectedImage}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleRemoveImage}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.separator, { width: '100%' }]}></View>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

export default CreatePostScreen;
