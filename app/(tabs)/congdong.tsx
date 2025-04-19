import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { formatDistanceToNow } from 'date-fns';
import styles from '../style/congdong.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const TrangCongDong = () => {
  const [baiVietList, setBaiVietList] = useState<any[]>([]);
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNguoiDung = async () => {
      try {
        const idNguoiDung = await AsyncStorage.getItem('idNguoiDung');
        if (idNguoiDung) {
          const res = await axios.get(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`);
          setNguoiDung({ ...res.data, _id: idNguoiDung });
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchNguoiDung();
  }, []);

  useEffect(() => {
    const fetchBaiViet = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/baiviet`);
        const postsWithLikeStatus = response.data.map((post: { luotThich: string | any[] }) => ({
          ...post,
          isLikedByUser: false,
          likeCount: post.luotThich?.length || 0,
        }));
        setBaiVietList(postsWithLikeStatus);
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
      }
    };
    fetchBaiViet();
  }, []);

  const openCommentModal = async (postId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/luotbinhluan/${postId}`);
      
      // Sắp xếp bình luận theo thời gian giảm dần (mới nhất đầu tiên)
      const sortedComments = response.data.sort((a: any, b: any) => {
        const dateA = new Date(a.thoiGian).getTime();
        const dateB = new Date(b.thoiGian).getTime();
        return dateB - dateA;
      });
      
      setComments(sortedComments);
      setSelectedPost(postId);
      setModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi lấy bình luận:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể tải bình luận'
      });
    }
  };
  

  const submitComment = async () => {
    if (!newComment.trim()) return;
  
    // Tạo ID tạm độc nhất
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 1. Tạo bình luận tạm với animation
    const tempComment = {
      _id: tempId,
      noiDung: newComment,
      nguoiDung: {
        _id: nguoiDung?._id,
        ten: nguoiDung?.ten || 'Bạn',
        anhDaiDien: nguoiDung?.anhDaiDien
      },
      thoiGian: new Date().toISOString(),
      isTemp: true,
      isSending: true // Thêm trạng thái loading
    };
  
    // 2. Optimistic update
    setComments(prev => [tempComment, ...prev]);
    setNewComment('');
  
    try {
      // 3. Gọi API
      const response = await axios.post(`${API_BASE_URL}/api/luotbinhluan`, {
        nguoiDung: nguoiDung?._id,
        baiViet: selectedPost,
        noiDung: newComment,
      });
  
      // 4. Thay thế bằng dữ liệu thật
      setComments(prev => [
        {
          ...response.data,
          nguoiDung: tempComment.nguoiDung,
          thoiGian: response.data.thoiGian || new Date().toISOString()
        },
        ...prev.filter(c => c._id !== tempId)
      ]);
  
      // 5. Cập nhật UI
      setBaiVietList(prev => prev.map(post => 
        post._id === selectedPost 
          ? { ...post, luotBinhLuan: [...(post.luotBinhLuan || []), response.data._id] } 
          : post
      ));
  
    } catch (error) {
      // 6. Rollback UI
      setComments(prev => prev.filter(c => c._id !== tempId));
      setNewComment(tempComment.noiDung);
      
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Gửi bình luận không thành công'
      });
    }
  };
  
  
  

  const toggleLike = async (baiVietId: string) => {
    console.log('----- BẮT ĐẦU DEBUG -----');
    console.log('Bài viết ID:', baiVietId);

    try {
      const nguoiDungId = await AsyncStorage.getItem('idNguoiDung');
      console.log('User ID từ AsyncStorage:', nguoiDungId || 'KHÔNG TÌM THẤY');

      if (!nguoiDungId) return;

      const postIndex = baiVietList.findIndex((p: any) => p._id === baiVietId);
      if (postIndex === -1) return;

      const updatedPosts = [...baiVietList];
      const post = updatedPosts[postIndex];

      const isLiked = post.luotThich?.includes(nguoiDungId);
      const apiUrl = `${API_BASE_URL}/api/luotthich/like`;

      console.log('Sending request to:', apiUrl);
      console.log('Payload:', { baiVietId, nguoiDungId });

      if (isLiked) {
        await axios.delete(apiUrl, { data: { baiVietId, nguoiDungId } });
      } else {
        await axios.post(apiUrl, { baiVietId, nguoiDungId });
      }

      updatedPosts[postIndex] = {
        ...post,
        luotThich: isLiked
          ? post.luotThich.filter((id: string) => id !== nguoiDungId)
          : [...(post.luotThich || []), nguoiDungId],
        likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
      };

      setBaiVietList(updatedPosts);
    } catch (error) {
      console.error('----- LỖI -----', error);
    }
  };

  const renderBaiViet = (baiViet: any) => {
    const timeAgo = formatDistanceToNow(new Date(baiViet.thoiGian), { addSuffix: true });

    return (
      <View style={styles.postContainer} key={baiViet._id}>
        <View style={styles.imageJustify}>
          <View style={styles.postContentCover}>
            <View style={styles.postHeader}>
              <TouchableOpacity>
                <Image
                  source={baiViet.nguoiDung?.anhDaiDien ? { uri: baiViet.nguoiDung.anhDaiDien } : require('../../assets/images/logo.jpg')}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{baiViet.nguoiDung?.ten}</Text>
                <Text style={styles.postTime}>{timeAgo}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>{baiViet.noiDung}</Text>
          </View>
          <Image source={{ uri: baiViet.hinhAnh }} style={styles.postImage} />
        </View>

        <View style={styles.itemCenter}>
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(baiViet._id)}>
              <Ionicons
                name={baiViet.luotThich?.includes(nguoiDung?._id) ? 'thumbs-up' : 'thumbs-up-outline'}
                size={24}
                color={baiViet.luotThich?.includes(nguoiDung?._id) ? '#007bff' : 'black'}
              />
              <Text style={styles.actionText}>{baiViet.likeCount || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => openCommentModal(baiViet._id)}>
              <Ionicons name="chatbubble-outline" size={24} color="black" />
              <Text style={styles.actionText}>{baiViet.luotBinhLuan?.length || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={styles.duLichText}>DU LỊCH </Text>
          <Text style={styles.haTinhText}>HÀ TĨNH</Text>
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="bookmark-outline" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.postContainer}>
        <View style={styles.econtainer}>
          <View style={[styles.postHeader, styles.postHeaderWithBorder]}>
            <TouchableOpacity onPress={() => router.push({ pathname: '../auth/trangcanhan', params: { id: nguoiDung?._id } })}>
              <Image source={nguoiDung?.anhDaiDien ? { uri: nguoiDung.anhDaiDien } : require('../../assets/images/logo.jpg')} style={styles.avatar} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('../screen/createPost')} style={styles.createPostContainer}>
              <Text style={styles.placeholderText}>Bạn đang nghĩ gì?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="image-outline" size={32} color="black" style={styles.imageIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>


      <FlatList
        data={baiVietList || []}
        renderItem={({ item }) => renderBaiViet(item)}
        keyExtractor={(item) => item._id ? item._id.toString() : String(item)}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide">
        <SafeAreaView style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bình luận</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments || []}
            renderItem={({ item }) => (
              <View style={styles.cmtContainer}>
                <View style={styles.commentContainer}>
                  <Image
                    source={item.nguoiDung?.anhDaiDien ? { uri: item.nguoiDung.anhDaiDien } : require('../../assets/images/logo.jpg')}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUserName}>{item.nguoiDung?.ten || 'Không xác định'}</Text>
                    <Text style={styles.commentText}>{item.noiDung}</Text>
                  </View>
                </View>
                <View style={styles.cmtTime}>
                  <Text style={styles.commentTime}>
                    {item.thoiGian ? formatDistanceToNow(new Date(item.thoiGian), { addSuffix: true }) : 'Thời gian không xác định'}
                  </Text>
                  <TouchableOpacity style={styles.repButton}>
                    <Text style={styles.repButtontext}>Trả lời</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id ? item._id.toString() : String(item)}
            contentContainerStyle={{ paddingBottom: 16 }}
          />


          <View style={styles.commentInputContainer}>
            <Image
              source={nguoiDung?.anhDaiDien ? { uri: nguoiDung.anhDaiDien } : require('../../assets/images/logo.jpg')}
              style={styles.commentInputAvatar}
            />
            <TextInput
              style={styles.commentInput}
              placeholder="Viết bình luận..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={submitComment} style={styles.sendButton}>
              <Ionicons name="paper-plane-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Toast />
    </SafeAreaView>
  );
};

export default TrangCongDong;
