import { StyleSheet } from "react-native";

export default StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
    marginTop: 35,
    left: 20,
    right: 20,
    position: "absolute",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e86de",
  },
  filterPanel: {
    position: "absolute",
    marginTop: 23,
    top: 92, 
    right: 20,
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 4000,
    borderTopRightRadius: 0,
  },
  filterConnector: {
    position: "absolute",
    top: -8,
    right: 8,
    width: 24,
    height: 8,
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    zIndex: 4001,
  },
  filterSummary: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f0f4f8",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  filterSummaryText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  filterSummaryValue: {
    color: "#2e86de",
    fontWeight: "600",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
    height: 44,
    paddingHorizontal: 12,
  },
  pickerText: {
    fontSize: 14,
    color: "#374151",
  },
  dropdown: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    marginTop: 2,
    maxHeight: 300, // Tăng từ 200 lên 300
  },
  buttonGroupFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12, // Tăng từ 8 lên 12
  },
  resetButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  loadingBox: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "600",
  },
  noDataWrapper: {
    position: "absolute",
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fee2e2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 8,
  },
  noDataText: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
  },
  infoBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1f2937",
  },
  infoText: {
    fontSize: 14,
    color: "#4b5563",
  },
  infoSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  suggestionWrapper: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  suggestionText: {
    fontSize: 14,
    color: "#2e86de",
    textDecorationLine: "underline",
  },
  showMoreBtn: {
    marginTop: 6,
    alignItems: "center",
  },
  showMoreText: {
    fontSize: 13,
    color: "#6b7280",
    fontStyle: "italic",
  },
});