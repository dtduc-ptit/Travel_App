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
// Đặt phía trên component LichTrinh
const getTimeStatus = (hoatDongTime: string) => {
  const now = moment();
  const hdTime = moment(hoatDongTime, "HH:mm");

  if (now.isSame(hdTime, "hour")) return "⏳ Đang diễn ra";
  if (hdTime.isAfter(now)) return "🕒 Sắp tới";
  return "✅ Đã xong";
};

const groupByTimeOfDay = (hoatDongs: any[]) => {
  const morning = hoatDongs.filter((h) => h.thoiGian < "12:00");
  const afternoon = hoatDongs.filter((h) => h.thoiGian >= "12:00" && h.thoiGian < "18:00");
  const evening = hoatDongs.filter((h) => h.thoiGian >= "18:00");
  return { morning, afternoon, evening };
};


const LichTrinh = () => {
  const { diTichId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [diTich, setDiTich] = useState<any>(null);
  const [lichTrinh, setLichTrinh] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const getIconForActivity = (title: string) => {
    if (title.toLowerCase().includes("tập trung")) {
      return <Ionicons name="people-outline" size={20} color="#007bff" />;
    }
    if (title.toLowerCase().includes("tham quan")) {
      return <Ionicons name="map-outline" size={20} color="#28a745" />;
    }
    if (title.toLowerCase().includes("ăn trưa")) {
      return <Ionicons name="restaurant-outline" size={20} color="#ff6347" />;
    }
    if (title.toLowerCase().includes("nghỉ ngơi")) {
      return <Ionicons name="bed-outline" size={20} color="#6c757d" />;
    }
    // Default icon
    return <Ionicons name="checkmark-circle-outline" size={20} color="#6c757d" />;
  };
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
    <View style={styles.container}>
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
      <Text style={styles.timelineTitle}>Lịch trình</Text>
      <ScrollView style={styles.scrollSection} showsVerticalScrollIndicator={false}>
        {lichTrinh?.hoatDongs?.length > 0 ? (
          <View style={styles.timelineContainer}>
            {Object.entries(groupByTimeOfDay(lichTrinh.hoatDongs)).map(([buoi, danhSach]) =>
              danhSach.length === 0 ? null : (
              <View key={buoi}>
                <Text style={styles.timePeriodTitle}>
                  {buoi === "morning" && "🌅 Buổi sáng"}
                  {buoi === "afternoon" && "🌤️ Buổi chiều"}
                  {buoi === "evening" && "🌙 Buổi tối"}
                </Text>

                {danhSach.map((hoatDong: any, index: number) => (
                <View key={hoatDong._id} style={styles.timelineItem}>
                  {/* Left: Hiển thị thời gian duy nhất 1 lần */}
                  <View style={styles.leftColumn}>
                    <View style={styles.timeWrapper}>
                      <Text style={styles.timeText}>{hoatDong.thoiGian}</Text>
                    </View>
                    <View style={styles.dot} />
                    {index !== danhSach.length - 1 && <View style={styles.verticalLine} />}
                  </View>

                  {/* Right: Nội dung hoạt động */}
                  <View style={styles.cardItem}>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeText}>{hoatDong.thoiGian}</Text>
                      {getIconForActivity(hoatDong.noiDung)}
                    </View>
                    <Text style={styles.actionTitle}>
                      {hoatDong.noiDung}
                      {"  "}
                      <Text style={{ fontSize: 12, color: "#999" }}>
                        ({getTimeStatus(hoatDong.thoiGian)})
                      </Text>
                    </Text>
                    <Text style={styles.desc}>📍 {hoatDong.diaDiem}</Text>
                    {hoatDong.ghiChu ? (
                      <Text style={styles.desc}>📝 {hoatDong.ghiChu}</Text>
                    ) : null}
                  </View>
                </View>
              ))}

              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyNoticeContainer}>
            <Ionicons name="information-circle-outline" size={24} color="#999" />
            <Text style={styles.emptyNoticeText}>
              Lịch trình hiện chưa có hoạt động nào. Vui lòng kiểm tra lại sau hoặc liên hệ người tổ chức để cập nhật.
            </Text>
          </View>
        )}
      </ScrollView>

      </View>
  );
};

export default LichTrinh;
