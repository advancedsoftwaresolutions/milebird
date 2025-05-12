// app/_layout.tsx (or layout.tsx)
import { Slot } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text as RNText, View } from "react-native";
import { ThemeProvider } from "./context/ThemeContext";

if (typeof global !== "undefined" && typeof global.Text === "undefined") {
  global.RNText = RNText;
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null; // ✅ avoid mounting anything until ready

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
