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
import { API_BASE_URL } from "@/constants/config";

const screenWidth = Dimensions.get("window").width;
const videoHeight = (screenWidth * 9) / 16; // Tỉ lệ 16:9

const ChiTietKienThuc = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [kienThuc, setKienThuc] = useState<any>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          <TouchableOpacity style={styles.button}>
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
          
          <TouchableOpacity style={styles.button}>
            <Ionicons name="bookmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Lưu</Text>
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
    </SafeAreaView>
  );
};

export default ChiTietKienThuc;
