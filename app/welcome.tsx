import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/welcome-bg1.jpg")} 
      style={styles.background}
    >
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.overlay} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Chào mừng bạn đến với{"\n"}vùng đất Hà Tĩnh</Text>
        <Text style={styles.subtitle}>Chúng tôi rất vui và vinh hạnh khi được phục vụ quý bạn</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#eee",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
