import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router"; // Thêm useLocalSearchParams
import { View, Text, Linking, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/bandovanhoa.style";
import DropDownPicker from "react-native-dropdown-picker";

type Coordinate = { latitude: number; longitude: number };
interface DiaDiem {
  _id: string;
  ten: string;
  viTri: string;
  loai: string;
  camNang?: string;
  luotXem?: number;
  moTa?: string;
  thoiGianBatDau?: string;
}
interface DiaDiemWithCoords extends DiaDiem {
  coords: Coordinate;
}

const BanDoVanHoa = () => {
  const mapRef = useRef<MapView>(null);
  const { id } = useLocalSearchParams(); 
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [tempType, setTempType] = useState("Tất cả");
  const [diadiemList, setDiadiemList] = useState<DiaDiemWithCoords[]>([]);
  const [selectedDiaDiem, setSelectedDiaDiem] = useState<DiaDiemWithCoords | null>(null);
  const [goiYHanhTrinh, setGoiYHanhTrinh] = useState<DiaDiemWithCoords[]>([]);
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Tất cả");
  const [tempDistrict, setTempDistrict] = useState<string>("Tất cả");
  const [isLoading, setIsLoading] = useState(true);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [distance, setDistance] = useState<number>(10);
  const [tempDistance, setTempDistance] = useState<number>(10);
  const [openType, setOpenType] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openDistance, setOpenDistance] = useState(false);

  const panelHeight = useSharedValue(0);
  const panelStyle = useAnimatedStyle(() => ({
    height: withTiming(panelHeight.value, { duration: 300 }),
    opacity: withTiming(panelHeight.value > 0 ? 1 : 0, { duration: 300 }),
  }));

  useEffect(() => {
    panelHeight.value = showFilterPanel ? 650 : 0;
  }, [showFilterPanel]);

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
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bando`);
        const diaDiems: DiaDiem[] = res.data;
        const withCoords: DiaDiemWithCoords[] = [];
        const districts = new Set<string>();

        for (const d of diaDiems) {
          const coords = await geocodeAddress(d.viTri);
          if (coords) {
            const huyen = extractDistrictName(d.viTri);
            withCoords.push({ ...d, coords });
            if (huyen !== "Không rõ") districts.add(huyen);
          }
        }

        setDiadiemList(withCoords);
        setDistrictList(["Tất cả", ...Array.from(districts)]);

        // Tự động chọn địa điểm nếu có id từ tham số điều hướng
        if (id && typeof id === "string") {
          const selected = withCoords.find((d) => d._id === id);
          if (selected) {
            setSelectedDiaDiem(selected);
            // Zoom bản đồ đến địa điểm được chọn
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: selected.coords.latitude,
                longitude: selected.coords.longitude,
                latitudeDelta: 0.01, // Zoom gần hơn
                longitudeDelta: 0.01,
              }, 1000);
            }
          }
        }
      } catch (err) {
        console.log("Lỗi fetch địa điểm:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaDiem();
  }, [id]); // Thêm id vào dependency để useEffect chạy lại nếu id thay đổi

  useEffect(() => {
    if (diadiemList.length && mapRef.current && !id) {
      // Chỉ fit toàn bộ địa điểm nếu không có id
      mapRef.current.fitToCoordinates(
        diadiemList.map((d) => d.coords),
        { edgePadding: { top: 80, bottom: 80, left: 80, right: 80 }, animated: true }
      );
    }
  }, [diadiemList, id]);

  useEffect(() => {
    if (!selectedDiaDiem) {
      setGoiYHanhTrinh([]);
      return;
    }
    setShowSuggestions(false);
    setShowAllSuggestions(false);
    const nearby = diadiemList.filter((d) => {
      if (d._id === selectedDiaDiem._id) return false;
      if (!d.coords || !selectedDiaDiem.coords) return false;

      const dist = haversineDistance(selectedDiaDiem.coords, d.coords);
      return dist <= distance;
    });

    setGoiYHanhTrinh(nearby);
  }, [selectedDiaDiem, distance]);

  const extractDistrictName = (viTriRaw: string): string => {
    const viTri = viTriRaw.toLowerCase();
    const beforeHT = viTri.split("hà tĩnh")[0];
    const parts = beforeHT
      .replace(/tỉnh|huyện|thị xã|thành phố|xã|phường|thị trấn/gi, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length > 0 ? capitalizeFirstLetter(parts[parts.length - 1]) : "Không rõ";
  };

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getIcon = (loai: string, isSelected: boolean) => {
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
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLng = toRad(coord2.longitude - coord1.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1.latitude)) *
        Math.cos(toRad(coord2.latitude)) *
        Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const openGoogleMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  };

  const handleMarkerPress = (dd: DiaDiemWithCoords) => {
    setSelectedDiaDiem(dd);
  };

  const handleApplyFilter = () => {
    setSelectedType(tempType);
    setSelectedDistrict(tempDistrict);
    setDistance(tempDistance);
    setShowFilterPanel(false);
  };

  const handleResetFilter = () => {
    setTempType("Tất cả");
    setTempDistrict("Tất cả");
    setTempDistance(10);
  };

  const filteredList = diadiemList.filter((d) => {
    const matchLoai = selectedType === "Tất cả" || d.loai === selectedType;
    const matchHuyen =
      selectedDistrict === "Tất cả" ||
      extractDistrictName(d.viTri) === selectedDistrict;
    return matchLoai && matchHuyen;
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2e86de" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bản đồ văn hóa</Text>
        <TouchableOpacity onPress={() => setShowFilterPanel(!showFilterPanel)}>
          <Ionicons name="filter" size={24} color="#2e86de" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.filterPanel, panelStyle]}>
        <View style={styles.filterConnector} />
        <View style={styles.filterSummary}>
          <Text style={styles.filterSummaryText}>
            Đang chọn: <Text style={styles.filterSummaryValue}>{tempType}</Text>,{" "}
            <Text style={styles.filterSummaryValue}>{tempDistrict}</Text>,{" "}
            <Text style={styles.filterSummaryValue}>{tempDistance}km</Text>
          </Text>
        </View>

        <Text style={styles.filterLabel}>Loại địa điểm</Text>
        <DropDownPicker
          open={openType}
          value={tempType}
          items={[
            { label: "Tất cả", value: "Tất cả" },
            { label: "Di tích", value: "Di tích" },
            { label: "Lễ hội", value: "Lễ hội" },
            { label: "Sự kiện", value: "Sự kiện" },
          ]}
          setOpen={setOpenType}
          setValue={setTempType}
          style={styles.pickerContainer}
          textStyle={styles.pickerText}
          dropDownContainerStyle={styles.dropdown}
          zIndex={3000}
          zIndexInverse={1000}
        />

        <Text style={styles.filterLabel}>Chọn huyện</Text>
        <DropDownPicker
          open={openDistrict}
          value={tempDistrict}
          items={districtList.map((district) => ({ label: district, value: district }))}
          setOpen={setOpenDistrict}
          setValue={setTempDistrict}
          style={styles.pickerContainer}
          textStyle={styles.pickerText}
          dropDownContainerStyle={styles.dropdown}
          zIndex={2000}
          zIndexInverse={2000}
        />

        <Text style={styles.filterLabel}>Khoảng cách (km)</Text>
        <DropDownPicker
          open={openDistance}
          value={tempDistance}
          items={[5,10, 15, 20].map((d) => ({
            label: `${d}km`,
            value: d,
          }))}
          setOpen={setOpenDistance}
          setValue={setTempDistance}
          style={styles.pickerContainer}
          textStyle={styles.pickerText}
          dropDownContainerStyle={styles.dropdown}
          zIndex={1000}
          zIndexInverse={3000}
        />

        <View style={styles.buttonGroupFilter}>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetFilter}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowFilterPanel(false)}
          >
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
            <Text style={styles.buttonText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

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
            key={`${index}-${selectedDiaDiem?._id || "none"}`}
            coordinate={dd.coords}
            title={selectedDiaDiem?._id === dd._id ? selectedDiaDiem.ten : dd.ten}
            description={dd.camNang || ""}
            onPress={() => handleMarkerPress(dd)}
          >
            {getIcon(dd.loai, selectedDiaDiem?._id === dd._id)}
          </Marker>
        ))}
      </MapView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>⏳ Đang tải dữ liệu bản đồ...</Text>
          </View>
        </View>
      )}

      {!isLoading && diadiemList.length > 0 && filteredList.length === 0 && (
        <View style={styles.noDataWrapper}>
          <FontAwesome name="exclamation-triangle" size={16} color="#e63946" style={{ marginRight: 8 }} />
          <Text style={styles.noDataText}>
            Không tìm thấy {selectedType} tại khu vực {selectedDistrict}, Hà Tĩnh.
          </Text>
        </View>
      )}

      {selectedDiaDiem && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>{selectedDiaDiem.ten}</Text>
          <Text style={styles.infoText}>{renderShortDescription(selectedDiaDiem.moTa)}</Text>
          <Text style={styles.infoSub}>👁️ {selectedDiaDiem.luotXem || 0} lượt xem</Text>
          <Text style={styles.infoSub}>Vị trí: {selectedDiaDiem.viTri}</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#28a745" }]}
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
              style={[styles.button, { backgroundColor: "#007bff" }]}
              onPress={handleXemChiTiet}
            >
              <Text style={styles.buttonText}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowSuggestions(!showSuggestions)}
            style={{ marginTop: 12 }}
          >
            <Text style={{ color: "#007bff", fontStyle: "italic", fontWeight: "500" }}>
              {showSuggestions ? "Ẩn địa điểm gần đây" : "📍 Địa điểm gần đây"}
            </Text>
          </TouchableOpacity>

          {showSuggestions && (
            <View style={styles.suggestionWrapper}>
              {goiYHanhTrinh.length > 0 ? (
                <>
                  <Text style={styles.suggestionTitle}>🧭 Gần đây có:</Text>
                  {(showAllSuggestions ? goiYHanhTrinh : goiYHanhTrinh.slice(0, 3)).map((g, idx) => {
                    const km = selectedDiaDiem ? haversineDistance(selectedDiaDiem.coords, g.coords) : 0;
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setSelectedDiaDiem(g);
                          setShowSuggestions(false);
                          setShowAllSuggestions(false);
                        }}
                        style={styles.suggestionItem}
                      >
                        <Ionicons name="navigate" size={16} color="#2e86de" style={{ marginRight: 6 }} />
                        <Text style={styles.suggestionText}>
                          {g.ten}{" "}
                          <Text style={{ fontSize: 12, color: "#777", fontStyle: "italic" }}>
                            (cách {km.toFixed(1)} km)
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {goiYHanhTrinh.length > 3 && !showAllSuggestions && (
                    <TouchableOpacity
                      onPress={() => setShowAllSuggestions(true)}
                      style={styles.showMoreBtn}
                    >
                      <Text style={styles.showMoreText}>
                        +{goiYHanhTrinh.length - 3} địa điểm khác
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Text style={styles.noDataText}>
                  Không tìm thấy địa điểm văn hóa nào trong bán kính {distance}km 🗺️
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default BanDoVanHoa;