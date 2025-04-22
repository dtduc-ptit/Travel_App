import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  econtainer: {
    marginTop: 10,
    marginBottom: -10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },

  duLichText: {
    color: "#555",
    fontWeight: "900",
  },

  haTinhText: {
    color: "#007bff",
    fontWeight: "900",
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconButton: {
    marginLeft: 12,
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
    width: screenWidth / 2 - 20,
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
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    minHeight: 250,
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  postContainer: {
    borderColor: "#ddd",
    borderRadius: 28,
  },

  postHeader: {
    flexDirection: "row",
    marginLeft: 10,
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 4,
    borderWidth: 2,
    borderColor: "#d3d3d3",
  },

  placeholderText: {
    color: "#aaa",
    fontSize: 14,
  },

  mediaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },

  mediaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
  },

  mediaText: {
    color: "#007bff",
    fontSize: 14,
  },

  userInfo: {
    flexDirection: "column",
    marginLeft: 10,
  },

  userName: {
    fontWeight: "600",
    fontSize: 16,
  },

  postTime: {
    fontSize: 12,
    color: "#aaa",
  },

  postContent: {
    marginLeft: 10,
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    textAlign: "justify",
    fontWeight: "500",
  },

  postContentCover: {
    width: "90%",
  },

  postImage: {
    marginTop: 4, // Khoảng cách gần với nội dung
    width: "100%", // Chiều rộng bằng màn hình
    resizeMode: "contain", // Giữ nguyên chất lượng và tỉ lệ
  },

  imageJustify: {
    alignItems: "center",
    flexDirection: "row",
  },

  postActions: {
    flexDirection: "row",
    marginTop: 4, // Khoảng cách gần với hình ảnh
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
  },

  itemCenter: {
    alignItems: "center",
    marginTop: 4,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },

  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#555",
  },

  commentContainer: {
    flexDirection: "row",
    padding: 4,
  },

  cmtContainer: {
    flexDirection: "column",
    marginBottom: 16,
    marginLeft:16,
  },

  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  commentContent: {
    flex: 1,
  },

  commentUserName: {
    fontWeight: "bold",
  },

  commentText: {
    fontSize: 14,
    marginTop: 5,
  },

  commentTime: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
  },

  repButton: {
    marginLeft: 5,
  },

  repButtontext: {
    marginLeft: 5,
    fontSize: 10,
    color: "#888",
    marginTop: 5,
    fontWeight: "700",
  },

  cmtTime: {
    flexDirection: "row",
  },

  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  commentInputAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },

  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginRight: 10,
  },

  sendButton: {
    padding: 10,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  postHeaderWithBorder: {
    borderColor: "#ddd",
    paddingBottom: 12,
  },

  createPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft:6,
  },

  imageIcon: {
    marginRight: 10,
  },

  separator: {
    height: 4,
    backgroundColor: "#ccc",
    marginVertical: 10,
    width: "100%",
  },
  shareModalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  shareLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: '100%',
  },
  shareLink: {
    flex: 1,
    fontSize: 14,
    color: '#007bff',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  copyButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#007bff',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  shareButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#888',
  },
});