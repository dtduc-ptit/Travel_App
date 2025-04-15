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
});
