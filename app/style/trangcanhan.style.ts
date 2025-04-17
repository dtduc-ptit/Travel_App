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
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  tabSelected: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#333',
  },
  tabTextSelected: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  item: {
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
  },
  ten: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viTri: {
    fontSize: 14,
    color: '#666',
  },
  fixedHeader: {
    paddingTop: 40, // nếu có notch
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  
  scrollArea: {
    flex: 1,
  },

  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  
  deleteButton: {
    backgroundColor: '#FF4D4F',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  
});

export default styles;
