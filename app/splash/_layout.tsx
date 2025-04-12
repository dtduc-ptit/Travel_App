import { Stack } from "expo-router";

export default function SplashLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Không cần khai báo các screen con, Expo tự xử lý */}
    </Stack>
  );
}
