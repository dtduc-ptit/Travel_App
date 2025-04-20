import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Để tránh bị đè lên vùng notch
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // Import useRouter từ expo-router
import styles from '../style/createPost.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import Toast from 'react-native-toast-message'; // Import thư viện Toast
import * as ImagePicker from 'expo-image-picker'; // Thêm ImagePicker để chọn ảnh

const { width } = Dimensions.get('window');

const CreatePostScreen = () => {
  const router = useRouter();  // Khởi tạo router từ expo-router
  const [content, setContent] = useState('');
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null); // Cho phép image là string hoặc null


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

// Hàm chọn ảnh từ thư viện
const pickImage = async () => {
  // Yêu cầu quyền truy cập thư viện ảnh
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
    setImage(result.assets[0].uri);
  }
};

// Hàm upload ảnh lên Cloudinary
const uploadImageToCloudinary = async (imageUri: string) => {
  try {
    // Tạo form data với đúng định dạng file
    const filename = imageUri.split('/').pop(); 
    const fileType = filename?.split('.').pop() || 'jpg'; // Fallback type

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: `upload.${fileType}`,
      type: `image/${fileType}`,
    } as any);
    formData.append('upload_preset', 'mobile_app');

    // Gửi request với timeout
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/drsjgc393/image/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000, // Tăng timeout lên 15 giây
      }
    );

    return response.data.secure_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Upload failed:',
        error.response?.data || error.message
      );
    }
    return null;
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
  
    const imageUrl = await uploadImageToCloudinary(image);
    
    if (!imageUrl) {
      Toast.show({
        type: 'error',
        text1: 'Tải ảnh lên thất bại',
      });
      return;
    }
  
    try {
      await axios.post(`${API_BASE_URL}/api/baiviet`, {
        nguoiDung: nguoiDung._id,
        noiDung: content,
        hinhAnh: imageUrl,
      });
  
      Toast.show({
        type: 'success',
        text1: 'Đăng bài thành công!',
      });
  
      setTimeout(() => router.push('/congdong'), 2000);
    } catch (error) {
      console.error('Post error:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi khi đăng bài',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Header with back button and title */}
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

      {/* Dấu gạch ngang phân tách */}
      <View style={[styles.separator, { width: '100%' }]}></View>

      <View style={styles.postContainer}>
         {/* Avatar and User Name */}
         <View style={styles.avatarContainer}>
           <TouchableOpacity
             onPress={() =>
               router.push({
                 pathname: "../auth/trangcanhan",  // Navigate to profile page
                 params: { id: nguoiDung?._id }
               })
             }
           >
             <Image
               source={ 
                 nguoiDung?.anhDaiDien
                   ? { uri: nguoiDung.anhDaiDien }
                   : require("../../assets/images/logo.jpg") // Default image if not set
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
      {/* Dấu gạch ngang phân tách */}
      <View style={[styles.separator, { width: '100%' }]}></View>
      {!image && (
        <TouchableOpacity  style={styles.imgContainer} onPress={pickImage} >
          <Ionicons 
            name="image" 
            size={32} 
            color="black" 
            style={styles.img}             
          />
          <Text>Hình ảnh</Text>
        </TouchableOpacity>
      )}

      {/* Hiển thị ảnh đã chọn */}
      {image && (
        <View style={styles.imageActions}>
          <Image source={{ uri: image }} style={styles.selectedImage} />
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => setImage(null)}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}

      {/* Dấu gạch ngang phân tách */}
      <View style={[styles.separator, { width: '100%' }]}></View>  
      </View>

      {/* Toast Container */}
      <Toast />
    </SafeAreaView>
  );
};

export default CreatePostScreen;
