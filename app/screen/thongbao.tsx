import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import  styles  from "../style/thongbaosukien.style";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

type ThongBao = {
  _id: string;
  tieuDe: string;
  noiDung: string;
  thoiGianGui: string;
  daDoc: boolean;
  suKien: {
    _id: string; 
    ten?: string; 
  };
};



const ThongBaoScreen = () => {
  const [thongBao, setThongBao] = useState<ThongBao[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [chiHienThiChuaDoc, setChiHienThiChuaDoc] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("idNguoiDung");
        if (id) setUserId(id);
      } catch (error) {
        console.error("Lỗi lấy ID người dùng:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchThongBao = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/thongbao/${userId}`);
          setThongBao(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông báo:", error);
        }
      };
      fetchThongBao();
    }
  }, [userId]);

  const renderItem = ({ item }: { item: ThongBao }) => (
    <TouchableOpacity onPress={() => handlePressThongBao(item._id, item.suKien._id)}>
      <View
        style={[
          styles.notification,
          item.daDoc && { backgroundColor: "#f0f0f0" }, // đổi màu nếu đã đọc
        ]}
      >
        <Text style={[styles.title, item.daDoc && { fontWeight: "normal", color: "#888" }]}>
          {item.tieuDe || "Thông báo sự kiện"}
        </Text>
        <Text style={[styles.content, item.daDoc && { color: "#888" }]}>
          {item.noiDung}
        </Text>
        <Text style={styles.date}>
          {new Date(item.thoiGianGui).toLocaleDateString("vi-VN")}
        </Text>
        {!item.daDoc && <View style={styles.redDot} />}
      </View>
    </TouchableOpacity>
  );
  
  const handlePressThongBao = async (idThongBao: string, idSuKien: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/thongbao/${idThongBao}/doc`);
  
      setThongBao((prev) =>
        prev.map((tb) =>
          tb._id === idThongBao ? { ...tb, daDoc: true } : tb
        )
      );
  
      // ➤ Chuyển sang trang sự kiện chi tiết
      router.push({
        pathname: "/screen/sukienchitiet",
        params: { id: idSuKien },
      });
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nút lọc chưa đọc */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            chiHienThiChuaDoc && styles.filterButtonActive,
          ]}
          onPress={() => setChiHienThiChuaDoc(!chiHienThiChuaDoc)}
        >
          <Text
            style={[
              styles.filterText,
              chiHienThiChuaDoc && styles.filterTextActive,
            ]}
          >
            {chiHienThiChuaDoc
              ? "Hiển thị tất cả"
              : `Chưa đọc (${thongBao.filter((tb) => !tb.daDoc).length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách thông báo */}
      {thongBao.length === 0 ? (
        <Text style={styles.message}>Không có thông báo nào</Text>
      ) : (
        <>
          {
            (() => {
              const thongBaoHienThi = chiHienThiChuaDoc
                ? thongBao.filter((tb) => !tb.daDoc)
                : thongBao;

              return (
                <FlatList
                  data={thongBaoHienThi}
                  keyExtractor={(item) => item._id}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                />
              );
            })()
          }
        </>
      )}
    </SafeAreaView>

  );
};

export default ThongBaoScreen;
