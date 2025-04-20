import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, Platform, TextInput } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@/constants/config';
import axios from 'axios';
import styles from '../style/kienthuc.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DanhSachKienThuc = () => {
  const router = useRouter();
  const { categoryTitle, categoryKey } = useLocalSearchParams();
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [kienThucList, setKienThucList] = useState<any[]>([]);

  // Lấy vùng an toàn từ useSafeAreaInsets
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchNguoiDung = async () => {
      try {
        const idNguoiDung = await AsyncStorage.getItem("idNguoiDung");
        if (idNguoiDung) {
          const res = await axios.get(`${API_BASE_URL}/api/nguoidung/${idNguoiDung}`);
          setNguoiDung({ ...res.data, _id: idNguoiDung });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchNguoiDung();
  }, []);

  useEffect(() => {
    const fetchKienThuc = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/kienthuc/${categoryKey}`);
        setKienThucList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu kiến thức:', error);
      }
    };

    if (categoryKey) {
      fetchKienThuc();
    }
  }, [categoryKey]);

  const handleItemPress = (kienThucId: any) => {
    const idAsString = kienThucId.toString(); // Nếu kienThucId là ObjectId, chuyển thành chuỗi
  
    // Điều hướng tới màn hình chi tiết kiến thức và truyền id của kiến thức
    router.push({
      pathname: "/screen/chitietkienthuc", // Đảm bảo tên màn hình chính xác
      params: { id: idAsString }, // Truyền id của kiến thức
    });
  };

  const renderKienThuc = (kienThuc: any) => (
    <TouchableOpacity onPress={() => handleItemPress(kienThuc._id)} style={styles.kienThucItem} key={kienThuc._id}>
      <Image
        source={{ uri: kienThuc.hinhAnh[0] }}
        style={styles.kienThucImage}
        resizeMode="cover"
      />
      <Text style={styles.kienThucTitle}>{kienThuc.tieuDe}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "../screen/thongtincanhan",
              params: { id: nguoiDung?._id }
            })
          }
        >
          <Image
            source={nguoiDung?.anhDaiDien ? { uri: nguoiDung.anhDaiDien } : require("../../assets/images/logo.jpg")}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <TextInput
            placeholder="Tìm kiếm nội dung"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push("../screen/kienthucdaluu")}>
            <Ionicons name="bookmark-outline" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>          
        </View>
      </View>

      <View style={[styles.header, { marginTop: 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nội dung {`${typeof categoryTitle === 'string' ? categoryTitle.toLowerCase() : ''}`}</Text>
      </View>

      <FlatList
        data={kienThucList}
        renderItem={({ item }) => renderKienThuc(item)}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Không có dữ liệu</Text>}
      />
    </SafeAreaView>
  );
};

export default DanhSachKienThuc;
