import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginBottom: 16, 
    marginTop: 8,     
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888",
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  routeButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  routeText: {
    color: "#fff",
    fontWeight: "600",
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  timelineContainer: {
    paddingVertical: 10,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  leftColumn: {
    width: 60,
    alignItems: "center",
    position: "relative",
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 4,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  emptyNoticeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  emptyNoticeText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  
  actionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222",
  },
  timePeriodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginTop: 12,
    marginBottom: 6,
  },
  timeWrapper: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007bff",
  },
  
  cardItem: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007bff",
    marginBottom: 4,
  },
  
  verticalLine: {
    position: "absolute",
    top: 24,
    width: 2,
    height: "100%",
    backgroundColor: "#ccc",
  },
  fixedHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 5,
  },
  
  scrollSection: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 12,
  },  
   
});

export default styles;
