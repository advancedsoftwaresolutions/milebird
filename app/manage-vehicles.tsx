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
    if (!newVehicle.trim()) {
      Alert.alert("Error", "Vehicle name cannot be empty.");
      return;
    }
    if (vehicles.includes(newVehicle.trim())) {
      Alert.alert("Duplicate", "This vehicle already exists.");
      return;
    }
    const updated = [...vehicles, newVehicle.trim()];
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
        backgroundColor: isDark ? "#000" : "#f2f2f7",
        padding: 24,
      }}
    >
      <HeaderLogo />

      {/* Title */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: isDark ? "#fff" : "#1c1c1e",
          marginBottom: 24,
        }}
      >
        Manage Vehicles
      </Text>

      {/* Section Header */}
      <Text
        style={{
          fontSize: 13,
          color: isDark ? "#8e8e93" : "#6e6e73",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Add New Vehicle
      </Text>

      {/* Add Vehicle Card */}
      <View
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#fff",
          borderRadius: 12,
          padding: 16,
          marginBottom: 32,
          borderWidth: 1,
          borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
          shadowColor: "#000",
          shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
        }}
      >
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
            backgroundColor: "#007aff",
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
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Add Vehicle
          </Text>
        </Pressable>
      </View>

      {/* Section Header */}
      <Text
        style={{
          fontSize: 13,
          color: isDark ? "#8e8e93" : "#6e6e73",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Your Vehicles
      </Text>

      {/* Vehicles List Card */}
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
        {vehicles.length === 0 ? (
          <View style={{ paddingVertical: 20 }}>
            <Text
              style={{
                fontSize: 16,
                color: isDark ? "#888" : "#6b7280",
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
                <Text style={{ color: "white", fontWeight: "600" }}>
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
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: isDark ? "#fff" : "#1c1c1e",
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
      </View>

      {/* Actions Section */}
      <Text
        style={{
          fontSize: 13,
          color: isDark ? "#8e8e93" : "#6e6e73",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Actions
      </Text>

      {/* Back to Home Button */}
      <View
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#fff",
          borderRadius: 12,
          overflow: "hidden",
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
