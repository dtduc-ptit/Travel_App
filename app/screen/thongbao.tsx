import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ThongBaoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Không có thông báo nào</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",     
    padding: 20,
  },
  message: {
    fontSize: 18,
    color: "gray",
  },
});

export default ThongBaoScreen;
