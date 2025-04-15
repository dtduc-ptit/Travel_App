import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
});

export const autoCompleteStyles = (position: "top" | "below") => {
    const marginTop = position === "top" ? 60 : 120;

  return {
    container: {
      position: "absolute",
      top: marginTop,
      left: 15,
      right: 15,
      zIndex: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      borderRadius: 10,
      backgroundColor: "transparent",
    },
    textInputContainer: {
      borderRadius: 10,
      overflow: "hidden",
    },
    textInput: {
      height: 48,
      backgroundColor: "#fff",
      fontSize: 16,
      paddingHorizontal: 12,
      borderRadius: 10,
    },
    listView: {
      backgroundColor: "#fff",
      borderRadius: 10,
      marginTop: 2,
      elevation: 4,
      zIndex: 1000,
    },
    row: {
      padding: 13,
      height: 44,
      flexDirection: "row",
    },
    separator: {
      height: 0.5,
      backgroundColor: "#c8c7cc",
    },
    description: {
      fontSize: 14,
    },
    predefinedPlacesDescription: {
      color: "#1faadb",
    }
  };
};


export default styles;
