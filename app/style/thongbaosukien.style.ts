import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 50,
  },
  notification: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#222",
  },
  content: {
    fontSize: 14,
    color: "#444",
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: "gray",
    textAlign: "right",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ddd",
    borderRadius: 20,
  },
  
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  
  filterText: {
    color: "#000",
    fontWeight: "500",
  },
  
  filterTextActive: {
    color: "#fff",
  },
  redDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    zIndex: 10,
  },
  
});

export default styles;
