import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { API_BASE_URL } from "../../constants/config";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // <-- THÊM DÒNG NÀY
import styles from "../style/tieude.style";

const UserHeader = () => {
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [soThongBaoChuaDoc, setSoThongBaoChuaDoc] = useState<number>(0);
  const router = useRouter();

  // Lấy thông tin người dùng
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

  // Tự động cập nhật số lượng thông báo chưa đọc mỗi lần focus
  useFocusEffect(
    useCallback(() => {
      const fetchSoThongBaoChuaDoc = async () => {
        if (!nguoiDung?._id) return;

        try {
          const res = await axios.get(`${API_BASE_URL}/api/thongbao/chuadoc/${nguoiDung._id}`);
          setSoThongBaoChuaDoc(res.data.soLuongChuaDoc || 0);
        } catch (error) {
          console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
        }
      };

      fetchSoThongBaoChuaDoc();
    }, [nguoiDung])
  );

  return (
    <View style={styles.headerWrapper}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "../screen/thongtincanhan",
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

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            DU LỊCH <Text style={styles.highlight}>HÀ TĨNH</Text>
          </Text>
          <Text style={styles.subTitle}>Hãy có chuyến du lịch vui vẻ</Text>
        </View>

        {/* Icon thông báo */}
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => router.push("../screen/thongbao")}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
          {soThongBaoChuaDoc > 0 && (
            <View style={styles.notificationDot} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={16} color="gray" />
        <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
      </View>
    </View>
  );
};

export default UserHeader;
