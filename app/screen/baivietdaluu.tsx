import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/baivietdaluu.style";
import { API_BASE_URL } from "@/constants/config";

interface SavedItem {
  _id: string;
  hinhAnh: string;
  idNoiDung: string;
  thoiGianLuu: string;
  tieuDe: string;
}

interface BaiViet {
  _id: string;
  tieuDe?: string;
  noiDung: string;
  hinhAnh: string;
  nguoiDung: {
    ten: string;
    anhDaiDien: string;
  };
}

const BaiVietDaLuu = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [baiVietList, setBaiVietList] = useState<BaiViet[]>([]);
  const [nguoiDung, setNguoiDung] = useState<any>(null);

  useEffect(() => {
    const fetchNguoiDung = async () => {
      try {
        const idNguoiDung = await AsyncStorage.getItem("idNguoiDung");
        if (idNguoiDung) {
          const res = await axios.get(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`);
          setNguoiDung(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchNguoiDung();
  }, []);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        if (nguoiDung?._id) {
          const res = await axios.get(`${API_BASE_URL}/api/noidungluutru`, {
            params: {
              nguoiDung: nguoiDung._id,
              loaiNoiDung: "baiViet"
            }
          });
          console.log(res.data);

          if (res.data?.data && Array.isArray(res.data.data)) {
            setSavedItems(res.data.data);
            const baiVietPromises = res.data.data.map((item: SavedItem) =>
              axios.get(`${API_BASE_URL}/api/baiviet/${item.idNoiDung}`)
            );
            const baiVietResponses = await Promise.all(baiVietPromises);
            const baiVietData = baiVietResponses.map((response) => response.data);
            setBaiVietList(baiVietData.filter((data) => data));
          } else {
            console.error("Dữ liệu không đúng định dạng hoặc không có");
            setSavedItems([]);
            setBaiVietList([]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết đã lưu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (nguoiDung) fetchSavedArticles();
  }, [nguoiDung]);

  const renderItem = (baiViet: BaiViet, index: number) => (
    <TouchableOpacity
      key={baiViet._id}
      style={[styles.savedItemContainer, index === 0 && styles.firstItem]}
      onPress={() =>
        router.push({
          pathname: "../screen/chitietbaiviet",
          params: { id: baiViet._id },
        })
      }
    >
      <Image
        source={
          baiViet.hinhAnh
            ? { uri: baiViet.hinhAnh }
            : require("../../assets/images/splash-image.png")
        }
        style={styles.savedItemImage}
      />
      <View style={styles.textContainer}>
        <View style={styles.userContainer}>
          <Image
            source={
              baiViet.nguoiDung?.anhDaiDien
                ? { uri: baiViet.nguoiDung.anhDaiDien }
                : require("../../assets/images/splash-image.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.nguoiDungText}>{baiViet.nguoiDung?.ten || "Ẩn danh"}</Text>
        </View>
        <Text style={styles.savedItemTitle} numberOfLines={2}>
          {baiViet.noiDung || "Không có tiêu đề"}
        </Text>
        <Text style={styles.thoiGianLuu}>
          Lưu vào: {new Date(savedItems.find(item => item.idNoiDung === baiViet._id)?.thoiGianLuu || new Date()).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Đang tải bài viết...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.savedHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1E88E5" />
        </TouchableOpacity>
        <Text style={styles.savedHeaderTitle}>Bài viết đã lưu</Text>
      </View>
      <ScrollView contentContainerStyle={styles.savedContentContainer}>
        {baiVietList.length > 0 ? (
          baiVietList.map((baiViet, index) => renderItem(baiViet, index))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={80} color="#B0BEC5" />
            <Text style={styles.emptyText}>Chưa có bài viết nào được lưu</Text>
            <Text style={styles.emptySubText}>Hãy lưu bài viết để xem lại sau!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BaiVietDaLuu;