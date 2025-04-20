import { Platform, StatusBar, StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const videoHeight = (screenWidth * 9) / 16; // Tỉ lệ 16:9
const statusBarHeight = Platform.select({
  android: StatusBar.currentHeight || 24, // Fallback 24px nếu không lấy được
});

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", 
  },

  // Header - Đã sửa vị trí nút back
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 44 : 24, // Điều chỉnh theo notch
    left: 15,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 6,
    marginTop: 12,
    marginLeft: -4, // Thêm khoảng cách cho Android
  },

  // Phần thumbnail và tiêu đề - Chỉnh layout 50/50
  topRow: {
    flexDirection: "row",
    padding: 15,
    marginTop: Platform.OS === 'android' ? 16 : 9,
    alignItems: "center",
  },
  image: {
    width: screenWidth * 0.5 - 30, // Chiếm 50% chiều rộng trừ padding
    aspectRatio: 16 / 9, // Đảm bảo ảnh vuông
    borderRadius: 10,
    marginRight: 15,
  },
  title: {
    width: screenWidth * 0.5 - 16, // Cùng kích thước với ảnh
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingLeft: 4,
    textAlign: "center",
  },

  // Nhóm nút chức năng
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },

  // Nội dung chính
  content: {
    padding: 15,
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    textAlign: "justify",
  },

  /*** Các class mới thêm cho video modal ***/
  modal: {
    margin: 0,
    padding: 0,
    justifyContent: "center",
  },
  videoContainer: {
    width: screenWidth,
    height: videoHeight,
    backgroundColor: "#000",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 5,
  },

  // Trạng thái loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  // Xử lý lỗi
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8d7da",
    borderRadius: 10,
    margin: 20,
  },
  linkText: {
    color: "#0d6efd",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
