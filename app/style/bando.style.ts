import { StyleSheet } from "react-native";

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
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
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
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  

  guideButton: {
    position: "absolute",
    bottom: 20,
    right: 90,
    backgroundColor: "#1E90FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  
  guideButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
  guidePanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%", // nửa màn hình
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 30,
    padding: 8,
  },
  
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  
  guideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  
  guideContent: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
  fabSave: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 30,
    elevation: 5,
    zIndex: 20,
  },
  fabText: {
    fontSize: 20,
    color: '#fff',
  },

  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  
  fabButtonLeft: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 16,
    elevation: 5,
  },
  
  fabButtonRight: {
    backgroundColor: '#2196F3',
    borderRadius: 30,
    padding: 16,
    elevation: 5,
  },
  mainFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  
  fabOptions: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 10,
  },
  
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  optionText: {
    color: 'white',
    fontSize: 14,
  },
  
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  popupBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  popupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  
  popupInput: {
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  saveBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  
  cancelBtn: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  overlayCloseArea: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  
  
    
  
});

export default styles;