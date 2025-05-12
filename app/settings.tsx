// SettingsScreen.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";

import { Ionicons } from "@expo/vector-icons";

const FormSection = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <View
      style={{
        marginBottom: 24,
        backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isDark ? "#2c2c2e" : "#2C3E50",
        shadowColor: "#000",
        shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
      }}
    >
      {children}
    </View>
  );
};

const SectionTitle = ({ icon, text }: { icon: string; text: string }) => (
  <View
    style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
  >
    <Ionicons
      name={icon}
      size={16}
      color="#9ca3af"
      style={{ marginRight: 6 }}
    />
    <Text style={{ fontSize: 14, fontWeight: "600", color: "#9ca3af" }}>
      {text}
    </Text>
  </View>
);

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#000" : "#F4D35E" }}
    >
      <ScrollView style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <HeaderLogo />

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: isDark ? "#fff" : "#2C3E50",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Settings
        </Text>

        <FormSection>
          <SectionTitle icon="speedometer-outline" text="Mileage Settings" />

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
              marginBottom: 16,
            }}
            keyboardType="decimal-pad"
            value={rate}
            onChangeText={setRate}
            placeholder="e.g. 0.655"
            placeholderTextColor={isDark ? "#888" : "#aaa"}
          />

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
                    unit === u ? "#EE6C4D" : isDark ? "#3a3a3c" : "#f2f2f2",
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
        </FormSection>

        <FormSection>
          <SectionTitle icon="contrast-outline" text="Display Options" />

          <Pressable
            onPress={toggleTheme}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 8,
            }}
          >
            <Text
              style={{ fontSize: 16, color: isDark ? "#e5e5ea" : "#1c1c1e" }}
            >
              Toggle Dark Mode
            </Text>
            <View
              style={{
                width: 50,
                height: 30,
                backgroundColor: "#EE6C4D",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {isDark ? "On" : "Off"}
              </Text>
            </View>
          </Pressable>
        </FormSection>

        <FormSection>
          <Pressable
            onPress={saveSettings}
            style={{
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? "#2c2c2e" : "#e5e7eb",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#007aff" }}>
              Save Settings
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/home")}
            style={{ paddingVertical: 16, alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#e5e5ea" : "#6b7280",
              }}
            >
              Back to Home
            </Text>
          </Pressable>
        </FormSection>
      </ScrollView>
    </SafeAreaView>
  );
}
