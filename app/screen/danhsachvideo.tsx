import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/danhsachvideo.style";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import YoutubeIframe from "react-native-youtube-iframe";

const DanhSachVideo = () => {
  const { ten, doiTuong, doiTuongId, type, mainImage } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState<Record<string, boolean>>({});
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/media`, {
          params: { doiTuong, doiTuongId, type },
        });
        setVideos(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy media:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doiTuongId) fetchMedia();
  }, [doiTuongId]);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : "";
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeId(url);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const toggleDesc = (id: string) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePlayVideo = (id: string) => {
    if (playingVideoId === id) {
      setPlayingVideoId(null); // Dừng phát nếu đang phát video này
    } else {
      setPlayingVideoId(id); // Phát video mới và dừng các video khác
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
          <Text style= {styles.backButtonText}>Quay lại trang chi tiết</Text>
        </TouchableOpacity>
    <Text style={styles.heading}>Danh sách video của {ten}</Text>
    </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        videos.map((video, index) => {
          const isLongDesc = video.moTa?.length > 120;
          const isExpanded = expandedDesc[video._id];
          const isPlaying = playingVideoId === video._id;

          return (
            <View key={video._id || index} style={styles.videoCard}>
              {isPlaying ? (
                <YoutubeIframe
                  videoId={getYouTubeId(video.url)}
                  height={200}
                  play={isPlaying}
                />
              ) : (
                <TouchableOpacity onPress={() => handlePlayVideo(video._id)}>
                  <Image
                    source={{ uri: getYouTubeThumbnail(video.url) }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.playIconOverlay}>
                    <FontAwesome name="play" size={40} color="#fff" />
                  </View>
                </TouchableOpacity>
              )}
              {video.moTa && (
                <>
                  <Text style={styles.moTa} numberOfLines={isExpanded ? undefined : 3}>
                    {video.moTa}
                  </Text>
                  {isLongDesc && (
                    <TouchableOpacity onPress={() => toggleDesc(video._id)}>
                      <Text style={styles.xemThem}>
                        {isExpanded ? "Ẩn bớt" : "Xem thêm"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              <Text style={styles.dateText}>
                📅 Đăng tải: {moment(video.createdAt).format("DD/MM/YYYY")}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default DanhSachVideo;