import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderLogo from "../components/HeaderLogo";
import { useTheme } from "./context/ThemeContext";
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
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
    "car-outline": "#fcd34d",
    "list-outline": "#c4b5fd",
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

export default function ManageVehiclesScreen() {
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [newVehicle, setNewVehicle] = useState("");
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("vehicles");
      if (saved) setVehicles(JSON.parse(saved));
    })();
  }, []);

  const saveVehicles = async (updatedList: string[]) => {
    setVehicles(updatedList);
    await AsyncStorage.setItem("vehicles", JSON.stringify(updatedList));
  };

  const addVehicle = async () => {
    const trimmed = newVehicle.trim();
    if (!trimmed) return Alert.alert("Error", "Vehicle name cannot be empty.");
    if (vehicles.includes(trimmed))
      return Alert.alert("Duplicate", "This vehicle already exists.");

    const updated = [...vehicles, trimmed];
    await saveVehicles(updated);
    setNewVehicle("");

    setTimeout(() => {
      Toast.show("Vehicle added!", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      });
    }, 100);
  };

  const deleteVehicle = async (name: string) => {
    const updated = vehicles.filter((v) => v !== name);
    await saveVehicles(updated);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#F4D35E",
        padding: 24,
      }}
    >
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
        Manage Vehicles
      </Text>

      {/* Add New Vehicle */}
      <FormSection>
        <SectionTitle icon="car-outline" text="Add New Vehicle" />
        <TextInput
          placeholder="e.g. Toyota Prius"
          placeholderTextColor={isDark ? "#888" : "#aaa"}
          value={newVehicle}
          onChangeText={setNewVehicle}
          style={{
            backgroundColor: isDark ? "#2c2c2e" : "#f9fafb",
            borderRadius: 10,
            paddingVertical: 14,
            paddingHorizontal: 16,
            fontSize: 16,
            color: isDark ? "#fff" : "#111827",
            marginBottom: 16,
          }}
        />
        <Pressable
          onPress={addVehicle}
          style={{
            backgroundColor: "#EE6C4D",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            Add Vehicle
          </Text>
        </Pressable>
      </FormSection>

      {/* Vehicle List */}
      <FormSection>
        <SectionTitle icon="list-outline" text="Your Vehicles" />
        {vehicles.length === 0 ? (
          <View style={{ paddingVertical: 20 }}>
            <Text
              style={{
                fontSize: 16,
                color: isDark ? "#888" : "#2C3E50",
                textAlign: "center",
              }}
            >
              No vehicles added yet.
            </Text>
          </View>
        ) : (
          vehicles.map((v, idx) => {
            const renderRightActions = () => (
              <Pressable
                onPress={() => deleteVehicle(v)}
                style={{
                  backgroundColor: "#ef4444",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 80,
                  height: "100%",
                }}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text
                  style={{ color: "white", fontWeight: "600", marginTop: 4 }}
                >
                  Delete
                </Text>
              </Pressable>
            );

            return (
              <Swipeable key={idx} renderRightActions={renderRightActions}>
                <View
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    borderBottomWidth: idx !== vehicles.length - 1 ? 1 : 0,
                    borderBottomColor: isDark ? "#2c2c2e" : "#e5e7eb",
                    backgroundColor: isDark ? "#1c1c1e" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: isDark ? "#fff" : "#2C3E50",
                      fontWeight: "500",
                    }}
                  >
                    {v}
                  </Text>
                </View>
              </Swipeable>
            );
          })
        )}
      </FormSection>

      {/* Back to Home */}
      <FormSection>
        <Pressable
          onPress={() => router.replace("/home")}
          style={{ paddingVertical: 16, alignItems: "center" }}
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
      </FormSection>
    </ScrollView>
  );
}
