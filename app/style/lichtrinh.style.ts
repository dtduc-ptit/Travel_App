import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  routeButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  routeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  calendarButton: {
    padding: 4,
  },
  timelineContainer: {
    marginBottom: 40,
  },
  timePeriodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 16,
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  leftColumn: {
    width: 60,
    alignItems: "center",
  },
  timeWrapper: {
    backgroundColor: "#e9ecef",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: "#007bff",
    borderRadius: 6,
    marginBottom: 8,
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#007bff",
  },
  cardItem: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyNoticeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyNoticeText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "90%",
  },
  calendarButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  calendarActionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  calendarActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});