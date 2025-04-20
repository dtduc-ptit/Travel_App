
import { StyleSheet } from "react-native";

const stylesBinhLuan = StyleSheet.create({
  closeBtn: {
    alignSelf: 'flex-end',
  },
    sheetContainer: {
      padding: 16,
      flex: 1,
      backgroundColor: 'white',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    commentList: {
      maxHeight: 250, // Chỉ phần bình luận được cuộn
      marginBottom: 12,
    },
    commentItem: {
      flexDirection: 'row',
      marginBottom: 12,
      alignItems: 'flex-start',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    commentContent: {
      flex: 1,
    },
    userName: {
      fontWeight: 'bold',
      marginBottom: 2,
    },
    commentText: {
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
      maxHeight: 100,
      backgroundColor: '#f9f9f9',
    },
    submitButton: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  

  export default stylesBinhLuan;