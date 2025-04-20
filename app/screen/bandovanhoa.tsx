import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/bandovanhoa.style";
import FilterBar from "../../components/ui/FilterBar";

type Coordinate = { latitude: number; longitude: number };
interface DiaDiem { _id: string; ten: string; viTri: string; loai: string; camNang?: string; luotXem?: number; moTa?: string; thoiGianBatDau?: string; }
interface DiaDiemWithCoords extends DiaDiem { coords: Coordinate; }

const BanDoVanHoa = () => {
  const mapRef = useRef<MapView>(null);
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [diadiemList, setDiadiemList] = useState<DiaDiemWithCoords[]>([]);
  const [selectedDiaDiem, setSelectedDiaDiem] = useState<DiaDiemWithCoords | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [goiYHanhTrinh, setGoiYHanhTrinh] = useState<DiaDiemWithCoords[]>([]);

  const renderShortDescription = (text: string = "") => {
    if (!text) return "";
    return text.length > 100 ? text.slice(0, 100) + "..." : text;
  };

  const geocodeAddress = async (address: string): Promise<Coordinate | null> => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: `${address}, Việt Nam`, format: "json", limit: 1 },
        headers: { "Accept-Language": "vi", "User-Agent": "MyApp/1.0" },
      });
      if (res.data.length === 0) throw new Error("Không tìm thấy");
      return {
        latitude: parseFloat(res.data[0].lat),
        longitude: parseFloat(res.data[0].lon),
      };
    } catch (err) {
      console.log("Lỗi geocode:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchDiaDiem = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bando`);
        const diaDiems: DiaDiem[] = res.data;
        const withCoords: DiaDiemWithCoords[] = [];

        for (const d of diaDiems) {
          const coords = await geocodeAddress(d.viTri);
          if (coords) withCoords.push({ ...d, coords });
        }

        setDiadiemList(withCoords);
      } catch (err) {
        console.log("Lỗi fetch địa điểm:", err);
      }
    };

    fetchDiaDiem();
  }, []);

  useEffect(() => {
    if (diadiemList.length && mapRef.current) {
      mapRef.current.fitToCoordinates(
        diadiemList.map(d => d.coords),
        { edgePadding: { top: 80, bottom: 80, left: 80, right: 80 }, animated: true }
      );
    }
  }, [diadiemList]);
  
  useEffect(() => {
    if (!selectedDiaDiem) {
      setGoiYHanhTrinh([]); // reset khi không chọn
      return;
    }
  
    const nearby = diadiemList.filter((d) => {
      if (d._id === selectedDiaDiem._id) return false;
      if (!d.coords || !selectedDiaDiem.coords) return false;
  
      const distance = haversineDistance(selectedDiaDiem.coords, d.coords);
      return distance <= 5; // Dưới 5km
    });
  
    setGoiYHanhTrinh(nearby);
  }, [selectedDiaDiem]);
  
  

  const getIcon = (loai: string,  isSelected: boolean) => {
    const size = isSelected ? 36 : 24;

    switch (loai) {
      case "Di tích": return <FontAwesome name="university" size={size} color="blue" />;
      case "Lễ hội": return <FontAwesome name="flag" size={size} color="orange" />;
      case "Sự kiện": return <Ionicons name="calendar" size={size} color="purple" />;
      default: return <FontAwesome name="map-marker" size={size} color="gray" />;
    }
  };

  const handleXemChiTiet = () => {
    if (!selectedDiaDiem) return;
    const id = selectedDiaDiem._id;
    switch (selectedDiaDiem.loai) {
      case "Di tích":
        router.push({ pathname: "/screen/ditichchitiet", params: { id } });
        break;
      case "Lễ hội":
        router.push({ pathname: "/screen/phongtucchitiet", params: { id } });
        break;
      case "Sự kiện":
        router.push({ pathname: "/screen/sukienchitiet", params: { id } });
        break;
      default:
        break;
    }
  };

    const haversineDistance = (coord1: Coordinate, coord2: Coordinate): number => {
      const toRad = (x: number): number => (x * Math.PI) / 180;
      const R = 6371; // Earth's radius in kilometers
      const dLat = toRad(coord2.latitude - coord1.latitude);
      const dLng = toRad(coord2.longitude - coord1.longitude);
      const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1.latitude)) *
        Math.cos(toRad(coord2.latitude)) *
        Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
  

  const openGoogleMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  };

  const handleMarkerPress = (dd: DiaDiemWithCoords) => {
    setSelectedDiaDiem(dd);
    setShowFullDescription(false); 
  };
  

  const filteredList = selectedType === "Tất cả"
    ? diadiemList
    : diadiemList.filter(d => d.loai === selectedType);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        initialRegion={{
          latitude: 20.9822,
          longitude: 105.7809,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={() => setSelectedDiaDiem(null)}
      >
        {filteredList.map((dd, index) => (
          <Marker
            key={index}
            coordinate={dd.coords}
            title={dd.ten}
            description={dd.camNang || ""}
            onPress={() => handleMarkerPress(dd)}
          >
            {getIcon(dd.loai, selectedDiaDiem?._id === dd._id)}
          </Marker>
        ))}
      </MapView>

      <FilterBar selected={selectedType} onSelect={setSelectedType} />

      {selectedDiaDiem && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>{selectedDiaDiem.ten}</Text>
          <Text style={styles.infoText}>{renderShortDescription(selectedDiaDiem.moTa)}</Text>
          <Text style={styles.infoSub}>👁️ {selectedDiaDiem.luotXem || 0} lượt xem</Text>
          <Text style={styles.infoSub}> Vị trí: {selectedDiaDiem.viTri }</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#28a745", marginTop: 5 }]}
            onPress={() =>
              openGoogleMaps(
                selectedDiaDiem.coords.latitude,
                selectedDiaDiem.coords.longitude
              )
            }
          >
            <Text style={styles.buttonText}>Tìm đường</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#007bff", flex: 1 }]}
            onPress={handleXemChiTiet}
          >
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      )}

      {goiYHanhTrinh.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={[styles.infoSub, { fontWeight: "bold" }]}>🧭 Gần đây có:</Text>
          {goiYHanhTrinh.map((g, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedDiaDiem(g)} // hoặc chuyển sang chi tiết
            >
              <Text style={[styles.infoSub, { color: "#007bff", textDecorationLine: "underline" }]}>
                • {g.ten}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

    </View>
  );
};

export default BanDoVanHoa;
