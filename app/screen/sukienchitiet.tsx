import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FontAwesome , Ionicons} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import YoutubeIframe from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/sukienchitiet.style";



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
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [moTa, setMoTa] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem("idNguoiDung");
        const res = await axios.get(`${API_BASE_URL}/api/sukien/${id}`);
        const sukien = res.data;
  
        setData(sukien);
  
        // Kiểm tra nếu người dùng đã đánh giá
        if (userId && sukien.danhGiaNguoiDung) {
          const userRating = sukien.danhGiaNguoiDung.find(
            (rating: any) => rating.userId === userId
          );
          if (userRating) {
            setSelectedRating(userRating.diem); // Cập nhật điểm đã đánh giá
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
  const handleRating = async (rating: number) => {
    setSelectedRating(rating);
    setIsSubmitting(true);
  
    try {
      const userId = await AsyncStorage.getItem("idNguoiDung");
      console.log("UserId:", userId);
      console.log("Rating:", rating);
  
      if (!userId) {
        alert("Vui lòng đăng nhập để đánh giá.");
        setIsSubmitting(false);
        return;
      }
  
      // Gửi yêu cầu đánh giá sự kiện
      const res = await axios.patch(`${API_BASE_URL}/api/sukien/${id}/danhgia`, {
        diem: rating,
        userId,
      });
      console.log("Response:", res.data);
  
      // alert(`Đánh giá sự kiện thành công: ${res.data.danhGia} ⭐`);
      alert(`Đánh giá thành công: ${rating} ⭐`);
  
      // Cập nhật lại dữ liệu sự kiện trong state
      setData((prev: any) => ({
        ...prev,
        danhGia: res.data.danhGia,
        soNguoiDanhGia: res.data.soNguoiDanhGia,
      }));
    } catch (error) {
      console.error("Lỗi khi đánh giá sự kiện:", error);
      alert("Đánh giá sự kiện thất bại");
    } finally {
      setIsSubmitting(false);
    }
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
        <Text>Không tìm thấy sự kiện.</Text>
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
                  setMainMedia(media.find((m) => m.type === "image"));
                } else {
                  setIsPlayingVideo(true);
                  setMainMedia(videoList[0]);
                }
              }}
              style={styles.videoButton}
            >
              <Text style={styles.videoButtonText}>
                {mainMedia?.type === "video" ? "🎬 Xem ảnh" : `🎬 video (${videoList.length})`}
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
              {data.danhGia ? `${data.danhGia.toFixed(1)} / 5 sao` : "Chưa có đánh giá"}
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
        <View style={styles.buttonLichTrinhContainer}>
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
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
          <Text style={{ marginRight: 8, fontSize: 18, fontWeight: "500" }}>Đánh giá:</Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)} disabled={isSubmitting}>
              <FontAwesome
                name={star <= selectedRating ? "star" : "star-o"}
                size={20} 
                color="#f1c40f"
                style={{ marginHorizontal: 3 }}
              />
            </TouchableOpacity>
          ))}
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
    </SafeAreaView>
  );
};

export default SuKienChiTiet;
