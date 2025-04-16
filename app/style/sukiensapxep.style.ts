import { StyleSheet, Platform, StatusBar } from "react-native";


const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 18,
        fontWeight: "600",
        backgroundColor: "#f7f7f7",
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: "#444",
      },
    item: {
        height: 120, // Giảm từ 160 xuống
        marginHorizontal: 16,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: 16,
    },
    time: {
      color: "white",
      fontSize: 14,
      marginBottom: 6,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: "#333",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
    mainTitle: {
        fontSize: 25,
        fontWeight: "bold",
        marginLeft: 12,
        marginTop:10,
        marginBottom:10,
        color: "#333",
      },
    headerTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    highlight: {
      color: "#007AFF",
    },
    eventTitle: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    
  });
  
  export default styles;
