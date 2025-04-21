import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const TrangCongDong = () => {
  
  const [baiVietList, setBaiVietList] = useState<any[]>([]);
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  //Luu bai viet
  const [savedPosts, setSavedPosts] = useState<string[]>([]); // Lưu trữ các postId đã lưu
  const [daLuu, setDaLuu] = useState(false); // Trạng thái lưu bài viết
  


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

//Luu bai viet  

useEffect(() => {
  loadSavedPosts();
}, [nguoiDung?._id]);


useEffect(() => {
  const fetchSavedStatus = async () => {
    if (!nguoiDung?._id || !selectedPost) return;

    try {
      // Gọi API kiểm tra trạng thái lưu
      const response = await axios.get(`${API_BASE_URL}/api/noidungluutru/kiemtra`, {
        params: {
          nguoiDung: nguoiDung._id.toString(), // Chuyển đổi sang string theo yêu cầu API
          loaiNoiDung: "baiViet",
          idNoiDung: selectedPost.toString() // Chuyển đổi sang string
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Xử lý response theo cấu trúc API trả về { daLuu: boolean }
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
        params: (error as any)?.config?.params
      });
      setDaLuu(false);
    }
  };

  fetchSavedStatus();
}, [nguoiDung?._id, selectedPost]); // Thêm selectedPost vào dependencies




  

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

  // Luu bai viet
const loadSavedPosts = async () => {
  try {
    // 1. Load từ AsyncStorage trước (để UI phản hồi nhanh)
    const cachedSavedPosts = await AsyncStorage.getItem('savedPosts');
    if (cachedSavedPosts) {
      setSavedPosts(JSON.parse(cachedSavedPosts));
    }

    // 2. Đồng bộ với server (nếu có người dùng)
    if (nguoiDung?._id) {
      const res = await axios.get(`${API_BASE_URL}/api/noidungluutru`, {
        params: { 
          nguoiDung: nguoiDung._id, 
          loaiNoiDung: "baiViet" // Thay đổi từ "baiViet" sang loại phù hợp
        }
      });

      // Kiểm tra cấu trúc response
      const serverSavedPosts = res?.data?.data && Array.isArray(res.data.data)
        ? res.data.data.map((item: any) => item.idNoiDung)
        : [];

      setSavedPosts(serverSavedPosts);
      await AsyncStorage.setItem('savedPosts', JSON.stringify(serverSavedPosts));
    }
  } catch (error) {
    console.error('Lỗi khi load bài viết đã lưu:', error);
    // In thêm chi tiết lỗi để debug
    if ((error as any)?.response) {
      console.error('Chi tiết lỗi API:', {
        status: (error as any).response.status,
        data: (error as any).response.data
      });
    }
    // Fallback: Đặt lại state rỗng nếu có lỗi
    setSavedPosts([]);
  }
};

  
  
  // Hàm xử lý lưu/bỏ lưu
  const handleLuu = async (postId: string) => {
    if (!nguoiDung) {
      Toast.show({ type: 'error', text1: 'Vui lòng đăng nhập' });
      return;
    }
  
    try {
      const isSaved = savedPosts.includes(postId);
      let updatedSavedPosts: string[];
  
      // Optimistic update
      updatedSavedPosts = isSaved 
        ? savedPosts.filter(id => id !== postId)
        : [...savedPosts, postId];
      
      setSavedPosts(updatedSavedPosts);
      await AsyncStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
  
      // Gọi API
      if (isSaved) {
        await axios.delete(`${API_BASE_URL}/api/noidungluutru`, {
          data: { 
            nguoiDung: nguoiDung._id, 
            loaiNoiDung: "baiViet", 
            idNoiDung: postId 
          }
        });
        Toast.show({ type: 'success', text1: 'Đã bỏ lưu bài viết thành công' });
      } else {
        await axios.post(`${API_BASE_URL}/api/noidungluutru`, {
          nguoiDung: nguoiDung._id, 
          loaiNoiDung: "baiViet", 
          idNoiDung: postId
        });
        Toast.show({ type: 'success', text1: 'Đã lưu bài viết thành công' });
      }
  
    } catch (error) {
      // Rollback nếu có lỗi
      const cachedSavedPosts = await AsyncStorage.getItem('savedPosts');
      setSavedPosts(cachedSavedPosts ? JSON.parse(cachedSavedPosts) : []);
      
      Toast.show({ 
        type: 'error', 
        text1: 'Lỗi', 
        text2: 'Thao tác thất bại' 
      });
    }
  };

  //Xử lí đăng bài với hình ảnh

  // Hàm kiểm tra quyền
  const checkPermissions = async () => {
    const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (libraryStatus.status !== 'granted') {
      alert('Cần cấp quyền truy cập thư viện ảnh!');
      return false;
    }
    return true;
  };
  
  // Hàm sao chép file đến thư mục cache cố định
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
  // Hàm chọn ảnh từ thư viện
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
      // Chuyển đến màn hình tạo bài viết với đường dẫn file đã sao chép
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
            <TouchableOpacity 
              onPress={() => handleLuu(baiViet._id)}
            >
              <Ionicons 
                name={savedPosts.includes(baiViet._id) ? "bookmark" : "bookmark-outline"} 
                size={18} 
                color={savedPosts.includes(baiViet._id) ? "#007bff" : "#000"}
              />                      
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

            <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
              <Ionicons name="image" size={28} color="#007bff" style={styles.imageIcon} />
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
