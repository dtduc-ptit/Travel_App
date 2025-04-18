import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Để tránh bị đè lên vùng notch
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // Import useRouter từ expo-router
import styles from '../style/createPost.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import Toast from 'react-native-toast-message'; // Import thư viện Toast

const CreatePostScreen = () => {
  const router = useRouter();  // Khởi tạo router từ expo-router
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [nguoiDung, setNguoiDung] = useState<any>(null);

  useEffect(() => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Ứng dụng đang chạy!',
      text2: 'Toast đang hoạt động bình thường.',
    });
  }, []);

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

  const handlePost = async () => {
    try {
      if (!content || !image) {
        console.error("Thiếu thông tin bài viết");
        return;
      }
  
      const response = await axios.post(`${API_BASE_URL}/api/baiviet`, {
        nguoiDung: nguoiDung?._id,
        noiDung: content,
        hinhAnh: image,
      });
  
      if (response.status === 201) {
        // Kiểm tra nếu Toast được gọi
        console.log('Bài viết thành công, hiển thị Toast!');
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Bài viết đã được đăng!',
          text2: 'Bài viết của bạn đã được tạo thành công.',
        });
  
        // Quay lại màn hình trước đó
        router.back();
      } else {
        console.error("Lỗi khi đăng bài:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bài viết:", error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tạo bài viết</Text>
      </View>

      <View style={styles.postContainer}>
         {/* Avatar and User Name */}
         <View style={styles.avatarContainer}>
           <TouchableOpacity
             onPress={() =>
               router.push({
                 pathname: "../screen/thongtincanhan",  // Navigate to profile page
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
        <TextInput
          style={styles.input}
          placeholder="URL hình ảnh"
          value={image}
          onChangeText={setImage}
        />
        <TouchableOpacity style={styles.button} onPress={handlePost}>
          <Text style={styles.buttonText}>Đăng</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Container */}
      <Toast />
    </SafeAreaView>
  );
};

export default CreatePostScreen;
