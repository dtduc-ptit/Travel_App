import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Linking,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Modal from "react-native-modal";
import styles from "../style/chitiet.style";
import Slider from "@react-native-community/slider";
import { API_BASE_URL } from "@/constants/config";
import { Audio } from "expo-av"; // chuc nang nghe audio
import AsyncStorage from "@react-native-async-storage/async-storage";


const screenWidth = Dimensions.get("window").width;
const videoHeight = (screenWidth * 9) / 16; // Tỉ lệ 16:9

const ChiTietKienThuc = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [kienThuc, setKienThuc] = useState<any>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //Chuc nang nghe audio
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  //Luu kien thuc
  const [daLuu, setDaLuu] = useState(false);
  const [nguoiDung, setNguoiDung] = useState<any>(null);

  useEffect(() => {
    return () => {
      const cleanup = async () => {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      };
      cleanup();
    };
  }, [sound]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/kienthuc/${id}`);
        setKienThuc(res.data);
        console.log("Video URL:", res.data.videoUrl); // Debug URL
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết kiến thức:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  useEffect(() => {
    const updateProgress = async () => {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis);
          setDuration(status.durationMillis || 0);
          setProgress(status.positionMillis / (status.durationMillis || 1));
        }
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [sound]);


  // Luu kien thuc

  // Thêm useEffect để lấy thông tin người dùng
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
  // Thêm useEffect kiểm tra trạng thái lưu
  useEffect(() => {
    const checkLuuTru = async () => {
      if (nguoiDung && kienThuc) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/noidungluutru/kiemtra`, {
            params: {
              nguoiDung: nguoiDung._id,
              loaiNoiDung: "kienThuc",
              idNoiDung: kienThuc._id
            }
          });
          setDaLuu(res.data.daLuu);
        } catch (error) {
          console.error("Lỗi kiểm tra trạng thái lưu:", error);
        }
      }
    };
    checkLuuTru();
  }, [nguoiDung, kienThuc]);

  // Hàm chuyển đổi URL YouTube sang embed
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) {
      console.warn("URL video không tồn tại");
      return null;
    }

    // Kiểm tra domain hợp lệ
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      console.warn("Link không phải YouTube:", url);
      return null;
    }

    // Trích xuất video ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (!videoId) {
      console.warn("Không trích được Video ID từ URL:", url);
      return url; // Fallback về URL gốc
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  // Mở video bằng trình duyệt ngoài nếu WebView lỗi
  const handleOpenInBrowser = async () => {
    if (kienThuc?.videoUrl) {
      const supported = await Linking.canOpenURL(kienThuc.videoUrl);
      if (supported) {
        await Linking.openURL(kienThuc.videoUrl);
      } else {
        console.warn("Không thể mở URL:", kienThuc.videoUrl);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!kienThuc) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không tải được dữ liệu</Text>
      </View>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(kienThuc.videoUrl);

  //Chuc nang nghe audio: ham xu ly am thanh
  const playAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: kienThuc.audioUrl },
      { shouldPlay: true, volume: volume }
    );

    setSound(newSound);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setCurrentTime(status.positionMillis);
        setDuration(status.durationMillis || 0);
        setProgress(status.positionMillis / (status.durationMillis || 1));
      }
    });
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  const handleCloseModal = async () => {
    try {
      if (sound) {
        await sound.stopAsync();    // Dừng phát
        await sound.unloadAsync();  // Giải phóng tài nguyên
        setSound(null);             // Reset sound state
      }
      setIsPlaying(false);          // Reset trạng thái phát
      setCurrentTime(0);            // Reset thời gian
      setProgress(0);               // Reset progress bar
      setIsAudioVisible(false);     // Đóng modal
    } catch (error) {
      console.error("Lỗi khi đóng modal:", error);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${(+seconds < 10 ? '0' : '')}${seconds}`;
  };  

  // Luu kien thuc
  // Hàm xử lý lưu/bỏ lưu
  const handleLuu = async () => {
    if (!nguoiDung) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    try {
      if (daLuu) {
        // Gọi API xóa
        await axios.delete(`${API_BASE_URL}/api/noidungluutru`, {
          data: {
            nguoiDung: nguoiDung._id,
            loaiNoiDung: "kienThuc", 
            idNoiDung: kienThuc._id
          }
        });
      } else {
        // Gọi API tạo
        await axios.post(`${API_BASE_URL}/api/noidungluutru`, {
          nguoiDung: nguoiDung._id,
          loaiNoiDung: "kienThuc",
          idNoiDung: kienThuc._id,
          moTa: ""
        });
      }
      setDaLuu(!daLuu);
    } catch (error) {
      console.error("Lỗi khi thực hiện lưu:", error);
      alert("Thao tác thất bại, vui lòng thử lại");
    }
  };
  

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      {/* Header */}
      <TouchableOpacity onPress={() => router.push("/kienthuc")} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Thumbnail và tiêu đề */}
        <View style={styles.topRow}>
          <Image
            source={
              kienThuc?.hinhAnh?.[0]
                ? { uri: kienThuc.hinhAnh[0] }
                : require("../../assets/images/splash-image.png")
            }
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title} numberOfLines={3}>{kienThuc.tieuDe}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              setIsAudioVisible(true);
              playAudio();
            }}
          >
            <Ionicons name="volume-high" size={18} color="#fff" />
            <Text style={styles.buttonText}>Nghe audio</Text>
          </TouchableOpacity>

          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              console.log("Attempting to open video:", embedUrl || kienThuc.videoUrl);
              setIsVideoVisible(true);
            }}
          >
            <Ionicons name="videocam" size={18} color="#fff" />
            <Text style={styles.buttonText}>Xem video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleLuu}
          >
            <Ionicons 
              name={daLuu ? "bookmark" : "bookmark-outline"} 
              size={18} 
              color="#fff" 
            />
            <Text style={styles.buttonText}>
              {daLuu ? "Đã lưu" : "Lưu"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Nội dung chính */}
        <Text style={styles.content}>{kienThuc.noiDung}</Text>
      </ScrollView>

      {/* Video Modal */}
      {kienThuc.videoUrl && (
        <Modal
          isVisible={isVideoVisible}
          onBackdropPress={() => setIsVideoVisible(false)}
          onBackButtonPress={() => setIsVideoVisible(false)}
          style={styles.modal}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropTransitionOutTiming={0}
          coverScreen={false}
        >
          <View style={styles.videoContainer}>
            {embedUrl ? (
              <WebView
                source={{ 
                  uri: embedUrl,
                  headers: { 
                    'Referer': 'https://www.youtube.com',
                    'User-Agent': 'Mozilla/5.0' 
                  }
                }}
                style={{ width: screenWidth, height: videoHeight }}
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mixedContentMode="compatibility"
                startInLoadingState={true}
                onError={(syntheticEvent) => {
                  console.error('WebView error:', syntheticEvent.nativeEvent);
                  handleOpenInBrowser();
                }}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                )}
              />
            ) : (
              <View style={styles.errorContainer}>
                <Text>Link video không hợp lệ</Text>
                <TouchableOpacity onPress={handleOpenInBrowser}>
                  <Text style={styles.linkText}>Mở bằng trình duyệt</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsVideoVisible(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
  
        {/* Audio Modal */}
        <Modal
      isVisible={isAudioVisible}
      onBackdropPress={handleCloseModal}
      style={styles.audioModal}
      swipeDirection="down"
      onSwipeComplete={handleCloseModal}
    >
      <View style={styles.audioContent}>
        {/* Header */}
        <View style={styles.audioHeader}>
          <Image
            source={kienThuc?.hinhAnh?.[0] 
              ? { uri: kienThuc.hinhAnh[0] }
              : require('../../assets/images/default-audio.jpg')}
            style={styles.audioArtwork}
          />
          <View style={styles.audioInfo}>
            <Text style={styles.audioTitle} numberOfLines={1}>
              {kienThuc?.tieuDe || 'Không có tiêu đề'}
            </Text>
            <Text style={styles.audioArtist}>
              {kienThuc?.tacGia || 'Tác giả không xác định'}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progress}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>

        {/* Time info */}
        <View style={styles.timeWrapper}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        {/* Control buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity>
            <Ionicons name="play-skip-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mainControl} 
            onPress={handlePlayPause}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color="#fff" 
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="play-skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Volume control */}
        <View style={styles.volumeContainer}>
          <Ionicons name="volume-low" size={20} color="#fff" style={styles.volumeIcon} />
          <Slider
            style={{flex: 1}}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
            minimumTrackTintColor="#4a90e2"
            maximumTrackTintColor="#404040"
            thumbTintColor="#4a90e2"
          />
          <Ionicons name="volume-high" size={20} color="#fff" style={styles.volumeIcon} />
        </View>

        {/* Close button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleCloseModal}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>


    </SafeAreaView>
  );
};

export default ChiTietKienThuc;