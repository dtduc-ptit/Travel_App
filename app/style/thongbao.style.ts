import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  thongBaoItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unread: {
    backgroundColor: '#E6F0FA', // Màu nền nhạt cho thông báo chưa đọc
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  thongBaoContent: {
    flex: 1,
  },
  noiDung: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    color: '#007bff',
  },
  thoiGian: {
    fontSize: 12,
    color: '#888',
  },
  postImage: {
    width: '100%',
    marginTop: 8,
    borderRadius: 8,
    resizeMode: 'contain',
  },
});