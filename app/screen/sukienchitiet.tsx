import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/sukienchitiet.style";
import YoutubeIframe from "react-native-youtube-iframe";

const SuKienChiTiet = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [mainMedia, setMainMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/sukien/${id}`);
        const suKien = res.data;
        setData(suKien);

        await axios.patch(`${API_BASE_URL}/api/sukien/${id}/luotxem`);

        if (suKien.media?.length > 0) {
          const mediaData = await Promise.all(
            suKien.media.map(async (mediaId: string) => {
              const res = await axios.get(`${API_BASE_URL}/api/media/${mediaId}`);
              return res.data;
            })
          );
          setMedia(mediaData);

          const videos = mediaData.filter((item) => item.type === "video");
          setVideoList(videos);

          setMainMedia({ url: mediaData[0]?.url, type: mediaData[0]?.type });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMediaPress = (item: any) => {
    setMainMedia(item);
    setIsPlayingVideo(item.type === "video");
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : "";
  };

  const handleNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videoList.length;
    setCurrentVideoIndex(nextIndex);
    setMainMedia(videoList[nextIndex]);
  };

  const handlePrevVideo = () => {
    const prevIndex = (currentVideoIndex - 1 + videoList.length) % videoList.length;
    setCurrentVideoIndex(prevIndex);
    setMainMedia(videoList[prevIndex]);
  };

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
        <Text>Không tìm thấy sự kiện.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          {mainMedia?.type === "video" ? (
            <View style={styles.videoContainer}>
              <YoutubeIframe
                videoId={getYouTubeId(mainMedia.url)}
                height={250}
                play={isPlayingVideo}
              />
              {videoList.length > 1 && (
                <View style={styles.videoNavigation}>
                  <TouchableOpacity onPress={handlePrevVideo} style={styles.navButton}>
                    <FontAwesome name="chevron-left" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.videoIndicator}>
                    {currentVideoIndex + 1}/{videoList.length}
                  </Text>
                  <TouchableOpacity onPress={handleNextVideo} style={styles.navButton}>
                    <FontAwesome name="chevron-right" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <Image
              source={{ uri: mainMedia?.url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          )}

          {videoList.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                if (mainMedia?.type === "video") {
                  setIsPlayingVideo(false);
                  setMainMedia(media.find((m) => m.type === "image"));
                } else {
                  setIsPlayingVideo(true);
                  setMainMedia(videoList[0]);
                }
              }}
              style={styles.videoButton}
            >
              <Text style={styles.videoButtonText}>
                {mainMedia?.type === "video" ? "🎬 Xem ảnh" : `🎬 Xem video (${videoList.length})`}
              </Text>
            </TouchableOpacity>
          )}

          {!isPlayingVideo && media.length > 1 && (
            <View style={styles.thumbnailOverlay}>
              {media
                .filter((item) => item.type === "image")
                .slice(0, 4)
                .map((item, index) => {
                  if (index === 3 && media.length > 4) {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          router.push({
                            pathname: "/screen/danhsachanh",
                            params: {
                              ten: data.ten,
                              doiTuong: "SuKien",
                              doiTuongId: data._id,
                              type: "image",
                            },
                          })
                        }
                        style={styles.thumbnailWrapper}
                      >
                        <View style={[styles.thumbnail, styles.moreOverlay]}>
                          <Text style={styles.moreText}>+{media.length - 3}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleMediaPress(item)}
                      style={styles.thumbnailWrapper}
                    >
                      <Image source={{ uri: item.url }} style={styles.thumbnail} />
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
            <FontAwesome name="calendar" size={16} color="#666" />
            <Text style={styles.time}>
              {data.thoiGianBatDau} - {data.thoiGianKetThuc}
            </Text>
          </View>

          <View style={styles.row}>
            <FontAwesome name="eye" size={16} color="#666" />
            <Text style={styles.views}>{data.luotXem + 1} lượt xem</Text>
          </View>

          <Text style={styles.subTitle}>Mô tả</Text>
          <Text style={styles.content}>{data.moTa}</Text>

          {data.huongDan && (
            <>
              <Text style={styles.subTitle}>Hướng dẫn</Text>
              <Text style={styles.content}>{data.huongDan}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuKienChiTiet;
