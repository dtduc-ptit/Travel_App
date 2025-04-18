import React, { useEffect, useState } from "react";
import styles from '../style/phongtuc.style'; 
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import { GestureHandlerRootView, ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import UserHeader from "../screen/tieude";


const TrangPhongTuc = () => {
  const router = useRouter();
  const route = useRoute();
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");
  const [mostViewed, setMostViewed] = useState([]);

  const locations = ["Tất cả", "Hương Sơn", "Hương Khê"];
  const isActive = (routeName: string) => route.name === routeName;

  useEffect(() => {
    const fetchFeaturedPlaces = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/phongtucs/noibat`, {
          params: selectedLocation !== "Tất cả" ? { diaDiem: selectedLocation } : {},
        });
        setFeaturedPlaces(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch phong tục nổi bật:", error);
      }
    };

    const fetchPopulerdPlaces = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/phongtucs/phobien`);
        setPopularPlaces(response.data); 
      } catch (error) {
        console.error("Lỗi khi fetch phong tục phổ biến:", error);
      }
    };

    const fetchMostViewed = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/phongtucs/xemnhieu`);
        setMostViewed(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch phong tục xem nhiều:", error);
      }
    };
  
    fetchMostViewed();
    fetchPopulerdPlaces();
    fetchFeaturedPlaces();
  }, [selectedLocation]);

  const renderFeaturedItem = ({ item }: { item: { _id: string; ten: string; imageUrl: string ; danhGia: Number} }) => (
    <TouchableOpacity 
        style={styles.featuredItem}  
        onPress={() => router.push({ pathname: "/screen/phongtucchitiet", params: { id: item._id } })}  
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
  
  const renderPopularItem = ({ item }: { item: { _id: string; ten: string; imageUrl: string; danhGia: Number } }) => (
    <TouchableOpacity 
      style={styles.placeContainer}
      onPress={() => router.push({ pathname: "/screen/phongtucchitiet", params: { id: item._id } })} 
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
        {/* Nội dung cuộn */}
        <GestureScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        >
          <Text style={styles.sectionTitle}>Phong tục nổi bật</Text>
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
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
  
            <Text style={styles.sectionTitle}>Phong tục phổ biến khác</Text>
            <FlatList
              data={popularPlaces}
              renderItem={renderPopularItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
  
          <Text style={styles.sectionTitle}>Xem nhiều</Text>
          <FlatList
            data={mostViewed}
            renderItem={renderFeaturedItem}
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

export default TrangPhongTuc;