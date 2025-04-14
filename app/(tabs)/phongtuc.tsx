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
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";

const TrangPhongTuc = () => {
  const navigation: any = useNavigation();
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

  const renderFeaturedItem = ({ item }: { item: { _id: string; ten: string; imageUrl: string } }) => (
    <TouchableOpacity style={styles.featuredItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.placeText}>{item.ten}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderPopularItem = ({ item }: { item: { _id: string; ten: string; imageUrl: string } }) => (
    <TouchableOpacity style={styles.placeContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.placeText}>{item.ten}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderMostViewedItem = ({ item }: { item: { _id: string; ten: string; imageUrl: string } }) => (
    <TouchableOpacity style={styles.placeContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.placeText}>{item.ten}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          DU LỊCH <Text style={styles.highlight}>HÀ TĨNH</Text>
        </Text>
        <Image source={require("../../assets/images/logo.jpg")} style={styles.logo} />
      </View>

      <View style={styles.searchBar}>
        <FontAwesome name="search" size={16} color="gray" />
        <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
      </View>

      <Text style={styles.sectionTitle}>Phong tục nổi bật</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
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
          <Text style={{ color: selectedLocation === location ? "white" : "#333" }}>{location}</Text>
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
      
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Phong tục phổ biến khác</Text>
        <FlatList
          data={popularPlaces}
          renderItem={renderPopularItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Text style={styles.sectionTitle}>Xem nhiều</Text>
        <View>
          <FlatList
            data={mostViewed}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          />
        </View>

    </SafeAreaView>
  );
};

export default TrangPhongTuc;