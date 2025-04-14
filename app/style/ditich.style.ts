import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  // Header top: logo - title - bell
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    backgroundColor: '#ccc',
  },
  

  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  headerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#444",
  },

  highlight: {
    color: "#007bff",
  },

  subTitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#333",
    fontSize: 16,
  },

  // Section title
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    marginTop: 4,
  },

  sectionWrapper: {
    marginBottom: 16,
  },

  // Filters (if used)
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },

  filterButtonActive: {
    backgroundColor: "#007bff",
  },

  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  filterTextActive: {
    color: "white",
  },

  // Item hiển thị địa điểm
  featuredItem: {
    width: 200,
    height: 135,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
    justifyContent: "flex-end",
  },

  placeImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  placeText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default styles;
