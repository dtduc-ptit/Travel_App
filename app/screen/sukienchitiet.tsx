import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Pressable,
  Alert
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FontAwesome , Ionicons} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import YoutubeIframe from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Share } from 'react-native';
import styles from "../style/sukienchitiet.style";


// Define the interface for a rating (DanhGia)
interface DanhGia {
  userId: string;
  ten: string;
  anhDaiDien: string | null;
  diem: number;
  binhLuan: string;
}


const SuKienChiTiet = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [mainMedia, setMainMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [danhSachDanhGia, setDanhSachDanhGia] = useState<DanhGia[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [moTa, setMoTa] = useState('');
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem("idNguoiDung");
        const res = await axios.get(`${API_BASE_URL}/api/sukien/${id}`);
        const sukien = res.data;

        // Fetch ratings for the event
        const danhGiaRes = await axios.get(`${API_BASE_URL}/api/sukien/${id}/danhgia`);
        const danhGiaData = danhGiaRes.data;

        setData(sukien);
        setDanhSachDanhGia(danhGiaData.chiTietDanhGia || []);

        // Check if the user has already rated this event
        if (userId && sukien.danhGiaNguoiDung) {
          const userRating = sukien.danhGiaNguoiDung.find(
            (rating: any) => rating.userId === userId
          );
          if (userRating) {
            setSelectedRating(userRating.diem);
            setCommentText(userRating.binhLuan || "");
          }
        }

        await axios.patch(`${API_BASE_URL}/api/sukien/${id}/luotxem`);

        if (sukien.media?.length > 0) {
          const mediaData = await Promise.all(
            sukien.media.map(async (mediaId: string) => {
              const res = await axios.get(`${API_BASE_URL}/api/media/${mediaId}`);
              return res.data;
            })
          );
          setMedia(mediaData);

          const videos = mediaData.filter((item) => item.type === "video");
          setVideoList(videos);

          setMainMedia({ url: sukien.imageUrl, type: "image" });
        } else {
          setMainMedia({ url: sukien.imageUrl, type: "image" });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMediaPress = (item: any) => {
    setMainMedia(item);
    setIsPlayingVideo(item.type === "video");
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : "";
  };

  const handleSaveLocation = async () => {
    const idNguoiDung = await AsyncStorage.getItem("idNguoiDung");
    if (!idNguoiDung) return;
  
    try {
      // Bước 1: Gọi API kiểm tra
      const resCheck = await axios.get(`${API_BASE_URL}/api/noidungluutru/kiemtra`, {
        params: {
          nguoiDung: idNguoiDung,
          loaiNoiDung: 'SuKien',
          idNoiDung: id, 
        },
      });
  
      if (resCheck.data.daLuu) {
        Alert.alert("Bạn đã lưu sự kiện này rồi!");
        return;
      }
  
      // Bước 2: Nếu chưa có, tiến hành lưu
      await axios.post(`${API_BASE_URL}/api/noidungluutru`, {
        nguoiDung: idNguoiDung,
        loaiNoiDung: 'SuKien',
        idNoiDung: id,
        moTa: moTa
      });
  
      Alert.alert("Đã lưu sự kiện thành công!");
      setMoTa('');
      setShowSavePopup(false);
    } catch (error) {
      console.error("Lỗi khi lưu sự kiện:", error);
      Alert.alert("Có lỗi xảy ra khi lưu!");
    }
  };

  const handleNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videoList.length;
    setCurrentVideoIndex(nextIndex);
    setMainMedia(videoList[nextIndex]);
  };

  const handlePrevVideo = () => {
    const prevIndex = (currentVideoIndex - 1 + videoList.length) % videoList.length;
    setCurrentVideoIndex(prevIndex);
    setMainMedia(videoList[prevIndex]);
  };

  const fetchDanhGia = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sukien/${id}/danhgia`);
      setDanhSachDanhGia(response.data.chiTietDanhGia || []);
      setData((prev: any) => ({
        ...prev,
        danhGia: response.data.danhGia || 0,
        soNguoiDanhGia: response.data.soNguoiDanhGia || 0,
      }));
      const userId = await AsyncStorage.getItem("idNguoiDung");
      if (userId) {
        const userReview = (response.data.chiTietDanhGia || []).find(
          (review: DanhGia) => review.userId === userId
        );
        if (userReview) {
          setSelectedRating(userReview.diem);
          setCommentText(userReview.binhLuan || "");
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đánh giá:", error);
    }
  };

  const handleRating = async () => {
    // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
    if (selectedRating === 0 || !commentText.trim()) {
      setErrorMessage("Vui lòng chọn số sao và viết bình luận!");
      return;
    }
  
    setErrorMessage(""); // Xóa thông báo lỗi nếu hợp lệ
    setIsSubmitting(true);

    try {
      const userId = await AsyncStorage.getItem("idNguoiDung");
      if (!userId) {
        alert("Vui lòng đăng nhập để đánh giá.");
        setIsSubmitting(false);
        return;
      }

      const userName = await AsyncStorage.getItem("tenNguoiDung");
      const userAvatar = await AsyncStorage.getItem("anhDaiDien");

      const res = await axios.patch(`${API_BASE_URL}/api/sukien/${id}/danhgia`, {
        diem: selectedRating,
        userId,
        binhLuan: commentText,
      });

      alert(`Đánh giá thành công: ${selectedRating} ⭐`);
      await fetchDanhGia();
      setShowRatingModal(false);
    } catch (err) {
      console.error("Lỗi khi đánh giá:", err);
      alert("Đánh giá thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onShare = async () => {
    try {
      const shareMessage = `Khám phá sự kiện ${data.ten} tại ${data.diaDiem}! Đánh giá: ${data.danhGia ? data.danhGia.toFixed(1) : "Chưa có"}/5 ⭐. Xem thêm tại ứng dụng của chúng tôi!`;
      const result = await Share.share({
        message: shareMessage,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Chia sẻ thành công qua:", result.activityType);
        } else {
          console.log("Chia sẻ thành công!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Chia sẻ bị hủy");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
      alert("Chia sẻ thất bại!");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Không tìm thấy sự kiện.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          {mainMedia?.type === "video" ? (
            <View style={styles.videoContainer}>
              <YoutubeIframe
                videoId={getYouTubeId(mainMedia.url)}
                height={250}
                play={isPlayingVideo}
              />
              {videoList.length > 1 && (
                <View style={styles.videoNavigation}>
                  <TouchableOpacity onPress={handlePrevVideo} style={styles.navButton}>
                    <FontAwesome name="chevron-left" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.videoIndicator}>
                    {currentVideoIndex + 1}/{videoList.length}
                  </Text>
                  <TouchableOpacity onPress={handleNextVideo} style={styles.navButton}>
                    <FontAwesome name="chevron-right" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <Image
              source={{ uri: mainMedia?.url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          )}

          {videoList.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                if (mainMedia?.type === "video") {
                  setIsPlayingVideo(false);
                  setMainMedia({ url: data.imageUrl, type: "image" });
                } else {
                  setIsPlayingVideo(true);
                  setMainMedia(videoList[0]);
                }
              }}
              style={styles.videoButton}
            >
              <Text style={styles.videoButtonText}>
                {mainMedia?.type === "video" ? "🎬 Xem ảnh" : `🎬 Video (${videoList.length})`}
              </Text>
            </TouchableOpacity>
          )}

          {!isPlayingVideo && media.length > 1 && (
            <View style={styles.thumbnailOverlay}>
              {media
                .filter((item) => item.type === "image")
                .slice(0, 4)
                .map((item, index) => {
                  if (index === 3 && media.length > 4) {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          router.push({
                            pathname: "/screen/danhsachanh",
                            params: {
                              ten: data.ten,
                              doiTuong: "SuKien",
                              doiTuongId: data._id,
                              type: "image",
                            },
                          })
                        }
                        style={styles.thumbnailWrapper}
                      >
                        <View style={[styles.thumbnail, styles.moreOverlay]}>
                          <Text style={styles.moreText}>+{media.length - 3}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleMediaPress(item)}
                      style={styles.thumbnailWrapper}
                    >
                      <Image source={{ uri: item.url }} style={styles.thumbnail} />
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{data.ten}</Text>

            <TouchableOpacity
              style={styles.optionButtonSmall}
              onPress={() => setShowSavePopup(true)}
            >
              <Ionicons name="bookmark-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <FontAwesome name="map-marker" size={16} color="#666" />
            <Text style={styles.location}>{data.diaDiem}</Text>
          </View>

          <View style={styles.row}>
            <FontAwesome name="calendar" size={16} color="#666" />
            <Text style={styles.time}>
              {data.thoiGianBatDau} - {data.thoiGianKetThuc}
            </Text>
          </View>

          <View style={styles.row}>
            <FontAwesome name="eye" size={16} color="#666" />
            <Text style={styles.views}>{data.luotXem + 1} lượt xem</Text>
          </View>

          <View style={styles.row}>
            <FontAwesome name="star" size={16} color="#f1c40f" />
            <Text style={styles.views}>
              {data.danhGia ? `${data.danhGia.toFixed(1)} / 5` : "Chưa có đánh giá"}
            </Text>
          </View>

          {data.soNguoiDanhGia > 0 && (
            <Text style={styles.subText}>
              ({data.soNguoiDanhGia} người đã đánh giá)
            </Text>
          )}

          <Text style={styles.subTitle}>Mô tả</Text>
          <Text style={styles.content}>{data.moTa}</Text>

          {data.huongDan && (
            <>
              <Text style={styles.subTitle}>Hướng dẫn</Text>
              <Text style={styles.content}>{data.huongDan}</Text>
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonLichTrinh}
            onPress={() =>
              router.push({
                pathname: "/screen/lichtrinh",
                params: { suKienId: data._id },
              })
            }
          >
            <Text style={styles.buttonLichTrinhText}>Xem lịch trình</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => setShowRatingModal(true)}
          >
            <Text style={styles.rateButtonText}>Viết đánh giá</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={onShare}
          >
            <Text style={styles.shareButtonText}>📤 Chia sẻ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.subTitle}>Đánh giá từ người dùng</Text>
          {danhSachDanhGia && danhSachDanhGia.length > 0 ? (
            danhSachDanhGia.map((item, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{
                      uri: item.anhDaiDien || "https://via.placeholder.com/40",
                    }}
                    style={styles.reviewerAvatar}
                  />
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{item.ten || "Người dùng"}</Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <FontAwesome
                          key={num}
                          name="star"
                          size={16}
                          color={num <= item.diem ? "#f1c40f" : "#ccc"}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{item.binhLuan}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.subText}>Chưa có đánh giá nào.</Text>
          )}
        </View>


        {/* Popup nhập mô tả */}
        {showSavePopup && (
          <View style={styles.popupOverlay}>
            <View style={styles.popupBox}>
              <Text style={styles.popupTitle}>Nhập mô tả</Text>
              <TextInput
                style={styles.popupInput}
                placeholder="Sự kiện này có ý nghĩa gì với bạn?"
                value={moTa}
                onChangeText={setMoTa}
                multiline
              />
              <View style={styles.popupButtons}>
                <TouchableOpacity onPress={handleSaveLocation} style={styles.saveBtn}>
                  <Text style={{ color: "#fff" }}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowSavePopup(false)}
                  style={styles.cancelBtn}
                >
                  <Text>❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
  
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showRatingModal}
        onRequestClose={() => setShowRatingModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowRatingModal(false)}
        >
          <View style={styles.modalContainer}>
            <Pressable style={styles.modalContent}>
              <Text style={styles.modalTitle}>Đánh giá của bạn</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setSelectedRating(num)}
                  >
                    <FontAwesome
                      name="star"
                      size={32}
                      color={selectedRating >= num ? "#f1c40f" : "#ccc"}
                      style={{ marginHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.commentInputContainer}>
                <TextInput
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  style={styles.commentInput}
                />
              </View>
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowRatingModal(false);
                    setErrorMessage(""); // Xóa thông báo lỗi khi đóng modal
                  }}
                >
                  <Text style={styles.modalButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    isSubmitting && styles.disabledButton,
                  ]}
                  onPress={handleRating}
                  disabled={isSubmitting}
                >
                  <Text style={styles.modalButtonText}>
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SuKienChiTiet;