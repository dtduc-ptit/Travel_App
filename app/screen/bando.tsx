

import React, { useRef, useState, useEffect } from "react";
import { View, Alert, TextInput, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";
import { API_BASE_URL, OPENROUTESERVICE_API_KEY } from "../../constants/config";
import { useLocalSearchParams } from "expo-router";
import styles from "../style/bando.style";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { showLocation, DirectionMode } from "react-native-map-link";
import AsyncStorage from '@react-native-async-storage/async-storage';
import openMap from 'react-native-map-link';


type Coordinate = {
  latitude: number;
  longitude: number;
};

const BanDo = () => {
  const { diTichId } = useLocalSearchParams<{ diTichId?: string }>();
  const mapRef = useRef<MapView>(null);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [originCoords, setOriginCoords] = useState<Coordinate | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coordinate | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [huongDan, setHuongDan] = useState<string | null>(null);
  const [showHuongDan, setShowHuongDan] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [moTa, setMoTa] = useState('');
  const [showOptions, setShowOptions] = useState(false);



  const validateAddress = (input: string): boolean => {
    return /^[a-zA-ZÀ-ỹ0-9\s,.-]{3,}$/.test(input.trim());
  };

  const geocodeAddress = async (address: string): Promise<Coordinate | null> => {
    try {
      const cleaned = `${address.trim().replace(/\s+/g, " ")}, Việt Nam`;
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: cleaned,
          format: "json",
          limit: 1,
        },
        headers: {
          "Accept-Language": "vi",
          "User-Agent": "MyApp/1.0 (contact@example.com)",
        },
      });

      if (!res.data || res.data.length === 0) throw new Error("Không tìm thấy toạ độ.");
      const loc = res.data[0];
      return {
        latitude: parseFloat(loc.lat),
        longitude: parseFloat(loc.lon),
      };
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xác định vị trí từ địa chỉ.");
      return null;
    }
  };

  const snapToRoad = async (coord: Coordinate): Promise<Coordinate> => {
    try {
      const res = await axios.get("https://api.openrouteservice.org/nearest", {
        params: {
          api_key: OPENROUTESERVICE_API_KEY,
          coordinates: `${coord.longitude},${coord.latitude}`,
        },
      });

      const snapped = res.data.coordinates[0]; // [longitude, latitude]
      return {
        latitude: snapped[1],
        longitude: snapped[0],
      };
    } catch (err) {
      console.log("Snap to road error:", err);
      return coord;
    }
  };

  const fetchRoute = async (origin: Coordinate, destination: Coordinate) => {
    try {
      const res = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          coordinates: [
            [origin.longitude, origin.latitude],
            [destination.longitude, destination.latitude],
          ],
        },
        {
          headers: {
            Authorization: OPENROUTESERVICE_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const geometry = res.data.features[0].geometry.coordinates;
      const summary = res.data.features[0].properties.summary;

      setRouteCoords(
        geometry.map(([lon, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lon,
        }))
      );

      setDistance((summary.distance / 1000).toFixed(2)); // km
      setDuration(Math.round(summary.duration / 60).toString()); // phút

      mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding: { top: 100, bottom: 100, left: 50, right: 50 },
        animated: true,
      });
    } catch (error) {
      console.log("Route error:", error);
      Alert.alert("Lỗi", "Không tìm được đường đi giữa hai điểm.");
    }
  };
  
    const handleSearch = async () => {
    if (!originInput || !destinationInput) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập cả hai địa chỉ.");
      return;
    }

    if (!validateAddress(originInput) || !validateAddress(destinationInput)) {
      Alert.alert("Địa chỉ không hợp lệ", "Vui lòng nhập địa chỉ rõ ràng.");
      return;
    }

    const [origin, destination] = await Promise.all([
      geocodeAddress(originInput),
      geocodeAddress(destinationInput),
    ]);

    if (origin && destination) {
      const snappedOrigin = await snapToRoad(origin);
      const snappedDestination = await snapToRoad(destination);

      setOriginCoords(snappedOrigin);
      setDestinationCoords(snappedDestination);
      fetchRoute(snappedOrigin, snappedDestination);
      Keyboard.dismiss();
    }
  };
  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('idNguoiDung');
      return id;
    } catch (error) {
      console.error('Lỗi khi lấy ID người dùng:', error);
      return null;
    }
  };
  const handleSaveLocation = async () => {
    const idNguoiDung = await getUserId();
    if (!idNguoiDung) return;
  
    try {
      // Bước 1: Gọi API kiểm tra
      const resCheck = await axios.get(`${API_BASE_URL}/api/noidungluutru/kiemtra`, {
        params: {
          nguoiDung: idNguoiDung,
          loaiNoiDung: 'DiaDiem',
          idNoiDung: diTichId, 
        },
      });
  
      if (resCheck.data.daLuu) {
        Alert.alert("Bạn đã lưu vị trí này rồi!");
        setShowSavePopup(false);
        return;
      }
  
      // Bước 2: Nếu chưa có, tiến hành lưu
      await axios.post(`${API_BASE_URL}/api/noidungluutru`, {
        nguoiDung: idNguoiDung,
        loaiNoiDung: 'DiaDiem',
        idNoiDung: diTichId,
        moTa: moTa
      });
  
      Alert.alert("Đã lưu vị trí thành công!");
      setShowSavePopup(false);
      setMoTa('');
    } catch (error) {
      console.error("Lỗi khi lưu vị trí:", error);
      Alert.alert("Có lỗi xảy ra khi lưu!");
    }
  };
  

  useEffect(() => {
    const fetchViTriDiTich = async () => {
      if (!diTichId) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/ditich/${diTichId}`);
        const viTri = res.data.viTri;
        setHuongDan(res.data.huongDan);

        setDestinationInput(viTri);

        const coords = await geocodeAddress(viTri);
        if (coords) {
          const snapped = await snapToRoad(coords);
          setDestinationCoords(snapped);
          mapRef.current?.animateToRegion({
            latitude: snapped.latitude,
            longitude: snapped.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (err) {
        Alert.alert("Lỗi", "Không thể lấy dữ liệu vị trí di tích.");
      }
    };

    fetchViTriDiTich();
  }, [diTichId]);

  return (
    <View style={styles.container}>

      <View style={styles.inputBox}>
        {/* Ô nhập vị trí của bạn */}
        <View style={styles.inputRow}>
          <View style={styles.iconCircle} />
          <TextInput
            style={styles.input}
            placeholder="Vị trí của bạn"
            value={originInput}
            onChangeText={setOriginInput}
            returnKeyType="next"
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Ô nhập địa điểm đến */}
        <View style={styles.inputRow}>
          <View style={styles.iconPin} />
          <TextInput
            style={styles.input}
            placeholder="Khu di tích bạn muốn đến"
            value={destinationInput}
            onChangeText={setDestinationInput}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            editable={false}
            pointerEvents="none"
          />
        </View>
        
      </View>


      {/* Bản đồ */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 21.0285,
          longitude: 105.8542,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {originCoords && <Marker coordinate={originCoords} title="Vị trí của bạn" pinColor="blue" />}
        {destinationCoords && <Marker coordinate={destinationCoords} title="Điểm đến" />}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>

      {showHuongDan && (
        <View style={styles.guidePanel}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowHuongDan(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.guideTitle}>Hướng dẫn tham quan</Text>
          <Text style={styles.guideContent}>{huongDan || "Hướng dẫn đang được cập nhật, bạn quay lại sau nha 💫"}</Text>
        </View>
      )}
    
        {/* Nút hướng dẫn */}
      <TouchableOpacity
        style={styles.guideButton}
        onPress={() => setShowHuongDan(true)}
      >
        <Text style={styles.guideButtonText}>📖 Cẩm nang mini</Text>
      </TouchableOpacity>

      {/* Nút FAB chính */}
      <TouchableOpacity
        style={styles.mainFab}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Các lựa chọn hiển thị khi mở FAB */}
      {showOptions && (
        <View style={styles.fabOptions}>

        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
            <View style={styles.overlayCloseArea} />
          </TouchableWithoutFeedback>
                  
          {/* Nút lưu địa điểm */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setShowSavePopup(true);
              setShowOptions(false);
            }}
          >
            <Ionicons name="bookmark-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>Lưu địa điểm</Text>
          </TouchableOpacity>

          {/* Nút mở Google Map */}
          {destinationCoords && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false);
                showLocation({
                  latitude: destinationCoords.latitude,
                  longitude: destinationCoords.longitude,
                  title: "Điểm đến của bạn",
                  googleForceLatLon: true,
                  directionsMode: "driving" as DirectionMode,
                });
              }}
            >
              <Ionicons name="navigate-outline" size={22} color="#fff" />
              <Text style={styles.optionText}>Đi bằng Google Map</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Popup nhập mô tả */}
      {showSavePopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>Nhập mô tả cho địa điểm</Text>
            <TextInput
              style={styles.popupInput}
              placeholder="Ví dụ: Địa điểm này rất đẹp"
              value={moTa}
              onChangeText={setMoTa}
              multiline
            />
            <View style={styles.popupButtons}>
              <TouchableOpacity onPress={handleSaveLocation} style={styles.saveBtn}>
                <Text style={{ color: "#fff" }}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowSavePopup(false)}
                style={styles.cancelBtn}
              >
                <Text>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Thông tin quãng đường */}
      {(distance && duration) && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>Quãng đường: {distance} km - Thời gian: {duration} phút</Text>
        </View>
      )}
      
    </View>
  );
};

export default BanDo;
     