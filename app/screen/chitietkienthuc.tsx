import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ để tránh bị đè lên vùng notch
import { WebView } from "react-native-webview"; // Thêm WebView
import styles from "../style/chitiet.style";
import { API_BASE_URL } from "@/constants/config";

const ChiTietKienThuc = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [kienThuc, setKienThuc] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // state cho Modal
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // lưu videoUrl

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/kienthuc/${id}`);
        setKienThuc(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết kiến thức:", err);
      }
    };

    fetchDetail();
  }, [id]);

  if (!kienThuc) return <Text>Đang tải...</Text>;

  const handleVideoPress = (url: string) => {
    setVideoUrl(url);
    setIsModalVisible(true); // hiển thị pop-up
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // đóng pop-up khi nhấn ngoài
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity onPress={() => router.push("/kienthuc")} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} />
      </TouchableOpacity>

      <ScrollView>
        {/* Ảnh và tiêu đề nằm cùng 1 hàng */}
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

        {/* Các nút chức năng */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="volume-up" size={18} color="#fff" />
            <Text style={styles.buttonText}>Nghe audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleVideoPress(kienThuc.videoUrl)}>
            <FontAwesome name="video-camera" size={18} color="#fff" />
            <Text style={styles.buttonText}>Xem video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="bookmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Lưu</Text>
          </TouchableOpacity>
        </View>

        {/* Nội dung */}
        <Text style={styles.content}>{kienThuc.noiDung}</Text>
      </ScrollView>

      {/* Modal Pop-up hiển thị video */}
      <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay} onTouchStart={handleCloseModal}>
            <View style={styles.modalContent}>
              {videoUrl && (
                <WebView
                  source={{ uri: videoUrl }}
                  style={{ width: '100%', height: 250 }}
                  allowsFullscreenVideo={true}
                />
              )}
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <FontAwesome name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChiTietKienThuc;
