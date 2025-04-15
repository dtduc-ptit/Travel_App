import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,  // tạo shadow cho header
  },
  headerLeft: {
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ddd",
  },
  headerCenter: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    width: "80%",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    width: "48%",
  },
  itemImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  itemTitle: {
    marginTop: 4,
    fontSize: 14,
    textAlign: "center",
  },
});

export default styles;
