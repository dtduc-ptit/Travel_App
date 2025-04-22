import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ViewStyle, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { formatDistanceToNow } from 'date-fns';
import styles from '../style/chitietbaiviet.style';
import Toast from 'react-native-toast-message';

interface User {
  _id: string;
  ten?: string;
  anhDaiDien?: string;
}

interface Post {
  _id: string;
  noiDung: string;
  hinhAnh?: string;
  nguoiDung: User;
  thoiGian: string;
  luotThich: string[];
  luotBinhLuan: string[];
  likeCount: number;
}

interface Comment {
  _id: string;
  noiDung: string;
  nguoiDung: User;
  thoiGian: string;
}

const ChiTietBaiViet = () => {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const [baiViet, setBaiViet] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resolvedPostId = Array.isArray(postId) ? postId[0] : postId;

  useEffect(() => {
    const fetchBaiViet = async () => {
      if (!resolvedPostId || typeof resolvedPostId !== 'string') {
        setError('Không tìm thấy ID bài viết');
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/baiviet/${resolvedPostId}`);
        const post: Post = {
          ...response.data,
          likeCount: response.data.luotThich?.length || 0,
        };
        if (post._id !== resolvedPostId) {
          setError('Bài viết không tồn tại hoặc không khớp với ID');
          return;
        }
        setBaiViet(post);
        setError(null);
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        setError('Không thể tải bài viết');
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể tải bài viết',
        });
      }
    };

    const fetchComments = async () => {
      if (!resolvedPostId || typeof resolvedPostId !== 'string') {
        setError('Không tìm thấy ID bài viết');
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/luotbinhluan/${resolvedPostId}`);
        const sortedComments: Comment[] = response.data.sort((a: Comment, b: Comment) => {
          const dateA = new Date(a.thoiGian).getTime();
          const dateB = new Date(b.thoiGian).getTime();
          return dateB - dateA;
        });
        setComments(sortedComments);
      } catch (error) {
        console.error('Lỗi khi lấy bình luận:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể tải bình luận',
        });
      }
    };

    fetchBaiViet();
    fetchComments();
  }, [resolvedPostId]);

  if (error) {
    return (
      <SafeAreaView style={styles.container as ViewStyle}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Chi tiết bài viết</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: 'red' }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!baiViet) {
    return (
      <SafeAreaView style={styles.container as ViewStyle}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Chi tiết bài viết</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container as ViewStyle} edges={['top' as const, 'left' as const, 'right' as const]}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Chi tiết bài viết</Text>
        <View style={{ width: 30 }} />
      </View>  
        
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image
                source={
                  baiViet.nguoiDung?.anhDaiDien
                    ? { uri: baiViet.nguoiDung.anhDaiDien }
                    : require('../../assets/images/logo.jpg')
                }
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>{baiViet.nguoiDung?.ten || 'Không xác định'}</Text>
                <Text style={styles.postTime}>
                  {baiViet.thoiGian
                    ? formatDistanceToNow(new Date(baiViet.thoiGian), { addSuffix: true })
                    : 'Thời gian không xác định'}
                </Text>
              </View>
            </View>

            <Text style={styles.postContent}>{baiViet.noiDung}</Text>

            {baiViet.hinhAnh && (
              <Image
                source={{ uri: baiViet.hinhAnh }}
                style={styles.postImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.postFooter}>
              <Text style={styles.postStats}>{baiViet.likeCount} lượt thích</Text>
              <Text style={styles.postStats}>{baiViet.luotBinhLuan?.length || 0} bình luận</Text>
            </View>
          </View>
        
        <FlatList
            data={comments}
            renderItem={({ item }) => (
               <View style={styles.cmtContainer}>
                  <View style={styles.commentContainer}>
                  <Image
                     source={
                        item.nguoiDung?.anhDaiDien
                        ? { uri: item.nguoiDung.anhDaiDien }
                        : require('../../assets/images/logo.jpg')
                     }
                     style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                     <Text style={styles.commentUserName}>{item.nguoiDung?.ten || 'Không xác định'}</Text>
                     <Text style={styles.commentText}>{item.noiDung}</Text>
                  </View>
                  </View>
                  <View style={styles.cmtTime}>
                  <Text style={styles.commentTime}>
                     {item.thoiGian
                        ? formatDistanceToNow(new Date(item.thoiGian), { addSuffix: true })
                        : 'Thời gian không xác định'}
                  </Text>
                  </View>
               </View>
            )}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Toast />
    </SafeAreaView>
  );
};

export default ChiTietBaiViet;