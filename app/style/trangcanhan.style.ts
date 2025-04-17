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

  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
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
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  item: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  
  textWrapper: {
    flexShrink: 1,
  },
  
  ten: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  
  viTri: {
    fontSize: 14,
    color: '#555',
  },
  
  moTa: {
    fontSize: 13,
    color: '#999',
  },
  
  deleteButton: {
    backgroundColor: '#F44336',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  
});

export default styles;
