import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40, 
    paddingBottom: 40
  },
  backButton: {
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10, // cách nút back rõ ràng
    marginBottom: 20,
    textAlign: "center",
  },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
  },
  moTa: {
    padding: 12,
    fontSize: 14,
    color: "#333",
  },
  xemThem: {
    paddingHorizontal: 12,
    color: "#007bff",
    fontSize: 14,
    marginBottom: 8,
  },
  dateText: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    color: "#999",
    fontSize: 12,
  },
});
