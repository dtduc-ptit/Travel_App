import { View, Text, Image, Button } from "react-native"; 
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/thongtincanhan.style";
import { useRouter } from "expo-router"; 

const ThongTinNguoiDung = () => {
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

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

  // 👇 Hàm đăng xuất
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("idNguoiDung");
      router.replace("../auth/login"); 
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  if (loading) return <Text>Đang tải thông tin...</Text>;
  if (!nguoiDung) return <Text>Không tìm thấy thông tin người dùng</Text>;

  return (
    <View style={styles.container}>
      <Image
        source={
          nguoiDung.anhDaiDien
            ? { uri: nguoiDung.anhDaiDien }
            : require("../../assets/images/logo.jpg")
        }
        style={styles.avatar}
      />
      <Text style={styles.name}>{nguoiDung.ten}</Text>
      <Text>Email: {nguoiDung.email}</Text>
      <Text>Tài khoản: {nguoiDung.taiKhoan}</Text>
      <Text>Mô tả: {nguoiDung.moTa || "Chưa có mô tả"}</Text>


      <Button title="Đăng xuất" onPress={logout} />
    </View>
  );
};

export default ThongTinNguoiDung;
