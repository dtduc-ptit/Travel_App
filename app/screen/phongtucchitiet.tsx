import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/phongtucchitiet.style";

const PhongTucChiTiet = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Removed redundant router declaration

    const fetchData = async () => {
      try {
        // Lấy phong tục
        const res = await axios.get(`${API_BASE_URL}/api/phongtucs/${id}`);
        const phongTuc = res.data;
        setData(phongTuc);

        // Tăng lượt xem
        await axios.patch(`${API_BASE_URL}/api/phongtucs/${id}/luotxem`); // API cập nhật lượt xem

        // Lấy media nếu có
        if (phongTuc.media?.length > 0) {
          const images = await Promise.all(
            phongTuc.media.map(async (mediaId: string) => {
              const res = await axios.get(`${API_BASE_URL}/api/media/${mediaId}`);
              return res.data.url; // Giả định API trả về { url: "..." }
            })
          );
          setMediaUrls(images);
          setMainImage(images[0]);
        } else {
          setMainImage(phongTuc.imageUrl);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Không tìm thấy phong tục.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ position: "relative" }}>
        <Image
            source={{ uri: mainImage || data.imageUrl }}
            style={styles.mainImage}
            resizeMode="cover"
        />
        
        {mediaUrls.length > 1 && (
            <View style={styles.thumbnailOverlay}>
            {mediaUrls.slice(0, 4).map((item, index) => {
                if (index === 3 && mediaUrls.length > 4) {
                return (
                    <TouchableOpacity
                    key={index}
                    onPress={() =>
                        router.push({
                        pathname: "/screen/danhsachanh",
                        params: { id: data._id },
                        })
                    }
                    style={styles.thumbnailWrapper}
                    >
                    <View style={[styles.thumbnail, styles.moreOverlay]}>
                        <Text style={styles.moreText}>+{mediaUrls.length - 3}</Text>
                    </View>
                    </TouchableOpacity>
                );
                }

                return (
                <TouchableOpacity
                    key={index}
                    onPress={() => setMainImage(item)}
                    style={styles.thumbnailWrapper}
                >
                    <Image source={{ uri: item }} style={styles.thumbnail} />
                </TouchableOpacity>
                );
            })}
            </View>
        )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{data.ten}</Text>

          <View style={styles.row}>
            <FontAwesome name="map-marker" size={16} color="#666" />
            <Text style={styles.location}>{data.diaDiem}</Text>
          </View>

          <View style={styles.row}>
            <FontAwesome name="eye" size={16} color="#666" />
            <Text style={styles.views}>{data.luotXem + 1} lượt xem</Text>
          </View>

          <Text style={styles.subTitle}>Ý nghĩa</Text>
          <Text style={styles.content}>{data.yNghia}</Text>

          <Text style={styles.subTitle}>Mô tả</Text>
          <Text style={styles.content}>{data.moTa}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PhongTucChiTiet;
