import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from '../style/register.style'; // 👈 Import file style riêng

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng kí</Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="gray" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Tên của bạn" />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Địa chỉ Email" keyboardType="email-address" />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Nhập lại mật khẩu" secureTextEntry />
      </View>

      {/* Login Link */}
      <View style={styles.links}>
        <Text style={styles.text}>Bạn đã có tài khoản?{" "}
          <Text style={styles.link} onPress={() => router.push("/auth/login")}>Đăng nhập</Text>
        </Text>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Tạo</Text>
      </TouchableOpacity>
    </View>
  );
}
