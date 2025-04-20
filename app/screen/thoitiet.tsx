import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { API_BASE_URL, WEATHER_API_KEY } from "../../constants/config";
import { useNavigation } from "@react-navigation/native";
import styles from "../style/thoitiet.style";
interface WeatherData {
  temp: number; // Nhiệt độ hiện tại (°C)
  description: string; // Mô tả
  icon: string; // Mã biểu tượng
  humidity: number; // Độ ẩm (%)
  windSpeed: number; // Tốc độ gió (m/s)
}

interface ForecastData {
  date: string; // Ngày (DD/MM/YYYY)
  tempMax: number; // Nhiệt độ cao nhất (°C)
  tempMin: number; // Nhiệt độ thấp nhất (°C)
  description: string;
  icon: string;
}

const WeatherDetailScreen = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const navigation = useNavigation();

  // Hiệu ứng chuyển động cho biểu tượng thời tiết
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  useEffect(() => {
    // Tạo hiệu ứng phóng to/thu nhỏ lặp lại
    const interval = setInterval(() => {
      scale.value = scale.value === 1 ? 1.1 : 1;
    }, 1000);
    return () => clearInterval(interval);
  }, [scale]);

  // Lấy dữ liệu thời tiết hiện tại và dự báo
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Thời tiết hiện tại
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Ha%20Tinh,VN&units=metric&appid=${WEATHER_API_KEY}&lang=vi`
        );
        const weatherData = weatherRes.data;
        setWeather({
          temp: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          humidity: weatherData.main.humidity,
          windSpeed: weatherData.wind.speed,
        });

        // Dự báo 5 ngày
        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=Ha%20Tinh,VN&units=metric&appid=${WEATHER_API_KEY}&lang=vi`
        );
        const forecastData = processForecastData(forecastRes.data.list);
        setForecast(forecastData);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thời tiết:", err);
      }
    };

    fetchWeather();
    const intervalId = setInterval(fetchWeather, 300000); 
    return () => clearInterval(intervalId); 
  }, []);

  // Xử lý dữ liệu dự báo để lấy temp_max và temp_min mỗi ngày
  const processForecastData = (list: any[]) => {
    const dailyData: { [key: string]: { tempMax: number; tempMin: number; description: string; icon: string } } = {};

    list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("vi-VN");
      if (!dailyData[date]) {
        dailyData[date] = {
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      } else {
        dailyData[date].tempMax = Math.max(dailyData[date].tempMax, item.main.temp_max);
        dailyData[date].tempMin = Math.min(dailyData[date].tempMin, item.main.temp_min);
        // Cập nhật mô tả và biểu tượng nếu là 12:00 để đại diện cho ngày
        if (item.dt_txt.includes("12:00:00")) {
          dailyData[date].description = item.weather[0].description;
          dailyData[date].icon = item.weather[0].icon;
        }
      }
    });

    return Object.entries(dailyData)
      .slice(0, 5) // Lấy 5 ngày
      .map(([date, data]) => ({
        date,
        tempMax: Math.round(data.tempMax),
        tempMin: Math.round(data.tempMin),
        description: data.description,
        icon: data.icon,
      }));
  };

  // Chọn màu gradient dựa trên thời tiết
  const getGradientColors = (description: string) => {
    if (description.includes("mưa")) return ["#4682B4", "#87CEEB"];
    if (description.includes("mây")) return ["#A9A9A9", "#D3D3D3"];
    if (description.includes("nắng") || description.includes("trời quang")) return ["#FFD700", "#FFA500"];
    return ["#87CEFA", "#B0E0E6"];
  };

  // Render mỗi mục dự báo
  const renderForecastItem = ({ item }: { item: ForecastData }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastText}>{item.date}</Text>
      <Image
        source={{ uri: `http://openweathermap.org/img/wn/${item.icon}.png` }}
        style={styles.weatherIcon}
      />
      <Text style={styles.forecastText}>
        Cao: {item.tempMax}°C | Thấp: {item.tempMin}°C
      </Text>
      <Text style={styles.forecastDescription}>{item.description}</Text>
    </View>
  );

  return (
    <LinearGradient
    colors={(weather ? getGradientColors(weather.description) : ["#87CEFA", "#B0E0E6"]) as [string, string, ...string[]]}
    style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          THỜI TIẾT <Text style={styles.highlight}>HÀ TĨNH</Text>
        </Text>
      </View>

      {/* Current Weather */}
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherTitle}>Thời tiết hiện tại</Text>
          <View style={styles.currentWeather}>
            <Animated.View style={animatedStyle}>
              <Image
                source={{ uri: `http://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
                style={styles.largeWeatherIcon}
              />
            </Animated.View>
            <View>
              <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
              <Text style={styles.weatherDescription}>{weather.description}</Text>
              <Text style={styles.weatherDetail}>Độ ẩm: {weather.humidity}%</Text>
              <Text style={styles.weatherDetail}>Gió: {weather.windSpeed} m/s</Text>
            </View>
          </View>
        </View>
      )}

      {/* Forecast */}
      {forecast.length > 0 && (
        <View style={styles.forecastContainer}>
          <Text style={styles.weatherTitle}>Dự báo 5 ngày</Text>
          <FlatList
            data={forecast}
            renderItem={renderForecastItem}
            keyExtractor={(item) => item.date}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.forecastList}
          />
        </View>
      )}

      {/* Loading or Error */}
      {!weather && !forecast.length && (
        <Text style={styles.errorText}>Đang tải dữ liệu thời tiết...</Text>
      )}
    </LinearGradient>
  );
};



export default WeatherDetailScreen;