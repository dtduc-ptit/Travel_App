import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import styles from "../style/login.style";

export default function LoginScreen() {
  const router = useRouter();

  const [taiKhoan, setTaiKhoan] = useState('');
  const [matKhau, setMatKhau] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://192.168.0.102:8000/api/nguoidung/login', {
        taiKhoan,
        matKhau,
      });
      Alert.alert('✅ Đăng nhập thành công');
      router.replace('/(tabs)/ditich'); // hoặc màn hình chính sau đăng nhập
    } catch (error) {
      Alert.alert('❌ Sai tài khoản hoặc mật khẩu');
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
          secureTextEntry
          value={matKhau}
          onChangeText={setMatKhau}
        />
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
