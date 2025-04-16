import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
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
  const [isEditing, setIsEditing] = useState(false);
  const [tenMoi, setTenMoi] = useState("");
  const [moTaMoi, setMoTaMoi] = useState("");
  const [matKhauCu, setMatKhauCu] = useState("");
  const [dangLuu, setDangLuu] = useState(false);
  const [daBamLuu, setDaBamLuu] = useState(false);



  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNguoiDung = async () => {
      try {
        const idNguoiDung = await AsyncStorage.getItem("idNguoiDung");
        if (!idNguoiDung) return;

        const res = await axios.get(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`);
        setNguoiDung(res.data);
        setTenMoi(res.data.ten || "");
        setMoTaMoi(res.data.moTa || "");
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

  const handleLuu = async () => {
    if (!daBamLuu) {
      setDaBamLuu(true);
      return; // mới nhấn lần đầu => chỉ hiện input mật khẩu
    }
  
    if (!matKhauCu) {
      Alert.alert("Vui lòng nhập mật khẩu cũ để xác minh");
      return;
    }
  
    try {
      setDangLuu(true);
      const idNguoiDung = await AsyncStorage.getItem("idNguoiDung");
  
      // Gửi request xác minh mật khẩu
      const verifyRes = await axios.post(`${API_BASE_URL}/api/nguoidung/verify-password`, {
        userId: idNguoiDung,
        currentPassword: matKhauCu,
      });
  
      if (verifyRes.status === 200) {
        const updateRes = await axios.patch(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`, {
          ten: tenMoi,
          moTa: moTaMoi,
        });
  
        if (updateRes.status === 200) {
          setNguoiDung(updateRes.data.user);
          Alert.alert("✅ Cập nhật thành công");
  
          // reset trạng thái
          setIsEditing(false);
          setDaBamLuu(false);
          setMatKhauCu("");
        }
      }
    } catch (err: any) {
      console.error("❌ Lỗi cập nhật:", err.response?.data || err.message);
      Alert.alert("❌ Lỗi", err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setDangLuu(false);
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
      {/* Header */}
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

      {/* Thông tin cá nhân */}
      <View style={styles.infoBox}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[styles.name, { marginBottom: 8 }]}>
            Thông tin cá nhân
          </Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={{ color: "blue" }}>Thay đổi</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Tên</Text>
              <TextInput
                placeholder="Tên mới"
                value={tenMoi}
                onChangeText={setTenMoi}
                style={styles.input}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                placeholder="Mô tả mới"
                value={moTaMoi}
                onChangeText={setMoTaMoi}
                style={styles.input}
                multiline
              />
            </View>

            {daBamLuu && (
              <View style={styles.card}>
                <Text style={styles.label}>Mật khẩu xác minh</Text>
                <TextInput
                  placeholder="Nhập mật khẩu cũ"
                  secureTextEntry
                  value={matKhauCu}
                  onChangeText={setMatKhauCu}
                  style={styles.input}
                />
              </View>
            )}

            {dangLuu ? (
              <ActivityIndicator color="blue" />
            ) : (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleLuu}
              >
                <Text style={styles.saveButtonText}>💾 Lưu thay đổi</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>👤 Tên</Text>
              <Text style={styles.infoText}>{nguoiDung.ten}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>🧾 Tài khoản</Text>
              <Text style={styles.infoText}>{nguoiDung.taiKhoan}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>📧 Email</Text>
              <Text style={styles.infoText}>{nguoiDung.email}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>📝 Mô tả</Text>
              <Text style={styles.infoText}>
                {nguoiDung.moTa || "Chưa có mô tả"}
              </Text>
            </View>
          </>
        )}
      </View>
      {nguoiDung.updatedAt && (
        <View style={{ marginTop: 24 }}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteIcon}>🕒</Text>
            <Text style={styles.noteTitle}>Cập nhật gần đây</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.noteTime}>
              {new Date(nguoiDung.updatedAt).toLocaleTimeString("vi-VN")} - {new Date(nguoiDung.updatedAt).toLocaleDateString("vi-VN")}
            </Text>
          </View>
        </View>
      )}


    </View>
    
  );
};

export default ThongTinNguoiDung;
