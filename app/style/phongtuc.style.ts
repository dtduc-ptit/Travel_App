import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222",
  },

  highlight: {
    color: "#007bff",
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
    marginHorizontal: 16,
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

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 16,
  },

  sectionWrapper: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
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

  featuredItem: {
    width: 200,
    height: 135,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
    justifyContent: "flex-end",
  },

  placeContainer: {
    width: 140,
    height: 190,
    marginRight: 12,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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

