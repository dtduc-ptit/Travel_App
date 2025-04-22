import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Image as RNImage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { formatDistanceToNow } from 'date-fns';
import styles from '../style/thongbao.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Component riêng để render từng thông báo
const ThongBaoItem = ({ item, markAsRead }: { item: any; markAsRead: (id: string) => void }) => {
  const router = useRouter();
  const timeAgo = formatDistanceToNow(new Date(item.thoiGian), { addSuffix: true });
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3); // Tỉ lệ mặc định

  const getImageAspectRatio = (uri: string, callback: (aspectRatio: number) => void) => {
    RNImage.getSize(
      uri,
      (width, height) => {
        const aspectRatio = width / height;
        callback(aspectRatio);
      },
      (error) => {
        console.error('Lỗi khi lấy kích thước ảnh:', error);
        callback(4 / 3); // Fallback tỉ lệ mặc định
      }
    );
  };

  useEffect(() => {
    if (item.baiViet?.hinhAnh) {
      getImageAspectRatio(item.baiViet.hinhAnh, (ratio) => {
        setAspectRatio(ratio);
      });
    }
  }, [item.baiViet?.hinhAnh]);

  const handlePress = async () => {
    if (!item.daDoc) {
      markAsRead(item._id);
    }
    router.push({ pathname: '../screen/chitietbaiviet', params: { postId: item.baiViet._id } });
  };

  return (
    <TouchableOpacity style={[styles.thongBaoItem, !item.daDoc && styles.unread]} onPress={handlePress}>
      <Image
        source={
          item.nguoiGui?.anhDaiDien
            ? { uri: item.nguoiGui.anhDaiDien }
            : require('../../assets/images/logo.jpg')
        }
        style={styles.avatar}
      />
      <View style={styles.thongBaoContent}>
        <Text style={styles.noiDung}>
          <Text style={styles.userName}>{item.nguoiGui?.ten}</Text> {item.noiDung}
        </Text>
        <Text style={styles.thoiGian}>{timeAgo}</Text>        
      </View>
    </TouchableOpacity>
  );
};

const ThongBaoCongDong = () => {
  const insets = useSafeAreaInsets();
  const [thongBaoList, setThongBaoList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchThongBao = async () => {
      try {
        const idNguoiDung = await AsyncStorage.getItem('idNguoiDung');
        if (!idNguoiDung) {
          Toast.show({ type: 'error', text1: 'Vui lòng đăng nhập' });
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/thongbao/congdong`, {
          params: { nguoiNhan: idNguoiDung },
        });
        setThongBaoList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể tải thông báo',
        });
      }
    };
    fetchThongBao();
  }, []);

  const markAsRead = async (thongBaoId: string) => {
   try {
     const response = await axios.put(`${API_BASE_URL}/api/thongbao/congdong/${thongBaoId}/read`);
     setThongBaoList((prev) =>
       prev.map((item) => (item._id === thongBaoId ? { ...item, daDoc: true } : item))
     );
   } catch (error: any) {
     // Kiểm tra và log lỗi chi tiết
     console.error('Lỗi khi đánh dấu đã đọc:', error);
 
     // Nếu có response từ lỗi trả về, in ra chi tiết lỗi từ response
     if (error.response) {
       console.error('Lỗi phản hồi từ hệ thống:', error.response.data);
       console.error('Mã lỗi:', error.response.status);
     } else if (error.request) {
       // Nếu không có phản hồi từ hệ thống, in ra thông tin request
       console.error('Lỗi yêu cầu:', error.request);
     } else {
       // Lỗi khác ngoài hệ thống (ví dụ lỗi trong quá trình tạo request)
       console.error('Lỗi hệ thống:', error.message);
     }
 
     // Hiển thị thông báo lỗi cho người dùng
     Toast.show({
       type: 'error',
       text1: 'Lỗi',
       text2: 'Không thể đánh dấu đã đọc',
     });
   }
 };

 
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>
      <FlatList
        data={thongBaoList}
        renderItem={({ item }) => <ThongBaoItem item={item} markAsRead={markAsRead} />}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={40} color="#888" />
            <Text style={styles.emptyText}>Không có thông báo nào</Text>
          </View>
        }
      />
      <Toast />
    </SafeAreaView>
  );
};

export default ThongBaoCongDong;