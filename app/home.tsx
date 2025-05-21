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
    if (Platform.OS !== "web") Haptics.selectionAsync();
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

    const icons: Record<string, string> = {
      "Log New Trip": "car",
      "View Trip History": "time",
      "Settings & Mileage Rate": "settings",
      "Manage Vehicles": "build",
    };

    const gradients: Record<string, string[]> = {
      "Log New Trip": ["#fde68a", "#facc15"],
      "View Trip History": ["#bfdbfe", "#60a5fa"],
      "Settings & Mileage Rate": ["#c4b5fd", "#8b5cf6"],
      "Manage Vehicles": ["#fcd34d", "#f59e0b"],
    };

    const iconName = icons[label] || "ellipse";
    const gradientColors = gradients[label] || ["#e5e7eb", "#d1d5db"];

    return (
      <Pressable
        onPress={() => handlePress(route, anim)}
        android_ripple={{ color: isDark ? "#333" : "#ccc" }}
        style={{
          paddingHorizontal: 24,
          paddingVertical: 20,
          borderBottomWidth: isLast ? 0 : 1,
          borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
          backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: gradientColors[0],
              borderRadius: 999,
              padding: 10,
              marginRight: 16,
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.3,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            }}
          >
            <Ionicons name={iconName as any} size={18} color="#1f2937" />
          </View>
          <View>
            <Text
              style={{
                color: isDark ? "#ffffff" : "#2C3E50",
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 2,
              }}
            >
              {label}
            </Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ translateX: anim }] }}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#9fa1a6" : "#2C3E50"}
          />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#000" : "#F4D35E" }}
    >
      <ScrollView style={{ paddingVertical: 18, paddingHorizontal: 24 }}>
        <HeaderLogo />
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: isDark ? "#ffffff" : "#2C3E50",
              marginBottom: 24,
              textAlign: "center",
              letterSpacing: 0.5,
            }}
          >
            Welcome back!
          </Text>
        </View>

        {/* Trips Section */}
        <Text
          style={{
            fontSize: 13,
            color: isDark ? "#8e8e93" : "#2C3E50",
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
            backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
            borderRadius: 12,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: isDark ? "#2c2c2e" : "#2C3E50",
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

        {/* Settings Section */}
        <Text
          style={{
            fontSize: 13,
            color: isDark ? "#8e8e93" : "#2C3E50",
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
            backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
            borderRadius: 12,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: isDark ? "#2c2c2e" : "#2C3E50",
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
