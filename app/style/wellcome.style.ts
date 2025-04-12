import { StyleSheet } from "react-native";
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
  })

  export default styles;