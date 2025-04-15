import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginBottom: 12,
  },
  thumbnailList: {
    marginBottom: 12,
  },
  infoContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  location: {
    marginLeft: 6,
    color: "#666",
  },
  views: {
    marginLeft: 6,
    color: "#666",
  },
  subTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
    color: "#444",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  mainImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  videoContainer: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
    borderRadius: 12,
  },
  moreOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
  },
  thumbnailWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 6,
    backgroundColor: "#eee",
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  moreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  videoIconOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    padding: 4,
  },
  videoButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-end', // Change from 'center' to 'flex-end'
    marginBottom: 12,
    marginTop: 20, // Added marginTop to create space
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thumbnailListContainer: {
    marginTop: 20, // Added marginTop to create space
    flexDirection: 'row',
    justifyContent: 'center',
  },
  prevButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 20,
  },
  nextButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 20,
  },
  videoNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  navButton: {
    padding: 10,
  },
  videoIndicator: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  time: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  
});
