import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import styles from "../style/login.style";
import { API_BASE_URL } from "../../constants/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";

const saveUserId = async (idNguoiDung: string) => {
  try {
    await AsyncStorage.setItem("idNguoiDung", idNguoiDung);
  } catch (error) {
    console.error("Lỗi khi lưu ID người dùng:", error);
  }
};

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");

  const handleLogin = async () => {
    if (!taiKhoan.trim() && !matKhau.trim()) {
      Alert.alert("⚠️ Vui lòng nhập tài khoản và mật khẩu");
      return;
    }
    if (!taiKhoan.trim()) {
      Alert.alert("⚠️ Vui lòng nhập tài khoản");
      return;
    }
    if (!matKhau.trim()) {
      Alert.alert("⚠️ Vui lòng nhập mật khẩu");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/nguoidung/login`, {
        taiKhoan,
        matKhau,
      });

      Alert.alert("✅ Đăng nhập thành công");
      const idNguoiDung = res.data.idNguoiDung;
      await saveUserId(idNguoiDung);

      router.replace("/(tabs)/ditich");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Sai tài khoản hoặc mật khẩu";
      Alert.alert("❌ Đăng nhập thất bại", message);
    }
  };

  return (
    <LinearGradient
      colors={["#e0f7fa", "#ffffff"]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Chào mừng bạn trở lại</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="gray"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Tài khoản"
          value={taiKhoan}
          onChangeText={setTaiKhoan}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="gray"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={matKhau}
          onChangeText={setMatKhau}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="gray"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.links}>
        <Text style={styles.text}>
          Chưa có tài khoản?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/auth/register")}
          >
            Đăng ký
          </Text>
        </Text>
        <Text
          style={[styles.link, styles.forgot]}
          onPress={() => router.push("/auth/forgot-password")}
        >
          Quên mật khẩu?
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
