import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ để tránh bị đè lên vùng notch
import styles from "../style/chitiet.style";
import { API_BASE_URL } from "@/constants/config";

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
          <TouchableOpacity style={styles.button}>
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
    </SafeAreaView>
  );
};

export default ChiTietKienThuc;
