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
    marginBottom: 20,  // Add margin to separate buttons
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
},);
