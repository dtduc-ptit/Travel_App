import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import styles from "../style/lichtrinh.style";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { API_BASE_URL } from "../../constants/config";
import moment from "moment";

const LichTrinh = () => {
  const { diTichId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [diTich, setDiTich] = useState<any>(null);
  const [lichTrinh, setLichTrinh] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [diTichRes, lichRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/ditich/${diTichId}`),
          axios.get(`${API_BASE_URL}/api/lichtrinh/ditich/${diTichId}`),
        ]);

        setDiTich(diTichRes.data);
        if (lichRes.data && lichRes.data.length > 0) {
          setLichTrinh(lichRes.data[0]); // lấy lịch trình đầu tiên
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    if (diTichId) fetchData();
  }, [diTichId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.subHeading}>Hành trình tham quan</Text>
      <Text style={styles.mainHeading}>{diTich?.ten}</Text>

      <View style={styles.imageContainer}>
        <Image source={{ uri: diTich?.imageUrl }} style={styles.mainImage} />
        <TouchableOpacity style={styles.routeButton}>
          <Text style={styles.routeText}>Xem đường đi</Text>
        </TouchableOpacity>
      </View>

      {lichTrinh?.ngay && (() => {
        const now = moment();
        const lichTrinhDate = moment(lichTrinh.ngay);
        const diffMinutes = lichTrinhDate.diff(now, "minutes");
        const diffHours = lichTrinhDate.diff(now, "hours");
        const diffDays = lichTrinhDate.diff(now, "days");

        let statusText = "";

        if (lichTrinhDate.isSame(now, "day")) {
          statusText = "Sự kiện đang diễn ra";
        } else if (diffMinutes > 0) {
          if (diffDays >= 1) {
            const remainingHours = diffHours % 24;
            const remainingMinutes = diffMinutes % 60;
            statusText = `Còn ${diffDays} ngày ${remainingHours} giờ ${remainingMinutes} phút sẽ bắt đầu`;
          } else {
            const remainingHours = Math.floor(diffMinutes / 60);
            const remainingMinutes = diffMinutes % 60;
            statusText = `Còn ${remainingHours} giờ ${remainingMinutes} phút sẽ bắt đầu`;
          }
        } else {
          statusText = "Sự kiện đã diễn ra";
        }

        return (
          <Text style={[styles.subHeading, { marginBottom: 12, color: "#007bff" }]}>
            {statusText}
          </Text>
        );
      })()}

      {/* Timeline */}
      <Text style={styles.timelineTitle}>Lịch trình</Text>
      <View style={styles.timelineContainer}>
        {lichTrinh?.hoatDongs?.map((hoatDong: any, index: number) => (
          <View key={hoatDong._id} style={styles.timelineItem}>
            <View style={styles.leftColumn}>
              <Text style={styles.timeText}>{hoatDong.thoiGian}</Text>
              <View style={styles.dot} />
              {index !== lichTrinh.hoatDongs.length - 1 && <View style={styles.verticalLine} />}
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.actionTitle}>{hoatDong.noiDung}</Text>
              <Text style={styles.desc}>📍 {hoatDong.diaDiem}</Text>
              {hoatDong.ghiChu ? (
                <Text style={styles.desc}>📝 {hoatDong.ghiChu}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default LichTrinh;
