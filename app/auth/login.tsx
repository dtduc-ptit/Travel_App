import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import styles from "../style/login.style";
import { API_BASE_URL } from "../../constants/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveUserId = async (idNguoiDung: string) => {
  try {
    await AsyncStorage.setItem('idNguoiDung', idNguoiDung);
  } catch (error) {
    console.error('Lỗi khi lưu ID người dùng:', error);
  }
};

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [taiKhoan, setTaiKhoan] = useState('');
  const [matKhau, setMatKhau] = useState('');

  const handleLogin = async () => {
    if (!taiKhoan.trim() && !matKhau.trim()) {
      Alert.alert('⚠️ Vui lòng nhập tài khoản và mật khẩu');
      return;
    }
    if (!taiKhoan.trim()) {
      Alert.alert('⚠️ Vui lòng nhập tài khoản');
      return;
    }
    if (!matKhau.trim()) {
      Alert.alert('⚠️ Vui lòng nhập mật khẩu');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/nguoidung/login`, {
        taiKhoan,
        matKhau,
      });

      Alert.alert('✅ Đăng nhập thành công');

      const idNguoiDung = res.data.idNguoiDung; // ✅ Đã trả về từ backend
      await saveUserId(idNguoiDung);

      router.replace('/(tabs)/ditich');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Sai tài khoản hoặc mật khẩu';
      Alert.alert('❌ Đăng nhập thất bại', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      {/* Tài khoản Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập tài khoản của bạn"
          value={taiKhoan}
          onChangeText={setTaiKhoan}
          autoCapitalize="none"
        />
      </View>

      {/* Mật khẩu Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu của bạn"
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

      {/* Links */}
      <View style={styles.links}>
        <Text style={styles.text}>
          Bạn chưa có tài khoản?{" "}
          <Text style={styles.link} onPress={() => router.push("/auth/register")}>Đăng ký</Text>
        </Text>
        <Text style={[styles.link, styles.forgot]} onPress={() => router.push("/auth/forgot-password")}>
          Quên mật khẩu?
        </Text>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}
