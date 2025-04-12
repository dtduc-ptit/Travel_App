import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from '../style/forgot-password.style'; 


export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Quên mật khẩu</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ Email"
          keyboardType="email-address"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/login")}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
}

