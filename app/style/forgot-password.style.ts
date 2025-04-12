

import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
      backgroundColor: "#fff",
    },
    backButton: {
      position: "absolute",
      top: 50,
      left: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
    },
    button: {
      backgroundColor: "#007bff",
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  export default styles;