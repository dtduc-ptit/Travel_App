// app/screen/_layout.tsx
import { Stack } from "expo-router";

export default function ScreenLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // hoặc "fade", "slide_from_bottom", "default"
        headerShown: false,
      }}
    />
  );
}
