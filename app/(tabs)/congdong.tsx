import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Cập nhật icon từ Ionicons
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { formatDistanceToNow } from 'date-fns'; 
import styles from '../style/congdong.style'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Thêm trạng thái like vào từng bài viết ngay khi fetch data
  useEffect(() => {
    const fetchBaiViet = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/baiviet`);
        const postsWithLikeStatus = response.data.map((post: { luotThich: string | any[]; }) => ({
          ...post,
          isLikedByUser: false, // Mặc định chưa like
          likeCount: post.luotThich?.length || 0
        }));
        setBaiVietList(postsWithLikeStatus);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };
    fetchBaiViet();
  }, []);

  const openCommentModal = async (postId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/luotbinhluan/${postId}`);
      setComments(response.data); 
      setSelectedPost(postId);
      setModalVisible(true); 
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    }
  };

  const submitComment = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/luotbinhluan`, {
        nguoiDung: nguoiDung?._id,
        baiViet: selectedPost,
        noiDung: newComment,
      });
      setComments([response.data, ...comments]); 
      setNewComment(''); 
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  const toggleLike = async (baiVietId: string) => {
    console.log('----- BẮT ĐẦU DEBUG -----');
    console.log('Bài viết ID:', baiVietId);
    
    try {
      // 1. Lấy user ID
      const nguoiDungId = await AsyncStorage.getItem('idNguoiDung');
      console.log('User ID từ AsyncStorage:', nguoiDungId || 'KHÔNG TÌM THẤY');
  
      if (!nguoiDungId) return;
  
      // 2. Tìm bài viết và clone mảng
      const postIndex = baiVietList.findIndex((p: any) => p._id === baiVietId);
      if (postIndex === -1) return;
  
      const updatedPosts = [...baiVietList]; // Khai báo biến ở đây
      const post = updatedPosts[postIndex];
  
      // 3. Log trạng thái trước khi like
      console.log('Trạng thái trước:', {
        luotThich: post.luotThich,
        likeCount: post.likeCount
      });
  
      // 4. Gọi API
      const isLiked = post.luotThich?.includes(nguoiDungId);
      const apiUrl = `${API_BASE_URL}/api/luotthich/like`;
      
      console.log('Sending request to:', apiUrl);
      console.log('Payload:', { baiVietId, nguoiDungId });
  
      if (isLiked) {
        await axios.delete(apiUrl, { data: { baiVietId, nguoiDungId } });
      } else {
        await axios.post(apiUrl, { baiVietId, nguoiDungId });
      }
  
      // 5. Cập nhật state
      updatedPosts[postIndex] = {
        ...post,
        luotThich: isLiked
          ? post.luotThich.filter((id: string) => id !== nguoiDungId)
          : [...(post.luotThich || []), nguoiDungId],
        likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1
      };
  
      setBaiVietList(updatedPosts);
  
      // 6. Log kết quả
      console.log('Trạng thái sau:', {
        luotThich: updatedPosts[postIndex].luotThich,
        likeCount: updatedPosts[postIndex].likeCount
      });
  
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
                  source={baiViet.nguoiDung?.anhDaiDien ? { uri: baiViet.nguoiDung.anhDaiDien } : require("../../assets/images/logo.jpg")}
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
          <Image
            source={{ uri: baiViet.hinhAnh }}
            style={styles.postImage}
          />
        </View>
  
        <View style={styles.itemCenter}>
          <View style={styles.postActions}>
            {/* Thumbs up icon + Like count */}
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {
                console.log('Nút like được bấm! ID:', baiViet._id); 
                toggleLike(baiViet._id);
              }}
            >
              <Ionicons
                name={baiViet.luotThich?.includes(nguoiDung?._id) ? "thumbs-up" : "thumbs-up-outline"}
                size={24}
                color={baiViet.luotThich?.includes(nguoiDung?._id) ? '#007bff' : 'black'}
              />
              <Text style={styles.actionText}>{baiViet.likeCount || 0}</Text>
            </TouchableOpacity>
    
    
              {/* Heart icon + Love count */}          
            {/* Chat bubble icon + Comment count */}
            <TouchableOpacity style={styles.actionButton} onPress={() => openCommentModal(baiViet._id)}>
              <Ionicons name="chatbubble-outline" size={24} color="black" />
              <Text style={styles.actionText}>{baiViet.luotBinhLuan?.length || 0}</Text>  {/* Hiển thị số bình luận */}
            </TouchableOpacity>
  
            {/* Other action icons */}
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
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "../screen/thongtincanhan",  
                  params: { id: nguoiDung?._id }
                })
              }
            >
              <Image
                source={nguoiDung?.anhDaiDien ? { uri: nguoiDung.anhDaiDien } : require("../../assets/images/logo.jpg")}
                style={styles.avatar}
              />
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
        data={baiVietList}
        renderItem={({ item }) => renderBaiViet(item)}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bình luận</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Image
                  source={item.nguoiDung?.anhDaiDien ? { uri: item.nguoiDung.anhDaiDien } : require("../../assets/images/logo.jpg")}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUserName}>{item.nguoiDung?.ten}</Text>
                  <Text style={styles.commentText}>{item.noiDung}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{ paddingBottom: 16 }}
          />

          <View style={styles.commentInputContainer}>
            <Image
              source={nguoiDung?.anhDaiDien ? { uri: nguoiDung.anhDaiDien } : require("../../assets/images/logo.jpg")}
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
    </SafeAreaView>
  );
};
export default TrangCongDong;

