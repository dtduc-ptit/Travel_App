import React, { useEffect, useState } from "react";
import styles from '../style/phongtuc.style'; 

import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

const TrangPhongTuc = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);

  const isActive = (routeName: string) => route.name === routeName;

  useEffect(() => {
    const fetchFeaturedPlaces = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/phongtucs/noibat");
        setFeaturedPlaces(response.data); 
        console.log("Phong tuc noi bat:", response.data); // Log the fetched data
      } catch (error) {
        console.error("Lỗi khi fetch phong tục nổi bật:", error);
      }
    };

    const fetchPopulerdPlaces = async () => {
      try {
        const response = await axios.get("http://192.168.0.102:3000/api/phongtucs/phobienphobien");
        setPopularPlaces(response.data); 
        console.log("Phong tuc pho bienbien:", response.data); // Log the fetched data
      } catch (error) {
        console.error("Lỗi khi fetch phong tục phổ biến:", error);
      }
    };
    fetchPopulerdPlaces();
    fetchFeaturedPlaces();
  }, []);

  const renderItem = ({ item }: { item: { _id: string; name: string; imageUrl: string } }) => (
    <TouchableOpacity style={styles.placeContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.placeImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.placeText}>{item.name}</Text>
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
      <FlatList 
      data={featuredPlaces} 
      horizontal 
      renderItem={renderItem} 
      keyExtractor={(item) => item._id}
      showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Phong tục phổ biến khác</Text>
      <FlatList 
        data={popularPlaces} 
        horizontal 
        renderItem={renderItem} 
        keyExtractor={(item) => item._id} 
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};


export default TrangPhongTuc;
