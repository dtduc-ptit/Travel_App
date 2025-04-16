import { StyleSheet, Platform, StatusBar } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 50,
    paddingHorizontal: 16,
  },
  iconWrapper: {
    padding: 4,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#5736f5",
    marginRight: 8,
  },
  
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  
  profileButton: {
    backgroundColor: "#5736f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12, 
  },
  
  profileButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingRight: 0
  },
  
});

export default styles;
