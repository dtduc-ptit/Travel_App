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
import styles from "../style/danhsachanh.style";
import { API_BASE_URL } from "../../constants/config";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import moment from "moment";

const DanhSachAnh = () => {
  const { ten, doiTuong, doiTuongId, type } = useLocalSearchParams();
  const navigation = useNavigation();

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/media`, {
          params: { doiTuong, doiTuongId, type },
        });
        setImages(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy media:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doiTuongId) fetchMedia();
  }, [doiTuongId]);

  const toggleDesc = (id: string) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }} // đảm bảo đủ lớn
      showsVerticalScrollIndicator={false}
    >
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={26} color="black" />
    </TouchableOpacity>

      <Text style={styles.heading}>Danh sách ảnh của {ten}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        images.map((img, index) => {
          const isLongDesc = img.moTa?.length > 120;
          const isExpanded = expandedDesc[img._id];

          return (
            <View key={img._id || index} style={styles.imageCard}>
              <Image source={{ uri: img.url }} style={styles.image} resizeMode="cover" />
              {img.moTa && (
                <>
                  <Text style={styles.moTa} numberOfLines={isExpanded ? undefined : 3}>
                    {img.moTa}
                  </Text>
                  {isLongDesc && (
                    <TouchableOpacity onPress={() => toggleDesc(img._id)}>
                      <Text style={styles.xemThem}>
                        {isExpanded ? "Ẩn bớt" : "Xem thêm"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              <Text style={styles.dateText}>
                📅 Chụp từ: {moment(img.createdAt).format("DD/MM/YYYY")}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default DanhSachAnh;
