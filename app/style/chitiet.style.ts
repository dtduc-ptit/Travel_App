import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: screenWidth / 2 - 20, // khoảng 50% trừ padding
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    width: screenWidth / 2 - 20,
    fontSize: 18,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 40,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)", // Lớp phủ mờ
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Đảm bảo Modal hiển thị lên trên
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    minHeight: 250, // Đảm bảo chiều cao cho WebView
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
