import React, { useEffect, useState ,useCallback} from "react";
import { useFocusEffect } from "@react-navigation/native"; 
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


const TAB_OPTIONS = ['Phong Tục', 'Di Tích', 'Sự Kiện'];

const TrangCaNhan = () => {
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const [soThongBaoChuaDoc, setSoThongBaoChuaDoc] = useState<number>(0);

  const [selectedTab, setSelectedTab] = useState('Di Tích');
  interface DiTich {
    _id: string;
    ten: string;
    viTri: string;
    imageUrl: string;
  }
  interface Phongtuc {
    _id: string;
    ten: string;
    viTri: string;
    imageUrl: string;
  }
  interface SuKien {
    _id: string;
    ten: string;
    viTri: string;
    imageUrl: string;
  }

  const [diTichData, setDiTichData] = useState<DiTich[]>([]);
  const [phongTucData, setPhongTucData] = useState<Phongtuc[]>([]);
  const [suKienData, setSuKienData] = useState<SuKien[]>([]);
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
  
      if (loaiNoiDung === 'DiTich') {
        setDiTichData((prev) => prev.filter(item => item._id !== idNoiDung));
      } else if (loaiNoiDung === 'PhongTuc') {
        setPhongTucData((prev) => prev.filter(item => item._id !== idNoiDung));
      } else if (loaiNoiDung === 'SuKien') {
        setSuKienData((prev) => prev.filter(item => item._id !== idNoiDung));
      }
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
  
  
  const fetchDiTich = async () => {
    try {
      setLoading(true);
      const idNguoiDung = await AsyncStorage.getItem('idNguoiDung');
      if (!idNguoiDung) return;

      const res = await axios.get(`${API_BASE_URL}/api/noidungluutru/ditich`, {
        params: { nguoiDung: idNguoiDung },
      });

      setDiTichData(res.data.diTichs);
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu di tích:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPhongTuc = async () => {
    try {
      setLoading(true);
      const idNguoiDung = await AsyncStorage.getItem('idNguoiDung');
      if (!idNguoiDung) return;

      const res = await axios.get(`${API_BASE_URL}/api/noidungluutru/phongtuc`, {
        params: { nguoiDung: idNguoiDung },
      });

      setPhongTucData(res.data.phongTucs);
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu di tích:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSuKien = async () => {
    try {
      setLoading(true);
      const idNguoiDung = await AsyncStorage.getItem('idNguoiDung');
      if (!idNguoiDung) return;

      const res = await axios.get(`${API_BASE_URL}/api/noidungluutru/sukien`, {
        params: { nguoiDung: idNguoiDung },
      });

      setSuKienData(res.data.suKiens);
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu sự kiện:', error);
    } finally {
      setLoading(false);
    }
  };

// Lấy thông tin người dùng mỗi khi màn hình focus
  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  
  useEffect(() => {
    if (selectedTab === 'Di Tích') {
      fetchDiTich();
    }
    else if (selectedTab === 'Phong Tục') {
      fetchPhongTuc();
    }    else if (selectedTab === 'Sự Kiện') {
      fetchSuKien();
    }

  
    const fetchSoThongBaoChuaDoc = async () => {
      if (!nguoiDung?._id) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/thongbao/chuadoc/${nguoiDung._id}`);
        setSoThongBaoChuaDoc(res.data.soLuongChuaDoc || 0);
      } catch (error) {
        console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
      }
    };
  
    fetchSoThongBaoChuaDoc();
  }, [selectedTab, nguoiDung?._id]); // chỉ phụ thuộc id người dùng thôi
  

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("idNguoiDung");
      router.replace("../auth/login");
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  const renderDiTich = ({ item }: any) => (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push({ pathname: "/screen/ditichchitiet", params: { id: item._id } })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        
        <View style={styles.textWrapper}>
          <Text style={styles.ten}>{item.ten}</Text>
          <Text style={styles.viTri}>{item.viTri}</Text>
          {item.moTa ? <Text style={styles.moTa}>{item.moTa}</Text> : null}
        </View>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(nguoiDung._id, 'DiTich', item._id)}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderPhongTuc = ({ item }: any) => (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push({ pathname: "/screen/phongtucchitiet", params: { id: item._id } })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        
        <View style={styles.textWrapper}>
          <Text style={styles.ten}>{item.ten}</Text>
          <Text style={styles.viTri}>{item.viTri}</Text>
          {item.moTa ? <Text style={styles.moTa}>{item.moTa}</Text> : null}
        </View>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(nguoiDung._id, 'PhongTuc', item._id)}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
  const renderSuKien = ({ item }: any) => (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push({ pathname: "/screen/sukienchitiet", params: { id: item._id } })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        
        <View style={styles.textWrapper}>
          <Text style={styles.ten}>{item.ten}</Text>
          <Text style={styles.viTri}>{item.viTri}</Text>
          {item.moTa ? <Text style={styles.moTa}>{item.moTa}</Text> : null}
        </View>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(nguoiDung._id, 'SuKien', item._id)}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Phần cố định */}
      <View style={styles.fixedHeader}>
        {/* Nút back và tiêu đề */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
            <FontAwesome name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Trang cá nhân</Text>
        </View>

        {/* Header info */}
        <View style={styles.topHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={nguoiDung?.anhDaiDien ? { uri: nguoiDung.anhDaiDien } : require("../../assets/images/logo.jpg")}
                style={styles.avatar}
              />
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
                  <Ionicons name="notifications-outline" size={24} color="#333" />
                  {soThongBaoChuaDoc > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {soThongBaoChuaDoc > 99 ? '99+' : soThongBaoChuaDoc}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
  
                <TouchableOpacity onPress={logout}>
                  <FontAwesome name="sign-out" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Thêm nút Xem Bản Đồ Văn Hóa */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#007bff",
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            marginBottom: 12,
          }}
          onPress={() => router.push("/screen/bandovanhoa")}
          >
          <Ionicons name="map-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
            Xem Bản Đồ Văn Hóa
          </Text>
          </TouchableOpacity>
  
        {/* Tabs */}
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
      </View>
  
      {/* Phần cuộn chỉ FlatList */}
      <View style={styles.scrollArea}>
      {selectedTab === "Di Tích" ? (
        loading ? (
          <Text>Đang tải...</Text>
        ) : diTichData.length > 0 ? (
          <FlatList
            data={diTichData}
            keyExtractor={(item) => item._id}
            renderItem={renderDiTich}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={{ paddingHorizontal: 16 }}>Chưa có {selectedTab} nào được lưu.</Text>
        )
      ) : selectedTab === "Phong Tục" ? (
        loading ? (
          <Text>Đang tải...</Text>
        ) : phongTucData.length > 0 ? (
          <FlatList
            data={phongTucData}
            keyExtractor={(item) => item._id}
            renderItem={renderPhongTuc}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={{ paddingHorizontal: 16 }}>Chưa có {selectedTab} nào được lưu.</Text>
        )
      ) : selectedTab === "Sự Kiện" ? (
        loading ? (
          <Text>Đang tải...</Text>
        ) : suKienData.length > 0 ? (
          <FlatList
            data={suKienData}
            keyExtractor={(item) => item._id}
            renderItem={renderSuKien}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={{ paddingHorizontal: 16 }}>Chưa có {selectedTab} nào được lưu.</Text>
        )
      ) :null}
    </View>

    </View>
  );
  
};

export default TrangCaNhan;