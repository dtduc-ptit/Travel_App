import React, { useEffect, useState } from "react";
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
import styles from "../style/ditich.style";
import { API_BASE_URL } from "../../constants/config";

// Kiểu dữ liệu
interface Media {
  url: string;
}
interface DiTich {
  _id: string;
  ten: string;
  media?: Media[];
  imageUrl: string;
}

const TrangDiTich = () => {
  const navigation: any = useNavigation();
  const route = useRoute();

  const [featuredPlaces, setFeaturedPlaces] = useState<DiTich[]>([]);
  const [popularPlaces, setPopularPlaces] = useState<DiTich[]>([]);
  const [mostViewed, setMostViewed] = useState<DiTich[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");

  const locations = ["Tất cả", "Hương Sơn", "Hương Khê"];

  // Xử lý ảnh fallback
  const getImageUrl = (media?: Media[]) =>
    media?.[0]?.url || "https://via.placeholder.com/150";

  // Fetch API
  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<DiTich[]>>,
    withLocation: boolean = false
  ) => {
    try {
      const params = withLocation && selectedLocation !== "Tất cả"
        ? { diaDiem: selectedLocation }
        : {};
      const response = await axios.get(`${API_BASE_URL}/api/ditich/${endpoint}`, { params });
      const data = response.data.map((item: DiTich) => ({
        ...item,
        imageUrl: getImageUrl(item.media),
      }));
      setter(data);
    } catch (error) {
      console.error(`Lỗi khi fetch di tích ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchData("noibat", setFeaturedPlaces, true);
    fetchData("phobien", setPopularPlaces);
    fetchData("xemnhieu", setMostViewed);
  }, [selectedLocation]);

  const renderPlaceItem = ({ item }: { item: DiTich }) => (
    <TouchableOpacity style={styles.placeContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.placeText}>{item.ten}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          DU LỊCH <Text style={styles.highlight}>HÀ TĨNH</Text>
        </Text>
        <Image source={require("../../assets/images/logo.jpg")} style={styles.logo} />
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={16} color="gray" />
        <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
      </View>

      {/* Bộ lọc */}
      <Text style={styles.sectionTitle}>Di tích nổi bật</Text>
      <View style={styles.filterContainer}>
        {locations.map((location) => {
          const isActive = selectedLocation === location;
          return (
            <TouchableOpacity
              key={location}
              onPress={() => setSelectedLocation(location)}
              style={[
                styles.filterButton,
                isActive && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive && styles.filterTextActive,
                ]}
              >
                {location}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Danh sách nổi bật */}
      <FlatList
        data={featuredPlaces}
        renderItem={renderPlaceItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Di tích phổ biến */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Di tích phổ biến</Text>
        <FlatList
          data={popularPlaces}
          renderItem={renderPlaceItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Xem nhiều */}
      <Text style={styles.sectionTitle}>Xem nhiều</Text>
      <FlatList
        data={mostViewed}
        renderItem={renderPlaceItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default TrangDiTich;
