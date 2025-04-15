import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/kienthuc.style";
import { API_BASE_URL } from "@/constants/config";

const categories = [
  { title: "Nổi bật", key: "noibat" },
  { title: "Xem nhiều", key: "xemnhieu" },
  { title: "Độc đáo", key: "docdao" },
  { title: "Mới cập nhật", key: "moicapnhat" }
];

const TrangKienThuc = () => {
  const router = useRouter();
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any>({
    noibat: [],
    xemnhieu: [],
    docdao: [],
    moicapnhat: [],
  });

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
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/kienthuc`);
        const { noibat, xemnhieu, docdao, moicapnhat } = res.data;
        setData({ noibat, xemnhieu, docdao, moicapnhat });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu kiến thức:", error);
      }
    };

    fetchData();
  }, []);

  const renderSection = (title: string, items: any[]) => (
   <View style={styles.section} key={title}>
     <View style={styles.sectionHeader}>
       <Text style={styles.sectionTitle}>{title}</Text>
       <FontAwesome name="chevron-right" size={16} />
     </View>
     <View style={styles.itemsContainer}>
       {(items || []).slice(0, 2).map((item, index) => (
         <View key={index} style={styles.item}>
           <TouchableOpacity
               onPress={() => router.replace({ pathname: "../screen/chitietkienthuc", params: { id: item._id } })}
               >
               <Image
                  source={
                     item?.hinhAnh?.[0]
                     ? { uri: item.hinhAnh[0] }
                     : require("../../assets/images/splash-image.png")
                  }
                  style={styles.itemImage}
                  resizeMode="cover"
               />
               <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode="tail">
                  {item?.tieuDe}
               </Text>
            </TouchableOpacity>
         </View>
       ))}
     </View>
   </View>
 );

  return (
    <SafeAreaView style={styles.container}>
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
            source={
              nguoiDung?.anhDaiDien
                ? { uri: nguoiDung.anhDaiDien }
                : require("../../assets/images/logo.jpg")
            }
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
          <TouchableOpacity onPress={() => { /* handle bookmark */ }}>
            <FontAwesome name="bookmark" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* handle history */ }}>
            <FontAwesome name="history" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Nội dung chính */}
      <ScrollView style={styles.mainContent}>
        <Text style={styles.mainTitle}>Danh sách kiến thức</Text>
        {categories.map(cat => renderSection(cat.title, data[cat.key]))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrangKienThuc;
