import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList, StyleSheet,
    ScrollView, Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { API_BASE_URL } from "../../constants/config";
import { useRouter } from "expo-router";
import styles from "../style/trangcanhan.style";
import { useNavigation } from "@react-navigation/native";


const TAB_OPTIONS = ['Phong tục', 'Di Tích', 'Địa điểm', 'Sự kiện'];

const TrangCaNhan = () => {
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const router = useRouter();
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState('Địa điểm');
  interface DiaDiem {
    _id: string;
    ten: string;
    viTri: string;
  }

  const [diaDiemData, setDiaDiemData] = useState<DiaDiem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (idNguoiDung : string , loaiNoiDung : string, idNoiDung : string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/noidungluutru`, {
        data: {
          nguoiDung: idNguoiDung,
          loaiNoiDung,
          idNoiDung
        }
      });
  
      // Cập nhật lại danh sách sau khi xoá
      setDiaDiemData((prev) => prev.filter(item => item._id !== idNoiDung));
    } catch (err) {
      console.error('Xoá thất bại:', err);
      Alert.alert("Lỗi", "Không thể xoá nội dung");
    }
  };

  const confirmDelete = (nguoiDungId: string, loaiNoiDung: string, noiDungId: string) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa ${selectedTab} này ra khỏi mục lưu không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => handleDelete(nguoiDungId, loaiNoiDung, noiDungId),
          style: "destructive"
        }
      ]
    );
  };
  
  
  const fetchDiaDiem = async () => {
    try {
      setLoading(true);
      const idNguoiDung = await AsyncStorage.getItem('idNguoiDung');
      if (!idNguoiDung) return;

      const res = await axios.get(`${API_BASE_URL}/api/noidungluutru/diadiem`, {
        params: { nguoiDung: idNguoiDung },
      });

      setDiaDiemData(res.data.diaDiems);
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu địa điểm:', error);
    } finally {
      setLoading(false);
    }
  };

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
    if (selectedTab === 'Địa điểm') {
      fetchDiaDiem();
    }

    fetchNguoiDung();
  }, [selectedTab]);
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("idNguoiDung");
      router.replace("../auth/login");
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  const renderDiaDiem = ({ item }: any) => (
    <View style={styles.itemWrapper}>
      <View style={styles.item}>
        <Text style={styles.ten}>{item.ten}</Text>
        <Text style={styles.viTri}>{item.viTri}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(nguoiDung._id, 'DiaDiem', item._id)}
//        onPress={() => handleDelete(nguoiDung._id, 'DiaDiem', item._id)}
        >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
    
    
  );
  return (
    <View style={styles.container}>
  {/* Phần cố định (nút back, tiêu đề, header, avatar, nút...) */}
  <View style={styles.fixedHeader}>
    {/* Nút quay lại và tiêu đề */}
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
        <FontAwesome name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Trang cá nhân</Text>
    </View>

    {/* Header info */}
    <View style={styles.topHeader}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.push({ pathname: "/auth/trangcanhan", params: { id: nguoiDung?._id } })}>
          <Image
            source={nguoiDung?.anhDaiDien ? { uri: nguoiDung.anhDaiDien } : require("../../assets/images/logo.jpg")}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
              router.push({
                pathname: "../screen/thongtincanhan",
                params: { id: nguoiDung?._id }
              })
            }
          >
            <Text style={styles.profileButtonText}>Xem thông tin cá nhân</Text>
          </TouchableOpacity>

          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => router.push("../screen/thongbao")}>
              <Ionicons name="notifications-outline" size={22} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity onPress={logout}>
              <FontAwesome name="sign-out" size={22} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </View>

  {/* Phần cuộn */}
  <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "600", fontSize: 16 }}>Nội dung đã lưu</Text>
    </View>

    <View style={styles.tabs}>
      {TAB_OPTIONS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selectedTab === tab && styles.tabSelected]}
          onPress={() => setSelectedTab(tab)}
        >
          <Text style={selectedTab === tab ? styles.tabTextSelected : styles.tabText}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.content}>
    {selectedTab === "Địa điểm" ? (
    loading ? (
      <Text>Đang tải...</Text>
    ) : diaDiemData.length > 0 ? (
      diaDiemData.map((item) => (
        <View key={item._id}>
          {renderDiaDiem({ item })}
        </View>
      ))
    ) : (
      <Text>Chưa có {selectedTab} nào được lưu.</Text>
    )
  ) : (
    <Text>Chưa có {selectedTab} nào được lưu.</Text>
  )}

    </View>
  </ScrollView>
</View>


  );
};

export default TrangCaNhan;
