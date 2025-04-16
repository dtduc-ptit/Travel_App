import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  postContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
  },
  input: {
    height: 150,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 20,
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
   fontSize: 20,
   fontWeight: 'bold',
   marginLeft: 10,
 },
 avatarContainer: {
   flexDirection: 'row', // Align avatar and username horizontally
   alignItems: 'center', // Vertically align them in the center
   marginBottom: 16, // Space between avatar and other components
 },
 userName: {
   fontSize: 16,
   fontWeight: 'bold',
   color: '#333',
 },
 
});
