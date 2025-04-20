import { StyleSheet } from "react-native";

export default StyleSheet.create({
    searchBox: {
      position: "absolute",
      top: 20,
      left: 10,
      right: 10,
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
      elevation: 3,
    },
    input: {
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 8,
      fontSize: 16,
    },
    button: {
      backgroundColor: "#2e86de",
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    infoBox: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: 10,
      padding: 10,
      alignItems: "center",
    },
    infoText: {
      fontSize: 16,
      fontWeight: "500",
    },
    
    infoTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },

    infoSub: {
      fontSize: 13,
      fontStyle: "italic",
      marginBottom: 6,
      color: "#666",
    },
    
  });
  