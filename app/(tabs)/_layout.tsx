import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from "expo-router";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColor.tint,
        tabBarInactiveTintColor: themeColor.tabIconDefault,
        tabBarHideOnKeyboard: true, 
        tabBarButton: HapticTab,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: themeColor.background,
            borderTopColor: themeColor.tint,
            shadowColor: themeColor.tint,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="ditich"
        options={{
          title: 'Di tích',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="phongtuc"
        options={{
          title: 'Phong tục',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sukien"
        options={{
          title: 'Sự kiện',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="congdong"
        options={{
          title: 'Cộng đồng',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kienthuc"
        options={{
          title: 'Kiến thức',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    borderTopWidth: 1,
    elevation: 10,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 5,
  },
});
