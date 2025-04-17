import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Ngăn splash auto hide cho đến khi load font xong
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', // 🔥 Hiệu ứng chuyển trang
        }}
      >
        {/* Các trang gốc */}
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />

        {/* ✅ Khai báo các trang trong thư mục screen/ để animation hoạt động */}
        <Stack.Screen name="screen/sukienchitiet" />
        <Stack.Screen name="screen/ditichchitiet" />
        <Stack.Screen name="screen/phongtucchitiet" />
        <Stack.Screen name="screen/ketquatimkiem" />
        <Stack.Screen name="screen/bando" />
        {/* Thêm các trang khác nếu có */}
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
