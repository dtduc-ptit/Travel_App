import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import styles from '../style/forgot-password.style';  // Đảm bảo style này đã được cập nhật
import { API_BASE_URL } from "../../constants/config";
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  const handleForgotPassword = async () => {
    try {
      // Giả sử gửi email để lấy lại mật khẩu
      await axios.post(`${API_BASE_URL}/api/nguoidung/forgot-password`, { email });
      Alert.alert('✅ Thông tin lấy lại mật khẩu đã được gửi');
      router.push('/auth/login');
    } catch (err) {
      Alert.alert('❌ Lỗi trong việc gửi email, thử lại!');
    }
  };

  return (
    <LinearGradient colors={['#f9fafb', '#e0f2fe']} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container}>

          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>Quên mật khẩu</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Gửi yêu cầu</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.links}>
            <Text style={styles.text}>
              Đã nhớ mật khẩu?{" "}
              <Text style={styles.link} onPress={() => router.push("/auth/login")}>Đăng nhập</Text>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
