import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  savedHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 16,
    color: '#263238',
  },
  savedContentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  savedItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  firstItem: {
    marginTop: 4,
  },
  savedItemImage: {
    flex: 1,
    aspectRatio:16/9,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  savedItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#546E7A',
  },
  nguoiDungText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
    lineHeight: 22,
    marginBottom: 6,
  },
  thoiGianLuu: {
    fontSize: 12,
    color: '#78909C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#546E7A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#546E7A',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default styles;