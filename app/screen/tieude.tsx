import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_BASE_URL, WEATHER_API_KEY } from "../../constants/config";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../style/tieude.style";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

const UserHeader = () => {
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [soThongBaoChuaDoc, setSoThongBaoChuaDoc] = useState<number>(0);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push({
      pathname: "/screen/ketquatimkiem",
      params: { q: searchQuery },
    });
    setSearchQuery(""); // Xóa searchQuery sau khi tìm kiếm
  };

  // Xóa searchQuery khi màn hình focus lại
  useFocusEffect(
    useCallback(() => {
      setSearchQuery(""); // Đặt lại searchQuery khi quay lại
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchNguoiDung = async () => {
        try {
          const idNguoiDung = await AsyncStorage.getItem("idNguoiDung");
          if (idNguoiDung) {
            const res = await axios.get(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`);
            setNguoiDung({ ...res.data, _id: idNguoiDung });
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      };

      fetchNguoiDung();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchSoThongBaoChuaDoc = async () => {
        if (!nguoiDung?._id) return;

        try {
          const res = await axios.get(`${API_BASE_URL}/api/thongbao/chuadoc/${nguoiDung._id}`);
          setSoThongBaoChuaDoc(res.data.soLuongChuaDoc || 0);
        } catch (error) {
          console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
        }
      };

      fetchSoThongBaoChuaDoc();
    }, [nguoiDung])
  );

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Ha%20Tinh,VN&units=metric&appid=${WEATHER_API_KEY}&lang=vi`
        );
        const data = res.data;
        setWeather({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      } catch (err) {
        console.error("Lỗi khi fetch thời tiết:", err);
      }
    };

    fetchWeather();
  }, []);

  const getGradientColors = (description: string): [string, string] => {
    if (description.includes("mưa")) return ["#4682B4", "#87CEEB"];
    if (description.includes("mây")) return ["#A9A9A9", "#D3D3D3"];
    if (description.includes("nắng") || description.includes("trời quang")) return ["#FFD700", "#FFA500"];
    return ["#87CEFA", "#B0E0E6"];
  };

  return (
    <LinearGradient
      colors={weather ? getGradientColors(weather.description) : ["#87CEFA", "#B0E0E6"]}
      style={styles.headerWrapper}
    >
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "../auth/trangcanhan",
              params: { id: nguoiDung?._id },
            })
          }
        >
          <Image
            source={
              nguoiDung?.anhDaiDien
                ? { uri: nguoiDung.anhDaiDien }
                : require("../../assets/images/logo.jpg")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            DU LỊCH <Text style={styles.highlight}>HÀ TĨNH</Text>
          </Text>
          <Text style={styles.subTitle}>Hãy có chuyến du lịch vui vẻ</Text>
        </View>

        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => router.push("../screen/thongbao")}
        >
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          {soThongBaoChuaDoc > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {soThongBaoChuaDoc > 99 ? "99+" : soThongBaoChuaDoc}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {weather && (
        <View style={styles.weatherContainer}>
          <TouchableOpacity
            style={styles.weatherInfo}
            onPress={() => router.push("/screen/thoitiet")}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: `http://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
              style={styles.weatherIcon}
            />
            <View>
              <Text style={styles.weatherText}>
                Hà Tĩnh: {weather.temp}°C
              </Text>
              <Text style={styles.weatherDescription}>
                {weather.description}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.weatherButton}
            onPress={() => router.push("/screen/thoitiet")}
          >
            <Text style={styles.weatherButtonText}>Xem 5 ngày</Text>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchBar}>
        <FontAwesome name="search" size={16} color="gray" onPress={handleSearch} />
        <TextInput
          placeholder="Tìm kiếm..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
    </LinearGradient>
  );
};

export default UserHeader;