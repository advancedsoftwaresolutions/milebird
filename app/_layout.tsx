import { Slot } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Text as RNText, View } from "react-native";
import { StatusBar } from "expo-status-bar";

// Web needs this patch to avoid Text constructor errors
if (typeof global !== "undefined" && typeof global.Text === "undefined") {
  global.RNText = RNText;
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <RNText>Loading fonts...</RNText>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}
