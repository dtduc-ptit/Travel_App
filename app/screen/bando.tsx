
import React, { useRef, useState, useEffect } from "react";
import { View, Alert, TextInput, Keyboard, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";
import { API_BASE_URL, OPENROUTESERVICE_API_KEY } from "../../constants/config";
import { useLocalSearchParams } from "expo-router";
import styles from "../style/bando.style";

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

      const snapped = res.data.coordinates[0]; // [lon, lat]
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
  
    const [origin, destination] = await Promise.all([
      geocodeAddress(originInput),
      geocodeAddress(destinationInput),
    ]);
  
    if (origin && destination) {
      try {
        const [snappedOrigin, snappedDestination] = await Promise.all([
          snapToRoad(origin),
          snapToRoad(destination),
        ]);
  
        setOriginCoords(snappedOrigin);
        setDestinationCoords(snappedDestination);
        fetchRoute(snappedOrigin, snappedDestination);
        Keyboard.dismiss();
      } catch (err) {
        Alert.alert("Lỗi", "Không thể định vị gần đường để tìm đường đi.");
      }
    } else {
      Alert.alert("Lỗi", "Không xác định được vị trí hợp lệ từ địa chỉ.");
    }
  };
  

  useEffect(() => {
    const fetchViTriDiTich = async () => {
      if (!diTichId) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/ditich/${diTichId}`);
        const viTri = res.data.viTri;

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
      {/* Ô nhập địa chỉ bạn đang ở */}
      <TextInput
        style={[styles.input, { marginTop: 40 }]}
        placeholder="Nhập địa chỉ bạn đang ở"
        value={originInput}
        onChangeText={setOriginInput}
        returnKeyType="next"
        onSubmitEditing={handleSearch}
      />

      {/* Ô nhập địa chỉ đích */}
      <TextInput
        style={[styles.input, { marginTop: 10 }]}
        placeholder="Nhập địa chỉ bạn muốn đến"
        value={destinationInput}
        onChangeText={setDestinationInput}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

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
     