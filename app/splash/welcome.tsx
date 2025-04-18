import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from '../style/wellcome.style';


export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/image.jpg")} 
      style={styles.background}
    >
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.overlay} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Chào mừng bạn đến với{"\n"}vùng đất Hà Tĩnh</Text>
        <Text style={styles.subtitle}>Chúng tôi rất vui và vinh hạnh khi được phục vụ quý bạn</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/login")}>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
;
