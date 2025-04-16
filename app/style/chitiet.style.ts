import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: screenWidth / 2 - 20,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 40,
  },

  // Audio Player Overlay
  audioOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  audioBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  audioPlayer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  audioTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Video Modal and Overlay
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  videoContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 8,
  },
});
