import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/phongtucchitiet.style";
import YoutubeIframe from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-reanimated'

const PhongTucChiTiet = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [mainMedia, setMainMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moTa, setMoTa] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem("idNguoiDung");
        const res = await axios.get(`${API_BASE_URL}/api/phongtucs/${id}`);
        const phongtuc = res.data;
  
        setData(phongtuc);
  
        // Kiểm tra nếu người dùng đã đánh giá
        if (userId && phongtuc.danhGiaNguoiDung) {
          const userRating = phongtuc.danhGiaNguoiDung.find(
            (rating: any) => rating.userId === userId
          );
          if (userRating) {
            setSelectedRating(userRating.diem);
          }
        }
  
        await axios.patch(`${API_BASE_URL}/api/phongtucs/${id}/luotxem`);
  
        if (phongtuc.media?.length > 0) {
          const mediaData = await Promise.all(
            phongtuc.media.map(async (mediaId: string) => {
              const res = await axios.get(`${API_BASE_URL}/api/media/${mediaId}`);
              return res.data;
            })
          );
          setMedia(mediaData);
  
          const videos = mediaData.filter((item) => item.type === "video");
          setVideoList(videos);
  
          setMainMedia({ url: phongtuc.imageUrl, type: "image" });
        } else {
          setMainMedia({ url: phongtuc.imageUrl, type: "image" });
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
  
  const handleRating = async (rating: number) => {
    setSelectedRating(rating);
    setIsSubmitting(true);
  
    try {
      // Lấy userId từ AsyncStorage
      const userId = await AsyncStorage.getItem("idNguoiDung");
      console.log("UserId:", userId);
      console.log("Rating:", rating);
  
      if (!userId) {
        alert("Vui lòng đăng nhập để đánh giá.");
        setIsSubmitting(false);
        return;
      }
  
      // Gửi yêu cầu đánh giá lên Backend
      const res = await axios.patch(`${API_BASE_URL}/api/phongtucs/${id}/danhgia`, {
        diem: rating,
        userId,
      });
      console.log("Response:", res.data);
  
      // Hiển thị thông báo sau khi đánh giá thành công
      alert(`Đánh giá thành công: ${rating} ⭐`);
  
      // Cập nhật lại dữ liệu di tích trong state
      setData((prev: any) => ({
        ...prev,
        danhGia: res.data.danhGia,
        soNguoiDanhGia: res.data.soNguoiDanhGia,
      }));
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
      alert("Đánh giá thất bại");
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
          loaiNoiDung: 'PhongTuc',
          idNoiDung: id, 
        },
      });
  
      if (resCheck.data.daLuu) {
        Alert.alert("Bạn đã lưu phong tục này rồi!");
        return;
      }
  
      // Bước 2: Nếu chưa có, tiến hành lưu
      await axios.post(`${API_BASE_URL}/api/noidungluutru`, {
        nguoiDung: idNguoiDung,
        loaiNoiDung: 'PhongTuc',
        idNoiDung: id,
        moTa: moTa
      });
  
      Alert.alert("Đã lưu phong tục thành công!");
      setMoTa('');
      setShowSavePopup(false);
    } catch (error) {
      console.error("Lỗi khi lưu phong tục:", error);
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
        <Text>Không tìm thấy phong tục.</Text>
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
            </View>
          ) : (
            <Image
              source={{ uri: mainMedia?.url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          )}
          
          {videoList.length > 0 && (
            <View style={styles.buttonContainer}>
              {mainMedia?.type === "video" && (
                <TouchableOpacity
                  onPress={() => {
                    setIsPlayingVideo(false); 
                    router.push({
                      pathname: "/screen/danhsachvideo",
                      params: {
                        ten: data.ten,
                        doiTuong: "PhongTuc",
                        doiTuongId: data._id,
                        type: "video",
                      },
                    });
                  }}
                  style={styles.allVideosButton}
                >
                  <Text style={styles.allVideosButtonText}>Xem tất cả</Text>
                </TouchableOpacity>
              )}
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
                  {mainMedia?.type === "video" ? "🎬 Xem ảnh" : `🎬 video (${videoList.length})`}
                </Text>
              </TouchableOpacity>
            </View>
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
                              doiTuong: "PhongTuc",
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
          <Text style={styles.subTitle}>Ý nghĩa</Text>
          <Text style={styles.content}>{data.yNghia}</Text>
  
          <Text style={styles.subTitle}>Mô tả</Text>
          <Text style={styles.content}>{data.moTa}</Text>
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
                placeholder="Phong tục này có ý nghĩa gì với bạn?"
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

export default PhongTucChiTiet;