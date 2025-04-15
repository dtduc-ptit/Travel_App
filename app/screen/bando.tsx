import React, { useRef, useState, useEffect } from "react";
import { View, Alert, Keyboard } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";
import { API_BASE_URL, GOOGLE_MAPS_API_KEY } from "../../constants/config";
import { useLocalSearchParams } from "expo-router";
import styles, { autoCompleteStyles } from "../style/bando.style";

type Coordinate = {
  latitude: number;
  longitude: number;
};

const BanDo = () => {
  const { diTichId } = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [placeholder, setPlaceholder] = useState<string>("Nhập vị trí của bạn");
  const [viTri, setViTri] = useState<string>("Đang tải vị trí...");

  const geocodeAddress = async (address: string): Promise<Coordinate | null> => {
    try {
      const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: { address, key: GOOGLE_MAPS_API_KEY },
      });
      const location = res.data.results[0]?.geometry?.location;
      if (location) return { latitude: location.lat, longitude: location.lng };
    } catch (error) {
      Alert.alert("Lỗi khi tìm vị trí.");
    }
    return null;
  };

  const fetchRoute = async (origin: Coordinate, destination: Coordinate): Promise<void> => {
    try {
      const res = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      const points = res.data.routes[0]?.overview_polyline?.points;
      if (!points) return;

      const decoded = decodePolyline(points);
      setRouteCoords(decoded);

      mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
        animated: true,
      });
    } catch (error) {
      Alert.alert("Không tìm được đường đi.");
    }
  };

  const decodePolyline = (t: string): Coordinate[] => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < t.length) {
      let b, shift = 0, result = 0;
      do {
        b = t.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = result = 0;
      do {
        b = t.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  useEffect(() => {
    const fetchViTri = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/ditich/${diTichId}`);
        const vitriData = res.data.viTri;
        setViTri(vitriData);

        const destinationCoords = await geocodeAddress(vitriData);
        if (destinationCoords) {
          setDestination(destinationCoords);
          mapRef.current?.animateToRegion({
            latitude: destinationCoords.latitude,
            longitude: destinationCoords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu vị trí:", err);
      }
    };

    if (diTichId) fetchViTri();
  }, [diTichId]);

  const handleUserLocation = async (text: string): Promise<void> => {
    const coords = await geocodeAddress(text);
    if (coords) {
      setUserLocation(coords);
      Keyboard.dismiss();
      if (destination) {
        fetchRoute(coords, destination);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Ô nhập vị trí người dùng */}
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={(data, details = null) => {
          if (details) {
            handleUserLocation(details.formatted_address);
          }
        }}
        fetchDetails
        query={{ key: GOOGLE_MAPS_API_KEY, language: "vi" }}
        styles={autoCompleteStyles("top")}
        textInputProps={{
          onSubmitEditing: (event) => {
            handleUserLocation(event.nativeEvent.text);
          },
        }}
      />

      {/* Ô hiển thị vị trí đích */}
      <GooglePlacesAutocomplete
        placeholder={viTri}
        query={{ key: GOOGLE_MAPS_API_KEY, language: "vi" }}
        styles={autoCompleteStyles("below")}
        textInputProps={{ editable: false }}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: destination?.latitude || 21.0285,
          longitude: destination?.longitude || 105.8542,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {destination && <Marker coordinate={destination} title="Địa điểm" />}
        {userLocation && <Marker coordinate={userLocation} title="Vị trí của bạn" pinColor="blue" />}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>
    </View>
  );
};

export default BanDo;
