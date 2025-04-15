// app/screen/sukiensapdienra.tsx
import React, { useEffect, useState } from "react";
import { View, Text, SectionList, ImageBackground, StyleSheet } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../constants/config";
import styles from "../style/sukiensapxep.style";
import { StatusBar, Platform ,TouchableOpacity} from "react-native";
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';


interface SuKien {
  _id: string;
  ten: string;
  thoiGianBatDau: string;
  imageUrl: string;
}

const groupByMonth = (suKiens: SuKien[]) => {
  const grouped: Record<string, SuKien[]> = {};

  suKiens.forEach((sk) => {
    const [day, month, year] = sk.thoiGianBatDau.split("/");
    const monthYear = `${month}/${year}`;
    if (!grouped[monthYear]) grouped[monthYear] = [];
    grouped[monthYear].push(sk);
  });

  return Object.entries(grouped).map(([month, data]) => ({
    title: month,
    data,
  }));
};

const SuKienSapDienRaScreen = () => {
  const [sections, setSections] = useState<{ title: string; data: SuKien[] }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/sukien/sapxepsukien`);
        const grouped = groupByMonth(res.data);
        setSections(grouped);
      } catch (err) {
        console.error("Lỗi khi fetch sự kiện:", err);
      }
    };

    fetchData();
  }, []);
  const navigation = useNavigation();

  return (
    <View style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, flex: 1 }}>
        <Text style={styles.mainTitle}>Sự kiện diễn ra trong năm</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>Tháng {title}</Text>
        )}
        renderItem={({ item }) => (
          <ImageBackground source={{ uri: item.imageUrl }} style={styles.item}>
            <View style={styles.overlay}>
              <Text style={styles.time}>{item.thoiGianBatDau}</Text>
              <Text style={styles.title}>{item.ten}</Text>
            </View>
          </ImageBackground>
        )}
      />
    </View>
  );
  
};


export default SuKienSapDienRaScreen;
