import React, { useEffect, useState } from "react";
import styles from '../style/sukien.style'; 
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserHeader from '../screen/tieude';

const TrangSuKien = () => {
  const router = useRouter();
  const route = useRoute();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");
  const [upcomingEvents, setUpcomingEvents] = useState([]);


  const locations = ["Tất cả", "Hà Tĩnh", "Hương Sơn", "Hương Khê"];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/sukien/noibat`, {
          params: selectedLocation !== "Tất cả" ? { diaDiem: selectedLocation } : {},
        });
        setFeaturedEvents(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch sự kiện nổi bật:", error);
      }
    };

    const fetchPopular = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/sukien/phobien`);
        setPopularEvents(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch sự kiện phổ biến:", error);
      }
    };

    const fetchViewed = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/sukien/xemnhieu`);
        setMostViewed(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch sự kiện xem nhiều:", error);
      }
    };

    const fetchUpcoming = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/sukien/sapdienra`);
        setUpcomingEvents(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch sự kiện sắp diễn ra:", error);
      }
    };
    
    fetchUpcoming();
    fetchFeatured();
    fetchPopular();
    fetchViewed();
  }, [selectedLocation]);

  const renderItem = ({ item }: { item: { _id: string; ten: string; imageUrl: string;  danhGia: number } }) => (
    <TouchableOpacity
      style={styles.featuredItem}
      onPress={() => router.push({ pathname: "/screen/sukienchitiet", params: { id: item._id } })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage} resizeMode="cover" />

      {item.danhGia ? (
        <View style={styles.ratingBadge}>
          <FontAwesome name="star" size={14} color="#f1c40f" />
          <Text style={styles.ratingText}>{item.danhGia.toFixed(1)}</Text>
        </View>
      ) : (
        <View style={styles.ratingBadge}>
          <FontAwesome name="star-o" size={14} color="#fff" />
          <Text style={styles.ratingText}>Mới cập nhật ✨</Text>
        </View>
      )}

      <View style={styles.overlay}>
        <Text style={styles.placeText}>{item.ten}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPopularItem = ({ item }: { item: { _id: string; ten: string; imageUrl: string; danhGia: number } }) => (
    <TouchableOpacity 
      style={styles.placeContainer}
      onPress={() => router.push({ pathname: "/screen/sukienchitiet", params: { id: item._id } })} 
      >
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage} resizeMode="cover" />

      {item.danhGia ? (
        <View style={styles.ratingBadge}>
          <FontAwesome name="star" size={14} color="#f1c40f" />
          <Text style={styles.ratingText}>{item.danhGia.toFixed(1)}</Text>
        </View>
      ) : (
        <View style={styles.ratingBadge}>
          <FontAwesome name="star-o" size={14} color="#fff" />
          <Text style={styles.ratingText}>Mới cập nhật ✨</Text>
        </View>
      )}

      <View style={styles.overlay}>
        <Text style={styles.placeText}>{item.ten}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <UserHeader />

        <GestureScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        >
          <Text style={[styles.sectionTitle,styles.titleStyle]}>Sự kiện nổi bật</Text>
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
            data={featuredEvents}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
            <View style={styles.headerRow}>
              <Text style={[styles.sectionTitle, styles.titleStyle]}>
                Sự kiện sắp diễn ra
              </Text>

              <TouchableOpacity onPress={() => router.push("/screen/sukiensapxep")}>
                <Text style={styles.sortButton}>Sắp xếp</Text>
                {/* Hoặc dùng icon:
                <Ionicons name="filter" size={20} color="#007AFF" /> */}
              </TouchableOpacity>
            </View>

            <FlatList
              data={upcomingEvents}
              renderItem={renderPopularItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />


            <Text style={[styles.sectionTitle,styles.titleStyle]}>Sự kiện phổ biến khác</Text>
            <FlatList
              data={popularEvents}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />

          <Text style={[styles.sectionTitle,styles.titleStyle]}>Xem nhiều</Text>
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

export default TrangSuKien;
