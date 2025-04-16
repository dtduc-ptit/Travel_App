import { StyleSheet } from "react-native";

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   routeInfo: {
//     position: 'absolute',
//     bottom: 10,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
  
//   routeText: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     elevation: 2, // Android shadow
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   inputContainer: {
//     position: 'absolute',
//     top: 60,
//     left: 16,
//     right: 16,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     elevation: 8, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//     zIndex: 999,
//     flexDirection: 'column',
//     gap: 12, // nếu dùng React Native mới
//   },
  
//   icon: {
//     marginRight: 10,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 4,
//   },
//   inputBox: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     marginHorizontal: 16,
//     marginTop: 20,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   iconCircle: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     borderWidth: 2,
//     borderColor: "#333",
//     marginRight: 12,
//   },
//   iconPin: {
//     width: 12,
//     height: 12,
//     borderRadius: 2,
//     backgroundColor: "#333",
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     paddingVertical: 4,
//     fontSize: 16,
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
// });


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  routeInfo: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 10, // Increased elevation for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.3, // Increased shadow opacity
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, // Increased shadow radius
    zIndex: 999,
    flexDirection: 'column',
    gap: 12, // nếu dùng React Native mới
  },
  icon: {
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  iconCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#333",
    marginRight: 12,
  },
  iconPin: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: "#333",
    marginRight: 12,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 4,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});

export default styles;