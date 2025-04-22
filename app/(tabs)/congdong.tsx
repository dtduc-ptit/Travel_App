import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, TextInput, Image as RNImage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { formatDistanceToNow } from 'date-fns';
import styles from '../style/congdong.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import UserHeader from '../screen/tieudecongdong';

// Component riêng để render từng bài viết
const PostItem = ({ baiViet, nguoiDung, toggleLike, openCommentModal, handleLuu, savedPosts }: any) => {
  const timeAgo = formatDistanceToNow(new Date(baiViet.thoiGian), { addSuffix: true });
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
    if (baiViet.hinhAnh) {
      getImageAspectRatio(baiViet.hinhAnh, (ratio) => {
        setAspectRatio(ratio);
      });
    }
  }, [baiViet.hinhAnh]);

  return (
    <View style={styles.postContainer} key={baiViet._id}>
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
      </View>
      <Text style={styles.postContent}>{baiViet.noiDung}</Text>
      {baiViet.hinhAnh && (
        <Image
          source={{ uri: baiViet.hinhAnh }}
          style={[styles.postImage, { aspectRatio }]}
          resizeMode="contain"
        />
      )}
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
          <TouchableOpacity style={styles.actionButton} >
            <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLuu(baiViet._id)}>
            <Ionicons
              name={savedPosts.includes(baiViet._id) ? "bookmark" : "bookmark-outline"}
              size={18}
              color={savedPosts.includes(baiViet._id) ? "#007bff" : "#000"}
            />
          </TouchableOpacity>
          
        </View>
      </View>
      <View style={[styles.separator, { width: '100%' }]}></View>
    </View>
  );
};

const TrangCongDong = () => {
  const insets = useSafeAreaInsets();
  const [baiVietList, setBaiVietList] = useState<any[]>([]);
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [daLuu, setDaLuu] = useState(false);

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

  useEffect(() => {
    loadSavedPosts();
  }, [nguoiDung?._id]);

  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!nguoiDung?._id || !selectedPost) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/noidungluutru/kiemtra`, {
          params: {
            nguoiDung: nguoiDung._id.toString(),
            loaiNoiDung: "baiViet",
            idNoiDung: selectedPost.toString(),
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.data?.daLuu !== undefined) {
          setDaLuu(response.data.daLuu);
        } else {
          console.warn("API trả về cấu trúc không mong đợi:", response.data);
          setDaLuu(false);
        }
      } catch (error) {
        console.error("Chi tiết lỗi:", {
          status: (error as any)?.response?.status,
          message: (error as any)?.response?.data?.message || (error as any)?.message,
          params: (error as any)?.config?.params,
        });
        setDaLuu(false);
      }
    };
    fetchSavedStatus();
  }, [nguoiDung?._id, selectedPost]);

  const openCommentModal = async (postId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/luotbinhluan/${postId}`);
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
        text2: 'Không thể tải bình luận',
      });
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tempComment = {
      _id: tempId,
      noiDung: newComment,
      nguoiDung: {
        _id: nguoiDung?._id,
        ten: nguoiDung?.ten || 'Bạn',
        anhDaiDien: nguoiDung?.anhDaiDien,
      },
      thoiGian: new Date().toISOString(),
      isTemp: true,
      isSending: true,
    };
    setComments(prev => [tempComment, ...prev]);
    setNewComment('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/luotbinhluan`, {
        nguoiDung: nguoiDung?._id,
        baiViet: selectedPost,
        noiDung: newComment,
      });
      setComments(prev => [
        {
          ...response.data,
          nguoiDung: tempComment.nguoiDung,
          thoiGian: response.data.thoiGian || new Date().toISOString(),
        },
        ...prev.filter(c => c._id !== tempId),
      ]);
      setBaiVietList(prev =>
        prev.map(post =>
          post._id === selectedPost
            ? { ...post, luotBinhLuan: [...(post.luotBinhLuan || []), response.data._id] }
            : post
        )
      );
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Bình luận thành công',
      });
    } catch (error) {
      setComments(prev => prev.filter(c => c._id !== tempId));
      setNewComment(tempComment.noiDung);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Gửi bình luận không thành công',
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

  const loadSavedPosts = async () => {
    try {
      const cachedSavedPosts = await AsyncStorage.getItem('savedPosts');
      if (cachedSavedPosts) {
        setSavedPosts(JSON.parse(cachedSavedPosts));
      }
      if (nguoiDung?._id) {
        const res = await axios.get(`${API_BASE_URL}/api/noidungluutru`, {
          params: {
            nguoiDung: nguoiDung._id,
            loaiNoiDung: "baiViet",
          },
        });
        const serverSavedPosts = res?.data?.data && Array.isArray(res.data.data)
          ? res.data.data.map((item: any) => item.idNoiDung)
          : [];
        setSavedPosts(serverSavedPosts);
        await AsyncStorage.setItem('savedPosts', JSON.stringify(serverSavedPosts));
      }
    } catch (error) {
      console.error('Lỗi khi load bài viết đã lưu:', error);
      if ((error as any)?.response) {
        console.error('Chi tiết lỗi API:', {
          status: (error as any).response.status,
          data: (error as any).response.data,
        });
      }
      setSavedPosts([]);
    }
  };

  const handleLuu = async (postId: string) => {
    if (!nguoiDung) {
      Toast.show({ type: 'error', text1: 'Vui lòng đăng nhập' });
      return;
    }
    try {
      const isSaved = savedPosts.includes(postId);
      let updatedSavedPosts: string[];
      updatedSavedPosts = isSaved
        ? savedPosts.filter(id => id !== postId)
        : [...savedPosts, postId];
      setSavedPosts(updatedSavedPosts);
      await AsyncStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
      if (isSaved) {
        await axios.delete(`${API_BASE_URL}/api/noidungluutru`, {
          data: {
            nguoiDung: nguoiDung._id,
            loaiNoiDung: "baiViet",
            idNoiDung: postId,
          },
        });
        Toast.show({ type: 'success', text1: 'Đã bỏ lưu bài viết thành công' });
      } else {
        await axios.post(`${API_BASE_URL}/api/noidungluutru`, {
          nguoiDung: nguoiDung._id,
          loaiNoiDung: "baiViet",
          idNoiDung: postId,
        });
        Toast.show({ type: 'success', text1: 'Đã lưu bài viết thành công' });
      }
    } catch (error) {
      const cachedSavedPosts = await AsyncStorage.getItem('savedPosts');
      setSavedPosts(cachedSavedPosts ? JSON.parse(cachedSavedPosts) : []);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Thao tác thất bại',
      });
    }
  };

  const checkPermissions = async () => {
    const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (libraryStatus.status !== 'granted') {
      alert('Cần cấp quyền truy cập thư viện ảnh!');
      return false;
    }
    return true;
  };

  const copyFileToCache = async (uri: string) => {
    try {
      const fileName = uri.split('/').pop();
      const newPath = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });
      console.log('File sao chép thành công đến:', newPath);
      return newPath;
    } catch (error) {
      console.error('Lỗi khi sao chép file:', error);
      return null;
    }
  };

  const pickImage = async () => {
    const hasPermission = await checkPermissions();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const imageUri = result.assets[0].uri;
      console.log('Ảnh được chọn:', imageUri);
      const cachedUri = await copyFileToCache(imageUri);
      if (cachedUri) {
        router.push({
          pathname: '../screen/createPost',
          params: { imageUri: cachedUri },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi xử lý ảnh',
          text2: 'Không thể sao chép file ảnh',
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <UserHeader />
      <View style={styles.postContainer}>
        <View style={styles.econtainer}>
          <View style={[styles.postHeader, styles.postHeaderWithBorder]}>
            <TouchableOpacity onPress={() => router.push({ pathname: '../auth/trangcanhan', params: { id: nguoiDung?._id } })}>
              <Image source={nguoiDung?.anhDaiDien ? { uri: nguoiDung.anhDaiDien } : require('../../assets/images/logo.jpg')} style={styles.avatar} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('../screen/createPost')} style={styles.createPostContainer}>
              <Text style={styles.placeholderText}>Bạn đang nghĩ gì?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={28} color="#007bff" style={styles.imageIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={[styles.separator, { width: '100%' }]}></View>
      <FlatList
        data={baiVietList || []}
        renderItem={({ item }) => (
          <PostItem
            baiViet={item}
            nguoiDung={nguoiDung}
            toggleLike={toggleLike}
            openCommentModal={openCommentModal}
            handleLuu={handleLuu}
            savedPosts={savedPosts}
          />
        )}
        keyExtractor={(item) => item._id ? item._id.toString() : String(item)}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide">
        <SafeAreaView style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bình luận</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={30} color="#007bff" />
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
            contentContainerStyle={{ paddingBottom: insets.bottom }}
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
          <Toast />
        </SafeAreaView>
      </Modal>
      <Toast />
    </SafeAreaView>
  );
};

export default TrangCongDong;