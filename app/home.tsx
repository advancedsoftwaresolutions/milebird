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

    // Optional per-label icons
    const icons: Record<string, string> = {
      "Log New Trip": "car",
      "View Trip History": "time",
      "Settings & Mileage Rate": "settings",
      "Manage Vehicles": "build",
    };

    const iconBackgrounds: Record<string, string> = {
      "Log New Trip": "#fde68a", // banana yellow
      "View Trip History": "#bfdbfe", // light sky blue
      "Settings & Mileage Rate": "#c4b5fd", // lavender
      "Manage Vehicles": "#fcd34d", // warm amber
    };

    const iconName = icons[label] || "ellipse";

    return (
      <Pressable
        onPress={() => handlePress(route, anim)}
        android_ripple={{ color: isDark ? "#333" : "#ccc" }}
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
          paddingHorizontal: 24,
          paddingVertical: 18,
          borderBottomWidth: isLast ? 0 : 1,
          borderColor: isDark ? "#2c2c2e" : "#e0e0e0",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor:
                iconBackgrounds[label] || (isDark ? "#2c2c2e" : "#f2f4f7"),
              borderRadius: 999,
              padding: 10,
              marginRight: 16,

              // Shadow styles
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.3,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3, // Android shadow
            }}
          >
            <Ionicons
              name={iconName as any}
              size={18}
              color={isDark ? "#1f2937" : "#1f2937"}
            />
          </View>
          <Text
            style={{
              color: isDark ? "#ffffff" : "#2C3E50",
              fontSize: 17,
              fontWeight: "600",
            }}
          >
            {label}
          </Text>
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
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#F4D35E", // system background
      }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingVertical: 18, paddingHorizontal: 24 }}
      >
        {/* Header */}
        <HeaderLogo />

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: isDark ? "#ffffff" : "#2C3E50",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Welcome back!
          </Text>
        </View>

        {/* Section: Trips */}
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
            backgroundColor: isDark ? "#1c1c1e" : "#2C3E50",
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

        {/* Section: Settings */}
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
            backgroundColor: isDark ? "#1c1c1e" : "#2C3E50",
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
