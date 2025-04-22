import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons"; // Thêm icon từ expo
import { API_BASE_URL } from "@/constants/config";
import styles from "../style/timkiemkienthuc.style"; // Đường dẫn đến file style của bạn

const TimKiemKienThuc = () => {
  const router = useRouter();
  const { query } = useLocalSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query || (typeof query === "string" && !query.trim())) {
        setError("Vui lòng nhập từ khóa tìm kiếm");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const encodedQuery = encodeURIComponent(
          Array.isArray(query) ? query.join(" ") : query
        );
        const res = await axios.get(`${API_BASE_URL}/api/kienthuc/search?query=${encodedQuery}`);

        if (Array.isArray(res.data)) {
          setResults(res.data);
          if (res.data.length === 0) {
            setError("Không tìm thấy kết quả nào phù hợp");
          }
        } else {
          setError(res.data.message || "Đã xảy ra lỗi khi tìm kiếm");
          setResults([]);
        }
      } catch (err) {
        if ((err as any).response) {
          const status = (err as any).response.status;
          if (status === 404) {
            setError("Không tìm thấy kết quả nào phù hợp.");
          } else {
            setError((err as any).response.data.message || "Đã xảy ra lỗi khi tìm kiếm");
          }
        } else if ((err as any).request) {
          setError("Không thể kết nối đến server. Vui lòng kiểm tra mạng.");
        } else {
          setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
        console.error("Lỗi khi tìm kiếm:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => router.push({ pathname: "../screen/chitietkienthuc", params: { id: item._id } })}
    >
      <Image
        source={
          item.hinhAnh?.[0]
            ? { uri: item.hinhAnh[0] }
            : require("../../assets/images/splash-image.png")
        }
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.tieuDe}
        </Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.noiDung?.substring(0, 100) || "Không có mô tả"}...
        </Text>
        <Text style={styles.itemDate}>
          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Kết quả tìm kiếm: <Text style={styles.queryText}>"{query}"</Text>
        </Text>
      </View>

      {/* Nội dung */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={40} color="#888" />
          <Text style={styles.emptyText}>Không tìm thấy bài viết nào.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default TimKiemKienThuc;