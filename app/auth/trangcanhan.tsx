import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { API_BASE_URL } from "../../constants/config";
import { useRouter } from "expo-router";
import styles from "../style/trangcanhan.style";
import { useNavigation } from "@react-navigation/native";

const TrangCaNhan = () => {
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const router = useRouter();
    const navigation = useNavigation();

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
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("idNguoiDung");
      router.replace("../auth/login");
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  return (
    <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
            <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "600" }}>Trang cá nhân</Text>
        </View>

    {/* Header */}
    <View style={styles.topHeader}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
        onPress={() =>
            router.push({
            pathname: "/auth/trangcanhan",
            params: { id: nguoiDung?._id }
            })
        }
        >
        <Image
            source={
            nguoiDung?.anhDaiDien
                ? { uri: nguoiDung.anhDaiDien }
                : require("../../assets/images/logo.jpg")
            }
            style={styles.avatar}
        />
        </TouchableOpacity>

        <View style={styles.rightSection}>
        <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
            router.push({
                pathname: "../screen/thongtincanhan",
                params: { id: nguoiDung?._id }
            })
            }
        >
            <Text style={styles.profileButtonText}>Xem thông tin cá nhân</Text>
        </TouchableOpacity>

        <View style={styles.iconRow}>
            <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => router.push("../screen/thongbao")}
            >
            <Ionicons name="notifications-outline" size={22} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity onPress={logout}>
            <FontAwesome name="sign-out" size={22} color="red" />
            </TouchableOpacity>
        </View>
        </View>
        </View>
    </View>

    
        {/* Nội dung chính */}
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: 16 }}>
                <Text>
                    Nội dung đã lưu
                </Text>
            </View>

        </ScrollView>
    </View>

  );
};

export default TrangCaNhan;
