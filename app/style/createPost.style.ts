import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 16,
  },
  postContainer: {
    marginTop: 20,
    // padding: 16,
    borderRadius: 8,
  },
  input: {
    height: 150,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    marginLeft: 10,
    
  }, 

  button: {
    position: 'absolute',  // Đặt nút ở vị trí tuyệt đối
    right: 2,  // Đặt ở bên phải
    top: 2,  // Có thể điều chỉnh khoảng cách từ trên xuống
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginRight: 10, // Khoảng cách từ bên phải
    fontWeight: '600',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems:'flex-start',
    padding: 10,
    position: 'relative',  // Đảm bảo rằng các phần tử con có thể được định vị
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    textAlign: 'center',  // Đảm bảo tiêu đề ở giữa
  },
 avatarContainer: {
   flexDirection: 'row', // Align avatar and username horizontally
   alignItems: 'center', // Vertically align them in the center
   marginBottom: 16,
   marginLeft:16, // Space between avatar and other components
 },
 userName: {
   fontSize: 16,
   fontWeight: 'bold',
   color: '#333',
 },
 background: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
},
overlay: {
  position: "absolute",
  width: "100%",
  height: "100%",
  flex: 1, // Added flex: 1
},
content: {
  position: "absolute",
  bottom: 80,
  alignItems: "center",
  width: "80%",
},
title: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#fff",
  textAlign: "center",
},
subtitle: {
  fontSize: 14,
  color: "#eee",
  textAlign: "center",
  marginVertical: 10,
},
selectedImage: {
  width: '100%',
  height: 200,
  marginTop: 16,
  borderRadius: 8,
},
separator: {
  height: 0.5,                // Độ dày của gạch ngang
  backgroundColor: '#ccc',  // Màu sắc của gạch ngang
  marginVertical: 10,
  width:"100%",  
},
imgContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 16,
},
img: {
  marginRight: 10,
  color:"#007bff",
},

previewContainer: {
  position: 'relative',
  marginTop: 15,
  borderRadius: 10,
  overflow: 'hidden',
},
previewImage: {
  width: '100%',
  height: 200,
},
removeImageButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(255,255,255,0.7)',
  borderRadius: 15,
  padding: 5,
},
imageActions: {
  position: 'relative', // Cho phép định vị tuyệt đối cho nút xóa
  marginVertical: 10,
},

deleteButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
deleteButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
},

}
);
