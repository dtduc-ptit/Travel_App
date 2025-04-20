import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Cập nhật icon từ Ionicons
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import styles from "../style/chitiet.style";
import { API_BASE_URL } from "@/constants/config";

const screenWidth = Dimensions.get("window").width;

const ChiTietKienThuc = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [kienThuc, setKienThuc] = useState<any>(null);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút back */}
      <TouchableOpacity onPress={() => router.push("/kienthuc")} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView>
        {/* Ảnh và tiêu đề */}
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

        {/* Nút chức năng */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="volume-high" size={18} color="#fff" />
            <Text style={styles.buttonText}>Nghe audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="videocam" size={18} color="#fff" />
            <Text style={styles.buttonText}>Xem video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="bookmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Lưu</Text>
          </TouchableOpacity>
        </View>

        {/* Nhúng video nếu có */}
        {kienThuc.videoUrl && (
          <View style={{ height: 200, marginBottom: 16 }}>
            <WebView
              source={{ uri: kienThuc.videoUrl }}
              style={{ flex: 1 }}
              allowsFullscreenVideo
            />
          </View>
        )}

        {/* Nội dung */}
        <Text style={styles.content}>{kienThuc.noiDung}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChiTietKienThuc;