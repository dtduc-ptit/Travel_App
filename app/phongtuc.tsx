import React from "react";
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

const featuredPlaces = [
  { id: "1", name: "Khu di tích Hải Thượng Lãn Ông", image: require("../assets/images/splash-image.png") },
  { id: "2", name: "Ngã 3 Đồng Lộc", image: require("../assets/images/splash-image.png") },
];

const popularPlaces = [
  { id: "3", name: "Chùa Hương Tích", image: require("../assets/images/splash-image.png") },
  { id: "4", name: "Chùa Chân Tiên", image: require("../assets/images/splash-image.png") },
];

const TrangPhongTuc = () => {
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
        <Image source={require("../assets/images/logo.jpg")} style={styles.logo} />
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
        keyExtractor={(item) => item.id} 
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Phong tục phổ biến khác</Text>
      <FlatList 
        data={popularPlaces} 
        horizontal 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id} 
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("historical_site")}>
          <FontAwesome
            name="map-marker"
            size={24}
            color={isActive("historical_site") ? "#007bff" : "gray"}
          />
          <Text style={isActive("historical_site") ? styles.activeTab : styles.inactiveTab}>
            Di tích
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <FontAwesome name="calendar" size={24} color="gray" />
          <Text style={styles.inactiveTab}>Sự kiện</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("phongtuc")}>
          <FontAwesome
            name="book"
            size={24}
            color={isActive("phongtuc") ? "#007bff" : "gray"}
          />
          <Text style={isActive("phongtuc") ? styles.activeTab : styles.inactiveTab}>
            Phong tục
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <FontAwesome name="users" size={24} color="gray" />
          <Text style={styles.inactiveTab}>Cộng đồng</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <FontAwesome name="lightbulb-o" size={24} color="gray" />
          <Text style={styles.inactiveTab}>Kiến thức</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#333" },
  highlight: { color: "#007bff" },
  logo: { width: 32, height: 32 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#333" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  placeContainer: {
    width: 160,
    height: 112,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    padding: 4,
  },
  placeText: { color: "white", fontSize: 12, fontWeight: "bold" },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  activeTab: { fontSize: 12, color: "#007bff" },
  inactiveTab: { fontSize: 12, color: "gray" },
});

export default TrangPhongTuc;
