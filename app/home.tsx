import { useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./context/ThemeContext";

export default function HomeScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const options = [
    { label: "Log New Trip", route: "/new-trip" },
    { label: "View Trip History", route: "/history" },
  ];

  const settings = [
    { label: "Settings & Mileage Rate", route: "/settings" },
    { label: "Manage Vehicles", route: "/manage-vehicles" },
  ];

  const handlePress = (route: string, anim: Animated.Value) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 6,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(route);
    });
  };

  const CardRow = ({
    label,
    route,
    isLast,
  }: {
    label: string;
    route: string;
    isLast?: boolean;
  }) => {
    const anim = useRef(new Animated.Value(0)).current;

    return (
      <Pressable
        onPress={() => handlePress(route, anim)}
        android_ripple={{ color: isDark ? "#333" : "#ccc" }}
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#fff",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: isDark ? "#ffffff" : "#007aff",
            fontSize: 17,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
        <Animated.View style={{ transform: [{ translateX: anim }] }}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#9fa1a6" : "#C7C7CC"}
          />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#f2f2f7", // system background
      }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingHorizontal: 24 }}
      >
        {/* Header */}
        <HeaderLogo />

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: isDark ? "#ffffff" : "#1c1c1e",
            marginBottom: 24,
          }}
        >
          Welcome back!
        </Text>

        {/* Section: Trips */}
        <Text
          style={{
            fontSize: 13,
            color: isDark ? "#8e8e93" : "#6e6e73",
            marginBottom: 8,
            paddingLeft: 4,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Trips
        </Text>

        <View
          style={{
            backgroundColor: isDark ? "#1c1c1e" : "#fff",
            borderRadius: 12,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
          }}
        >
          {options.map((item, index) => (
            <CardRow
              key={item.route}
              label={item.label}
              route={item.route}
              isLast={index === options.length - 1}
            />
          ))}
        </View>

        {/* Section: Settings */}
        <Text
          style={{
            fontSize: 13,
            color: isDark ? "#8e8e93" : "#6e6e73",
            marginBottom: 8,
            paddingLeft: 4,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Settings
        </Text>

        <View
          style={{
            backgroundColor: isDark ? "#1c1c1e" : "#fff",
            borderRadius: 12,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
          }}
        >
          {settings.map((item, index) => (
            <CardRow
              key={item.route}
              label={item.label}
              route={item.route}
              isLast={index === settings.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
