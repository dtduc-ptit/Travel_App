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
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  verticalLine: {
    position: "absolute",
    top: 32,
    left: 25,
    width: 2,
    height: 50,
    backgroundColor: "#ccc",
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
});

export default styles;
