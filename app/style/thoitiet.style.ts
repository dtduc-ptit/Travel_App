import { StyleSheet, Platform, StatusBar } from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 5,
  },
  header: {
    marginTop: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highlight: {
    color: "#FFD700",
  },
  weatherContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  weatherTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  currentWeather: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  largeWeatherIcon: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  weatherDescription: {
    fontSize: 20,
    color: "#555",
    textTransform: "capitalize",
    marginVertical: 5,
  },
  weatherDetail: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  forecastContainer: {
    margin: 20,
  },
  forecastList: {
    paddingVertical: 10,
  },
  forecastItem: {
    alignItems: "center",
    marginRight: 15,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    width: 140,
  },
  forecastText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  forecastDescription: {
    fontSize: 14,
    color: "#555",
    textTransform: "capitalize",
    marginTop: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginVertical: 5,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default styles;
