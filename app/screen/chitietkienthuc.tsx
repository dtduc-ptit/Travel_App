import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { WebView } from "react-native-webview";
import styles from "../style/chitiet.style"; // import styles từ chitiet.style.ts
import { API_BASE_URL } from "@/constants/config";

const screenWidth = Dimensions.get("window").width;

const ChiTietKienThuc = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [kienThuc, setKienThuc] = useState<any>(null);

  // Audio
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Video modal visibility state
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/kienthuc/${id}`);
        setKienThuc(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết kiến thức:", err);
      }
    };

    fetchDetail();
  }, [id]);

  // Audio handling functions
  const handlePlayAudio = async () => {
    try {
      setShowAudioPlayer(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: kienThuc.audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
  
      newSound.setOnPlaybackStatusUpdate((status) => {
        // Kiểm tra nếu audio đã hoàn thành phát
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          setShowAudioPlayer(false);
        }
      });
    } catch (err) {
      console.error("Lỗi phát audio:", err);
    }
  };

  const handlePause = async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleClosePlayer = async () => {
    if (sound) await sound.unloadAsync();
    setShowAudioPlayer(false);
    setIsPlaying(false);
  };

  // Save article to AsyncStorage
  const handleSave = async () => {
    try {
      const savedList = JSON.parse(await AsyncStorage.getItem("savedArticles") || "[]");
      if (!savedList.includes(kienThuc._id)) {
        savedList.push(kienThuc._id);
        await AsyncStorage.setItem("savedArticles", JSON.stringify(savedList));
        alert("✅ Đã lưu bài viết!");
      } else {
        alert("ℹ️ Bài viết đã được lưu trước đó.");
      }
    } catch (err) {
      console.error("Lỗi khi lưu bài viết:", err);
    }
  };

  if (!kienThuc) return <Text>Đang tải...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút back */}
      <TouchableOpacity onPress={() => router.push("/kienthuc")} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={24} />
      </TouchableOpacity>

      <ScrollView>
        {/* Ảnh và tiêu đề */}
        <View style={styles.topRow}>
          <Image
            source={
              kienThuc?.hinhAnh?.[0]
                ? { uri: kienThuc.hinhAnh[0] }
                : require("../../assets/images/splash-image.png")
            }
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title} numberOfLines={3}>{kienThuc.tieuDe}</Text>
        </View>

        {/* Nút chức năng */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={handlePlayAudio}>
            <FontAwesome name="volume-up" size={18} color="#fff" />
            <Text style={styles.buttonText}>Nghe audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setShowVideo(true)}>
            <FontAwesome name="video-camera" size={18} color="#fff" />
            <Text style={styles.buttonText}>Xem video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <FontAwesome name="bookmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Lưu</Text>
          </TouchableOpacity>
        </View>

        {/* Nội dung */}
        <Text style={styles.content}>{kienThuc.noiDung}</Text>
      </ScrollView>

      {/* Audio Player Overlay */}
      {showAudioPlayer && (
        <View style={styles.audioOverlay}>
          <TouchableOpacity style={styles.audioBackdrop} onPress={handleClosePlayer} />
          <View style={styles.audioPlayer}>
            <Text style={styles.audioTitle}>{kienThuc.audioUrl?.split("/").pop()}</Text>
            <View style={styles.audioControls}>
              <TouchableOpacity onPress={handlePause}>
                <FontAwesome name={isPlaying ? "pause" : "play"} size={24} color="#000" />
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 12 }}>2:00</Text>
              <Text>3:00</Text>
              <TouchableOpacity>
                <FontAwesome name="volume-up" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Video Modal */}
      {showVideo && (
        <TouchableWithoutFeedback onPress={() => setShowVideo(false)}>
          <View style={styles.videoOverlay}>
            <View style={styles.videoContainer} onStartShouldSetResponder={() => true}>
              <WebView
                source={{ uri: kienThuc.videoUrl }}
                style={{ flex: 1 }}
                allowsFullscreenVideo
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
};

export default ChiTietKienThuc;
