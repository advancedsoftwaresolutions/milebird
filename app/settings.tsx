import { useEffect, useState } from "react";
import {
  View,
  Text,
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

const SectionTitle = ({ icon, text }: { icon: string; text: string }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const iconBackgrounds: Record<string, string> = {
    "speedometer-outline": "#fcd34d",
    "contrast-outline": "#c4b5fd",
    "locate-outline": "#bfdbfe",
  };

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
    >
      <View
        style={{
          backgroundColor: iconBackgrounds[icon] || "#e5e7eb",
          borderRadius: 999,
          padding: 10,
          marginRight: 12,
          shadowColor: "#000",
          shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.3,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}
      >
        <Ionicons name={icon as any} size={16} color="#1f2937" />
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: isDark ? "#ffffff" : "#2C3E50",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [unit, setUnit] = useState("mi");

  useEffect(() => {
    const loadSettings = async () => {
      const storedUnit = await AsyncStorage.getItem("preferredUnit");
      if (storedUnit) setUnit(storedUnit);
    };
    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
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
            fontSize: 26,
            fontWeight: "800",
            color: isDark ? "#fff" : "#2C3E50",
            marginBottom: 24,
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          Settings
        </Text>

        {/* 2025 IRS Rates */}
        <FormSection>
          <SectionTitle icon="speedometer-outline" text="2025 Mileage Rates" />
          {[
            { label: "Business", value: "70¢ per mile" },
            { label: "Medical", value: "21¢ per mile" },
            { label: "Moving (military only)", value: "21¢ per mile" },
            { label: "Charitable", value: "14¢ per mile" },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: isDark ? "#e5e5ea" : "#1c1c1e",
                }}
              >
                {item.label}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#007aff",
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </FormSection>

        {/* Theme Toggle */}
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
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: isDark ? "#e5e5ea" : "#1c1c1e",
              }}
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

        {/* Units */}
        <FormSection>
          <SectionTitle icon="locate-outline" text="Distance Unit" />
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

        {/* Actions */}
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
