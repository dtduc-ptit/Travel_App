import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    flex: 1,
  },
  kienThucItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  kienThucImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  kienThucTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  kienThucList: {
    marginTop: 20,
  },
});

export default styles;
