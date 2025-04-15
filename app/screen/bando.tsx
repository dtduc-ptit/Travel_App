import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";

const BanDo = () => {
  const { diTichId } = useLocalSearchParams();
  const [placeholder, setPlaceholder] = useState("Tìm kiếm vị trí...");
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/ditich/${diTichId}`);
        const viTri = res.data.viTri; // ví dụ: "Bảo tàng lịch sử TP.HCM"
        setPlaceholder(viTri);

        const geoRes = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: viTri,
              key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            },
          }
        );

        const location = geoRes.data.results[0]?.geometry?.location;
        if (location) {
          const { lat, lng } = location;
          setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setMarker({ latitude: lat, longitude: lng });
        }
      } catch (err) {
        console.error("Lỗi lấy vị trí di tích:", err);
      }
    };

    if (diTichId) {
      fetchLocation();
    }
  }, [diTichId]);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails

        onPress={(data, details = null) => {
            if (!details) return;
            const loc = details.geometry.location;
          
            setRegion({
              latitude: loc.lat,
              longitude: loc.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          
            setMarker({ latitude: loc.lat, longitude: loc.lng });
          
            if (mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: loc.lat,
                  longitude: loc.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000
              );
            }
          }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          language: "vi",
        }}
        styles={autoCompleteStyles}
      />

      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
});

const autoCompleteStyles = {
  container: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    top: 10,
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: "white",
  },
  textInput: {
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 16,
  },
};

export default BanDo;
