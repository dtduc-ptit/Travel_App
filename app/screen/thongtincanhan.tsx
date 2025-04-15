import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/thongtincanhan.style";
import { useRouter, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const ThongTinNguoiDung = () => {
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNguoiDung = async () => {
      try {
        const idNguoiDung = await AsyncStorage.getItem("idNguoiDung");
        if (!idNguoiDung) {
          console.warn("Không tìm thấy ID người dùng trong AsyncStorage");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`);
        setNguoiDung(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNguoiDung();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("idNguoiDung");
      router.replace("../auth/login");
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!nguoiDung) {
    return (
      <View style={styles.centered}>
        <Text>Không tìm thấy thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nút quay lại & đăng xuất */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={logout}>
          <FontAwesome name="sign-out" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <Image
        source={
          nguoiDung.anhDaiDien
            ? { uri: nguoiDung.anhDaiDien }
            : require("../../assets/images/logo.jpg")
        }
        style={styles.avatar}
      />

      {/* Thông tin người dùng */}
      <View style={styles.infoBox}>
        <Text style={styles.name}>{nguoiDung.ten}</Text>
        <Text style={styles.infoText}>📧 Email: {nguoiDung.email}</Text>
        <Text style={styles.infoText}>👤 Tài khoản: {nguoiDung.taiKhoan}</Text>
        <Text style={styles.infoText}>📝 Mô tả: {nguoiDung.moTa || "Chưa có mô tả"}</Text>
      </View>
    </View>
  );
};

export default ThongTinNguoiDung;
