import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import { API_BASE_URL } from "../../constants/config";
import styles from "../style/ketquatimkiem.style";
import UserHeader from "./tieude";

const KetQuaTimKiem = () => {
  const { q } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchKetQua = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/timkiem?q=${q}`);
        setData(res.data);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };

    if (q) fetchKetQua();
  }, [q]);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Tiêu đề trang */}
      <UserHeader />

      {/* Nút trở về */}
      <Pressable
        onPress={() => router.back()}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Ionicons name="arrow-back" size={20} color="#007AFF" />
        <Text style={{ marginLeft: 5, color: "#007AFF", fontSize: 16 }}>
          Quay lại
        </Text>
      </Pressable>

      <Text style={styles.pageTitle}>🔍 Kết quả tìm kiếm</Text>
      <Text style={styles.header}>Cho từ khóa: "{decodeURIComponent(q as string)}"</Text>

      {/* Di tích */}
      {data?.diTich?.map((item: any) => (
        <Pressable
          key={item._id}
          style={styles.card}
          onPress={() => router.push(`/screen/ditichchitiet?id=${item._id}`)}
        >
          {item.media?.[0]?.url && (
            <Image source={{ uri: item.media[0].url }} style={styles.image} />
          )}
          <Text style={styles.title}>🗿 Di tích: {item.ten}</Text>
        </Pressable>
      ))}

      {/* Sự kiện */}
      {data?.suKien?.map((item: any) => (
        <Pressable
          key={item._id}
          style={styles.card}
          onPress={() => router.push(`/screen/sukienchitiet?id=${item._id}`)}
        >
          {item.media?.[0]?.url && (
            <Image source={{ uri: item.media[0].url }} style={styles.image} />
          )}
          <Text style={styles.title}>📅 Sự kiện: {item.ten}</Text>
        </Pressable>
      ))}

      {/* Phong tục */}
      {data?.phongTuc?.map((item: any) => (
        <Pressable
          key={item._id}
          style={styles.card}
          onPress={() => router.push(`/screen/phongtucchitiet?id=${item._id}`)}
        >
          {item.media?.[0]?.url && (
            <Image source={{ uri: item.media[0].url }} style={styles.image} />
          )}
          <Text style={styles.title}>🎎 Phong tục: {item.ten}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default KetQuaTimKiem;
