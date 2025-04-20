import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import styles from "../style/lichtrinh.style";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { API_BASE_URL } from "../../constants/config";
import moment from "moment";
import { useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";

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
  const router = useRouter();
  const { diTichId, suKienId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [info, setInfo] = useState<any>(null);
  const [lichTrinhs, setLichTrinhs] = useState<any[]>([]);
  const [selectedLichTrinh, setSelectedLichTrinh] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    return <Ionicons name="checkmark-circle-outline" size={20} color="#6c757d" />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (diTichId) {
          const [diTichRes, lichRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/ditich/${diTichId}`),
            axios.get(`${API_BASE_URL}/api/lichtrinh/ditich/${diTichId}`),
          ]);
          setInfo(diTichRes.data);
          setLichTrinhs(lichRes.data || []);
        } else if (suKienId) {
          const [suKienRes, lichRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/sukien/${suKienId}`),
            axios.get(`${API_BASE_URL}/api/lichtrinh/sukien/${suKienId}`),
          ]);
          setInfo(suKienRes.data);
          setLichTrinhs(lichRes.data || []);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    if (diTichId || suKienId) fetchData();
  }, [diTichId, suKienId]);

  useEffect(() => {
    const now = moment();
    const marked: any = {};
    lichTrinhs.forEach((lich) => {
      const date = moment(lich.ngay).format("YYYY-MM-DD");
      const isFuture = moment(lich.ngay).isAfter(now, "day");
      marked[date] = {
        marked: true,
        dotColor: isFuture ? "#007bff" : "#999", 
        customStyles: {
          container: {
            backgroundColor: isFuture ? "rgba(0, 123, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
            borderRadius: 8,
          },
          text: {
            color: isFuture ? "#007bff" : "#999",
            fontWeight: isFuture ? "bold" : "normal",
          },
        },
      };
    });

    // Đánh dấu ngày hiện tại
    const today = moment().format("YYYY-MM-DD");
    marked[today] = {
      ...marked[today],
      customStyles: {
        container: {
          backgroundColor: "rgba(255, 99, 71, 0.1)",
          borderRadius: 8,
        },
        text: {
          color: "#ff6347",
          fontWeight: "bold",
        },
      },
    };

    setMarkedDates(marked);

    // Chọn lịch trình gần nhất với ngày hiện tại
    if (lichTrinhs.length > 0) {
      const nearestLichTrinh = lichTrinhs.reduce((nearest: any, lich: any) => {
        const lichDate = moment(lich.ngay);
        const diff = Math.abs(lichDate.diff(now, "days"));
        if (!nearest) return lich;
        const nearestDiff = Math.abs(moment(nearest.ngay).diff(now, "days"));
        return diff < nearestDiff ? lich : nearest;
      }, null);

      if (nearestLichTrinh) {
        setSelectedLichTrinh(nearestLichTrinh);
        const selectedDate = moment(nearestLichTrinh.ngay).format("YYYY-MM-DD");
        setMarkedDates((prev: any) => ({
          ...prev,
          [selectedDate]: {
            ...prev[selectedDate],
            selected: true,
            selectedColor: "#007bff",
          },
        }));
      }
    }
  }, [lichTrinhs]);

  useEffect(() => {
    if (showCalendar) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showCalendar]);

  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;
    const selected = lichTrinhs.find((lich) =>
      moment(lich.ngay).isSame(moment(selectedDate), "day")
    );

    setSelectedLichTrinh(selected || null);
    const newMarkedDates: any = {};
    Object.keys(markedDates).forEach((date) => {
      newMarkedDates[date] = {
        ...markedDates[date],
        selected: date === selectedDate,
        selectedColor: "#007bff",
      };
    });
    setMarkedDates(newMarkedDates);
    setShowCalendar(false);
  };

  const handleSelectNearestDay = () => {
    const now = moment();
    const nearestLichTrinh = lichTrinhs.reduce((nearest: any, lich: any) => {
      const lichDate = moment(lich.ngay);
      const diff = Math.abs(lichDate.diff(now, "days"));
      if (!nearest) return lich;
      const nearestDiff = Math.abs(moment(nearest.ngay).diff(now, "days"));
      return diff < nearestDiff ? lich : nearest;
    }, null);

    if (nearestLichTrinh) {
      const selectedDate = moment(nearestLichTrinh.ngay).format("YYYY-MM-DD");
      handleDayPress({ dateString: selectedDate });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.mainHeading}>{info?.ten}</Text>
      </View>

      <Text style={styles.subHeading}>Hành trình tham quan</Text>

      <View style={styles.imageContainer}>
        <Image source={{ uri: info?.imageUrl }} style={styles.mainImage} />
        {diTichId && (
          <TouchableOpacity
            style={styles.routeButton}
            onPress={() =>
              router.push({
                pathname: "/screen/bandovanhoa",
                params: { id: diTichId },
              })
            }
          >
            <Text style={styles.routeText}>Xem bản đồ</Text>
          </TouchableOpacity>
        )}
        {suKienId && (
          <TouchableOpacity
            style={styles.routeButton}
            onPress={() =>
              router.push({
                pathname: "/screen/bandovanhoa",
                params: { id: suKienId },
              })
            }
          >
            <Text style={styles.routeText}>Xem bản đồ</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedLichTrinh?.ngay && (() => {
        const now = moment();
        const lichTrinhDate = moment(selectedLichTrinh.ngay);
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

      <View style={styles.timelineHeader}>
        <Text style={styles.timelineTitle}>Lịch trình</Text>
        <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.calendarButton}>
          <Ionicons name="calendar-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <View style={styles.calendarContainer}>
            <Calendar
              initialDate={moment().format("YYYY-MM-DD")} // Dừng ở ngày hiện tại
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                selectedDayBackgroundColor: "#007bff",
                todayTextColor: "#ff6347",
                arrowColor: "#007bff",
                monthTextColor: "#333",
                textDayFontWeight: "400",
                textMonthFontWeight: "600",
              }}
            />
            <View style={styles.calendarButtonGroup}>
              <TouchableOpacity
                style={[styles.calendarActionButton, { backgroundColor: "#28a745" }]}
                onPress={handleSelectNearestDay}
              >
                <Text style={styles.calendarActionText}>Chọn ngày gần nhất</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.calendarActionButton, { backgroundColor: "#ff6347" }]}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.calendarActionText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>

      {selectedLichTrinh?.ngay && (
        <Text style={[styles.subHeading, { marginBottom: 12, color: "#007bff" }]}>
          Ngày: {moment(selectedLichTrinh.ngay).format("DD/MM/YYYY")}
        </Text>
      )}

      {selectedLichTrinh ? (
        selectedLichTrinh.hoatDongs?.length > 0 ? (
          <FlatList
            data={Object.entries(groupByTimeOfDay(selectedLichTrinh.hoatDongs))}
            keyExtractor={(item) => item[0]}
            renderItem={({ item: [buoi, danhSach] }) =>
              danhSach.length === 0 ? null : (
                <View>
                  <Text style={styles.timePeriodTitle}>
                    {buoi === "morning" && "🌅 Buổi sáng"}
                    {buoi === "afternoon" && "🌤️ Buổi chiều"}
                    {buoi === "evening" && "🌙 Buổi tối"}
                  </Text>
                  {danhSach.map((hoatDong: any, index: number) => (
                    <View key={hoatDong._id} style={styles.timelineItem}>
                      <View style={styles.leftColumn}>
                        <View style={styles.timeWrapper}>
                          <Text style={styles.timeText}>{hoatDong.thoiGian}</Text>
                        </View>
                        <View style={styles.dot} />
                        {index !== danhSach.length - 1 && <View style={styles.verticalLine} />}
                      </View>
                      <View style={styles.cardItem}>
                        <View style={styles.timeRow}>
                          {/* <Text style={styles.timeText}>{hoatDong.thoiGian}</Text> */}
                          {getIconForActivity(hoatDong.noiDung)}
                        </View>
                        <Text style={styles.actionTitle}>
                          {hoatDong.noiDung}{" "}
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
              )
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyNoticeContainer}>
            <Ionicons name="information-circle-outline" size={24} color="#999" />
            <Text style={styles.emptyNoticeText}>
              Không có hoạt động nào cho ngày {moment(selectedLichTrinh.ngay).format("DD/MM/YYYY")}. Vui lòng chọn ngày khác.
            </Text>
          </View>
        )
      ) : (
        <View style={styles.emptyNoticeContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#999" />
          <Text style={styles.emptyNoticeText}>
            Không có lịch trình cho ngày này. Vui lòng chọn một ngày khác từ lịch.
          </Text>
        </View>
      )}
    </View>
  );
};

export default LichTrinh;