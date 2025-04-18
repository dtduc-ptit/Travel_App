import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, TextInput, Button, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { formatDistanceToNow } from 'date-fns'; // Import thư viện để tính toán khoảng thời gian
import styles from '../style/congdong.style'; // Import style từ congdong.style.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrangCongDong = () => {
  const [baiVietList, setBaiVietList] = useState<any[]>([]);
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null); // Lưu bài viết đã chọn để comment
  const [comments, setComments] = useState<any[]>([]); // Lưu danh sách bình luận
  const [newComment, setNewComment] = useState(''); // Lưu nội dung bình luận mới
  const [modalVisible, setModalVisible] = useState(false); // Điều khiển popup
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

  useEffect(() => {
    const fetchBaiViet = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/baiviet`);
        setBaiVietList(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };

    fetchBaiViet();
  }, []);

  // Hàm mở popup bình luận và lấy danh sách bình luận
  const openCommentModal = async (postId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/luotbinhluan/${postId}`);
      setComments(response.data); // Lấy bình luận của bài viết
      setSelectedPost(postId);
      setModalVisible(true); // Mở popup bình luận
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    }
  };

  // Hàm gửi bình luận
  const submitComment = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/luotbinhluan`, {
        nguoiDung: nguoiDung?._id,
        baiViet: selectedPost,
        noiDung: newComment,
      });
      setComments([response.data, ...comments]); // Thêm bình luận mới vào đầu danh sách
      setNewComment(''); // Reset nội dung bình luận
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  const renderBaiViet = (baiViet: any) => {
    const timeAgo = formatDistanceToNow(new Date(baiViet.thoiGian), { addSuffix: true });

    return (
      <View style={styles.postContainer} key={baiViet._id}>
        {/* User Info Section */}
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

        {/* Post Content */}
        <Text style={styles.postContent}>{baiViet.noiDung}</Text>

        {/* Post Image */}
        <Image
          source={{ uri: baiViet.hinhAnh }}
          style={styles.postImage}
        />

        {/* Like, Comment, Share, Saved */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="thumbs-up" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => openCommentModal(baiViet._id)}>
            <FontAwesome name="comment" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="share" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="bookmark" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={styles.duLichText}>DU LỊCH </Text>
          <Text style={styles.haTinhText}>HÀ TĨNH</Text>
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="search" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="bell" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="bookmark" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Post Section */}
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          {/* Avatar */}
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

          {/* "Bạn đang nghĩ gì?" text - Navigate to create post screen */}
          <TouchableOpacity onPress={() => router.push('../screen/createPost')}>
            <Text style={styles.placeholderText}>Bạn đang nghĩ gì?</Text>
          </TouchableOpacity>
        </View>

        {/* Image and Video Section */}
        <View style={styles.mediaContainer}>
          {/* Image Section */}
          <View style={styles.mediaItem}>
            <FontAwesome name="image" size={24} color="black" />
            <Text style={styles.mediaText}>Hình ảnh</Text>
          </View>

          {/* Video Section */}
          <View style={styles.mediaItem}>
            <FontAwesome name="video-camera" size={24} color="black" />
            <Text style={styles.mediaText}>Video</Text>
          </View>
        </View>
      </View>

      {/* FlatList to render all posts */}
      <FlatList
        data={baiVietList}
        renderItem={({ item }) => renderBaiViet(item)}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }} // Add padding at the bottom to avoid cutting off the last item
      />

      {/* Modal for Comments */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bình luận</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <FontAwesome name="times" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* Comments */}
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

          {/* Input for new comment */}
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
              <FontAwesome name="paper-plane" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default TrangCongDong;
