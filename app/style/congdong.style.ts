import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    justifyContent: 'space-between',  // Căn đều giữa chữ và các icon
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  highlight: {
    color: '#0058ff',
  },
  iconsContainer: {
    flexDirection: 'row',  // Đặt các icon theo hàng ngang
    justifyContent: 'space-between',  // Cách đều các icon
    width: 120,  // Đảm bảo đủ không gian cho 3 icon
  },
  icon: {
    marginHorizontal: 5,  // Khoảng cách giữa các icon
  },
  postSection: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 15,
    marginBottom: 0,
  },
  postPlaceholder: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Căn đều hai bên
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',  // Đặt icon và text cạnh nhau
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionText: {
    fontSize: 14,
    marginLeft: 5,  // Khoảng cách giữa icon và chữ
    color: 'black', // Chữ vẫn là màu đen
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  content: {
    fontSize: 16,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,  // Thêm khoảng cách giữa các icon
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: 'gray',
  },

  // New styles for modal and input fields
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background for modal
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;
