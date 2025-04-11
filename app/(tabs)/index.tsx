import React, { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HistoricalSite from "../historical_site";
import { Ionicons } from "@expo/vector-icons";
import TrangPhongTuc from "../phongtuc";

const Tab = createBottomTabNavigator();

export default function Index() {
  const [showRedirect, setShowRedirect] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowRedirect(false), 1000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  if (showRedirect) {
    return <Redirect href="/splash" />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Di tích"
          component={HistoricalSite}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Sự kiện"
          component={HistoricalSite}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Phong tục"
          component={TrangPhongTuc}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Cộng đồng"
          component={HistoricalSite}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Kiến thức"
          component={HistoricalSite}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
