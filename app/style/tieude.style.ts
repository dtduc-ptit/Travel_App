import { StyleSheet, Platform, StatusBar } from "react-native";

const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    backgroundColor: "#f9f9f9",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    paddingBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ddd",
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  highlight: {
    color: "#007AFF",
  },
  subTitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  iconWrapper: {
    padding: 6,
    position: "relative", // cần thiết để định vị dot
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 5,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    zIndex: 10,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5, // glow cho Android
  },
});

export default styles;
