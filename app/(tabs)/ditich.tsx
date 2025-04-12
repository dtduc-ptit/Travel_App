import React from "react";
import styles from '../style/ditich.style';

import { View, Text, TextInput, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";


const featuredPlaces = [
  { id: "1", name: "Khu di tích Hải Thượng Lãn Ông", image: require("../../assets/images/splash-image.png") },
  { id: "2", name: "Ngã 3 Đồng Lộc", image: require("../../assets/images/splash-image.png") },
];

const popularPlaces = [
  { id: "3", name: "Chùa Hương Tích", image: require("../../assets/images/splash-image.png") },
  { id: "4", name: "Chùa Chân Tiên", image: require("../../assets/images/splash-image.png") },
];

const TrangDiTich = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const isActive = (routeName: string) => route.name === routeName;

  const renderItem = ({ item }: { item: { id: string; name: string; image: any } }) => (
    <TouchableOpacity style={styles.placeContainer}>
      <Image source={item.image} style={styles.placeImage} resizeMode="cover" />
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

      <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
      <FlatList 
        data={featuredPlaces} 
        horizontal 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id} 
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Địa điểm phổ biến khác</Text>
      <FlatList 
        data={popularPlaces} 
        horizontal 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id} 
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};


export default TrangDiTich;
