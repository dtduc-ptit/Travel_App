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
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2e86de', 
    padding: 10,
    borderRadius: 8,
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
    zIndex: 1000,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  optionButtonSmall: {
    backgroundColor: '#2e86de',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollableContent: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", 
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 8,
  },
  videoButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  videoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  allVideosButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  allVideosButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
