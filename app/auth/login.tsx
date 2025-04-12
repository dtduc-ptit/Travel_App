import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from '../style/login.style';


export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Nhập địa chỉ Email của bạn" keyboardType="email-address" />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Nhập mật khẩu của bạn" secureTextEntry />
      </View>

      {/* Links */}
      <View style={styles.links}>
        <Text style={styles.text}>Bạn chưa có tài khoản?{" "}
          <Text style={styles.link} onPress={() => router.push("/auth/register")}>Đăng ký</Text>
        </Text>
        <Text style={[styles.link, styles.forgot]} onPress={() => router.push("/auth/forgot-password")}>
          Quên mật khẩu?
        </Text>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => router.push("/(tabs)/ditich")}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

