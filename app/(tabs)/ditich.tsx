import React, { useEffect, useState } from "react";
import styles from '../style/ditich.style';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import { GestureHandlerRootView, ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const TrangDiTich = () => {
  const router = useRouter();
  const route = useRoute();
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");
  const [nguoiDung, setNguoiDung] = useState<{ ten: string; anhDaiDien?: string } | null>(null);

  const locations = ["Tất cả", "Hương Sơn", "Hương Khê"];

  useEffect(() => {
    const fetchNguoiDung = async () => {
      try {
        const idNguoiDung = await AsyncStorage.getItem("idNguoiDung"); // Lấy ID người dùng từ AsyncStorage
        if (idNguoiDung) {
          const res = await axios.get(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`);
          setNguoiDung(res.data);
        } else {
          console.error("Không tìm thấy ID người dùng trong AsyncStorage");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchNguoiDung();
  }, []); // Chạy 1 lần khi component mount

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/ditich/noibat`, {
          params: selectedLocation !== "Tất cả" ? { diaDiem: selectedLocation } : {},
        });
        setFeaturedPlaces(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch di tích nổi bật:", error);
      }
    };

    const fetchPopular = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/ditich/phobien`);
        setPopularPlaces(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch di tích phổ biến:", error);
      }
    };

    const fetchViewed = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/ditich/xemnhieu`);
        setMostViewed(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch di tích xem nhiều:", error);
      }
    };

    fetchFeatured();
    fetchPopular();
    fetchViewed();
  }, [selectedLocation]);

  const renderItem = ({ item }: { item: { _id: string; ten: string; imageUrl: string } }) => (
    <TouchableOpacity
      style={styles.featuredItem}
      onPress={() => router.push({ pathname: "/screen/ditichchitiet", params: { id: item._id } })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.placeText}>{item.ten}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header mới */}
        <View style={styles.topHeader}>
          {/* Avatar bên trái */}
          <TouchableOpacity>
            <Image
              source={
                nguoiDung?.anhDaiDien
                  ? { uri: nguoiDung.anhDaiDien }
                  : require("../../assets/images/logo.jpg")
              }
              style={styles.avatar}
            />
          </TouchableOpacity>

          {/* Tiêu đề */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              DU LỊCH <Text style={styles.highlight}>HÀ TĨNH</Text>
            </Text>
            <Text style={styles.subTitle}>Hãy có chuyến du lịch vui vẻ</Text>
          </View>

          {/* Nút thông báo bên phải */}
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color="gray" />
          <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
        </View>

        {/* Nội dung chính */}
        <GestureScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        >
          <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {locations.map((location) => (
              <TouchableOpacity
                key={location}
                onPress={() => setSelectedLocation(location)}
                style={{
                  backgroundColor: selectedLocation === location ? "#007bff" : "#f0f0f0",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: selectedLocation === location ? "white" : "#333" }}>
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={featuredPlaces}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />

          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Di tích phổ biến khác</Text>
            <FlatList
              data={popularPlaces}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </View>

          <Text style={styles.sectionTitle}>Xem nhiều</Text>
          <FlatList
            data={mostViewed}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </GestureScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default TrangDiTich;
