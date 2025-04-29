import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [rate, setRate] = useState("");
  const [unit, setUnit] = useState("mi");

  useEffect(() => {
    const loadSettings = async () => {
      const storedRate = await AsyncStorage.getItem("mileageRate");
      const storedUnit = await AsyncStorage.getItem("preferredUnit");
      if (storedRate) setRate(storedRate);
      if (storedUnit) setUnit(storedUnit);
    };
    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("mileageRate", rate);
      await AsyncStorage.setItem("preferredUnit", unit);
      Alert.alert("Saved", "Your settings have been saved.");
    } catch (error) {
      Alert.alert("Error", "Could not save settings.");
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#f2f2f7", // System grouped background
        padding: 24,
      }}
    >
      <HeaderLogo />

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: isDark ? "#fff" : "#1c1c1e",
          marginBottom: 24,
        }}
      >
        Settings
      </Text>

      {/* Section: Mileage Settings */}
      <Text
        style={{
          fontSize: 13,
          color: isDark ? "#8e8e93" : "#6e6e73",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Mileage Settings
      </Text>

      <View
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#fff",
          borderRadius: 12,
          marginBottom: 24,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: isDark ? "#2c2c2e" : "#e5e5ea",
          shadowColor: "#000",
          shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
        }}
      >
        {/* IRS Mileage Rate */}
        <View
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#2c2c2e" : "#e5e5ea",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: isDark ? "#e5e5ea" : "#1c1c1e",
              marginBottom: 8,
            }}
          >
            IRS Mileage Rate ($/mile)
          </Text>
          <TextInput
            style={{
              backgroundColor: isDark ? "#2c2c2e" : "#f9fafb",
              borderRadius: 10,
              paddingVertical: 14,
              paddingHorizontal: 16,
              fontSize: 16,
              color: isDark ? "#fff" : "#111827",
            }}
            keyboardType="decimal-pad"
            value={rate}
            onChangeText={setRate}
            placeholder="e.g. 0.655"
            placeholderTextColor={isDark ? "#888" : "#aaa"}
          />
        </View>

        {/* Preferred Unit */}
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 16,
              color: isDark ? "#e5e5ea" : "#1c1c1e",
              marginBottom: 8,
            }}
          >
            Preferred Unit
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["mi", "km"].map((u) => (
              <Pressable
                key={u}
                onPress={() => setUnit(u)}
                style={{
                  flex: 1,
                  backgroundColor:
                    unit === u ? "#007aff" : isDark ? "#3a3a3c" : "#f2f2f2",
                  borderRadius: 8,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "500",
                    color: unit === u ? "#fff" : isDark ? "#e5e5ea" : "#1c1c1e",
                  }}
                >
                  {u === "mi" ? "Miles" : "Kilometers"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Section: Display Settings */}
      <Text
        style={{
          fontSize: 13,
          color: isDark ? "#8e8e93" : "#6e6e73",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Display Options
      </Text>

      <View
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#fff",
          borderRadius: 12,
          marginBottom: 24,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: isDark ? "#2c2c2e" : "#e5e5ea",
          shadowColor: "#000",
          shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
        }}
      >
        {/* Toggle Dark Mode */}
        <Pressable
          onPress={toggleTheme}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#2c2c2e" : "#e5e5ea",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: isDark ? "#e5e5ea" : "#1c1c1e",
            }}
          >
            Toggle Dark Mode
          </Text>
          <View
            style={{
              width: 50,
              height: 30,
              backgroundColor: "#007aff",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              {theme === "dark" ? "On" : "Off"}
            </Text>
          </View>
        </Pressable>

        {/* Save Settings */}
        <Pressable
          onPress={saveSettings}
          style={{
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#007aff",
              fontWeight: "600",
            }}
          >
            Save Settings
          </Text>
        </Pressable>
      </View>

      {/* Grouped Button */}
      <View
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#fff",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 32,
          borderWidth: 1,
          borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
          shadowColor: "#000",
          shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
        }}
      >
        <Pressable
          onPress={() => router.replace("/home")}
          style={{
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#007aff",
            }}
          >
            Back to Home
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
