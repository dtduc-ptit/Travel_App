import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import styles from '../style/register.style'; // style từ file 1
import { API_BASE_URL } from "../../components/config/config";
export default function RegisterScreen() {
  const router = useRouter();

  const [ten, setTen] = useState('');
  const [taiKhoan, setTaiKhoan] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [email, setEmail] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');

  const handleRegister = async () => {
    if (matKhau !== xacNhanMatKhau) {
      Alert.alert('❌ Mật khẩu không khớp');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/nguoidung/register`, {
        ten,
        taiKhoan,
        matKhau,
        email,
      });
      Alert.alert('✅ Đăng ký thành công');
      router.replace('/auth/login');
    } catch (err: any) {
      console.error('❌ Lỗi:', err.response?.data || err.message);
    
      const errorData = err.response?.data;
    
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).join('\n');
        Alert.alert('❌ Đăng ký thất bại', errorMessages);
      } else {
        Alert.alert('❌ Đăng ký thất bại', errorData?.message || 'Lỗi không xác định');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng kí</Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tên của bạn"
          value={ten}
          onChangeText={setTen}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Tài khoản Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="at-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tài khoản"
          value={taiKhoan}
          onChangeText={setTaiKhoan}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={matKhau}
          onChangeText={setMatKhau}
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          value={xacNhanMatKhau}
          onChangeText={setXacNhanMatKhau}
        />
      </View>

      {/* Login Link */}
      <View style={styles.links}>
        <Text style={styles.text}>
          Bạn đã có tài khoản?{" "}
          <Text style={styles.link} onPress={() => router.push("/auth/login")}>Đăng nhập</Text>
        </Text>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Tạo</Text>
      </TouchableOpacity>
    </View>
  );
}
