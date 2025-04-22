// Thêm các style mới
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff", 
    },
    backButton: {
        position: "absolute",
        top: Platform.OS === 'ios' ? 44 : 24, // Điều chỉnh theo notch
        left: 15,
        zIndex: 10,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 20,
        padding: 6,
        marginTop: 12,
        marginLeft: -4, // Thêm khoảng cách cho Android
      },
    
   savedHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: 15,
     borderBottomWidth: 1,
     borderBottomColor: '#eee',
   },
   savedHeaderTitle: {
      marginLeft: 20,
     fontSize: 20,
     fontWeight: '600',
     color: '#333',
   },
   savedItemContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: 15,
     backgroundColor: '#fff',
     marginVertical: 5,
     borderRadius: 12,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 2,
   },
   savedItemImage: {
     width: 70,
     height: 70,
     borderRadius: 8,
     marginRight: 15,
   },
   savedItemTitle: {
     flex: 1,
     fontSize: 16,
     color: '#333',
     fontWeight: '500',
   },
   emptyContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     padding: 50,
   },
   emptyText: {
     marginTop: 20,
     fontSize: 16,
     color: '#666',
     textAlign: 'center',
   },
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    savedContentContainer: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: 20,
      backgroundColor: '#f8f9fa', // Màu nền nhẹ
      flexGrow: 1, // Đảm bảo scroll view hoạt động đúng
    },
    savedItemDate: {
      fontSize: 12,
      color: "#666",
      marginTop: 4,
    }
   // ... Thêm các style khác nếu cần
 });

 export default styles;