import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  postItem: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  captionContainer: {
    padding: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  postDate: {
    fontSize: 14,
    color: '#888',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  queryText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});