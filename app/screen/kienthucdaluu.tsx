// app/screen/kienthucdaluu.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/kienthucdaluu.style";
import { API_BASE_URL } from "@/constants/config";

const KienThucDaLuu = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<any[]>([]);
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
  const fetchSavedKnowledge = async () => {
    try {
      if (nguoiDung?._id) {
        const res = await axios.get(`${API_BASE_URL}/api/noidungluutru`, {
          params: {
            nguoiDung: nguoiDung._id,
            loaiNoiDung: "kienThuc"
          }
        });
        console.log(res.data);  // Kiểm tra dữ liệu trả về từ API

        // Truy cập đúng thuộc tính data để set savedItems
        if (res.data?.data && Array.isArray(res.data.data)) {
          setSavedItems(res.data.data);  // Lưu mảng dữ liệu vào state
        } else {
          console.error("Dữ liệu không đúng định dạng hoặc không có");
          setSavedItems([]);  // Nếu dữ liệu không hợp lệ, set savedItems là mảng rỗng
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đã lưu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (nguoiDung) fetchSavedKnowledge();
}, [nguoiDung]); // Fetch lại khi nguoiDung thay đổi


  
  const renderItem = (item: any) => (
    <TouchableOpacity
      key={item._id}
      style={styles.savedItemContainer}
      onPress={() => router.push({ pathname: "../screen/chitietkienthuc", params: { id: item.idNoiDung } })}
    >
      <Image
        source={item.hinhAnh?.[0] ? { uri: item.hinhAnh[0] } : require("../../assets/images/splash-image.png")}
        style={styles.savedItemImage}
      />
      <Text style={styles.savedItemTitle} numberOfLines={2}>{item.tieuDe}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.savedHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.savedHeaderTitle}>Kiến thức đã lưu</Text>
        
       
      </View>

      {/* Nội dung chính */}
      <ScrollView contentContainerStyle={styles.savedContentContainer}>
        {savedItems.length > 0 ? (
          savedItems.map(renderItem)
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có kiến thức nào được lưu</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default KienThucDaLuu;