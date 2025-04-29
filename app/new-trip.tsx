import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";
import { useTheme } from "./context/ThemeContext";
import FormField from "../components/FormField";
import FormSelectField from "../components/FormSelectField";

export default function NewTrip() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [startOdometer, setStartOdometer] = useState("");
  const [endOdometer, setEndOdometer] = useState("");
  const [vehicleList, setVehicleList] = useState<string[]>([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("vehicles");
      if (saved) setVehicleList(JSON.parse(saved));
    })();
  }, []);

  const saveTrip = async () => {
    if (
      !start ||
      !destination ||
      !purpose ||
      !vehicle ||
      !startOdometer ||
      !endOdometer ||
      isNaN(Number(startOdometer)) ||
      isNaN(Number(endOdometer))
    ) {
      Alert.alert(
        "Missing or Invalid Input",
        "Please fill out all fields correctly."
      );
      return;
    }

    const trip = {
      start,
      destination,
      purpose,
      vehicle,
      startOdometer,
      endOdometer,
      miles: milesDriven(),
      date: new Date().toLocaleString(),
    };

    try {
      const existing = await AsyncStorage.getItem("trips");
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(trip);
      await AsyncStorage.setItem("trips", JSON.stringify(parsed));
      Alert.alert("Saved", "Your trip has been logged.");

      // Reset form
      setStart("");
      setDestination("");
      setPurpose("");
      setVehicle("");
      setStartOdometer("");
      setEndOdometer("");
    } catch (err) {
      Alert.alert("Error", "Failed to save trip.");
    }
  };

  const milesDriven = () => {
    const startVal = parseFloat(startOdometer);
    const endVal = parseFloat(endOdometer);
    if (isNaN(startVal) || isNaN(endVal)) return "";
    return (endVal - startVal).toFixed(1);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#f2f2f7", // Proper iOS grouped background
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
        Log New Trip
      </Text>

      {/* Section header */}
      <Text
        style={{
          fontSize: 13,
          color: isDark ? "#8e8e93" : "#6e6e73",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Trip Details
      </Text>

      {/* Grouped Card */}
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
        <FormField
          label="Starting Location"
          value={start}
          onChangeText={setStart}
          placeholder="e.g. Home"
        />

        <FormField
          label="Destination"
          value={destination}
          onChangeText={setDestination}
          placeholder="e.g. Client Office"
        />

        <FormField
          label="Purpose"
          value={purpose}
          onChangeText={setPurpose}
          placeholder="e.g. Business Meeting"
        />

        <FormSelectField
          label="Vehicle"
          selectedValue={vehicle}
          onValueChange={setVehicle}
          options={[
            { label: "Select Vehicle", value: "" },
            ...vehicleList.map((v) => ({ label: v, value: v })),
          ]}
        />

        <FormField
          label="Starting Odometer"
          value={startOdometer}
          onChangeText={setStartOdometer}
          placeholder="e.g. 12034.5"
          keyboardType="numeric"
        />

        <FormField
          label="Ending Odometer"
          value={endOdometer}
          onChangeText={setEndOdometer}
          placeholder="e.g. 12054.9"
          keyboardType="numeric"
        />

        <FormField
          label="Miles Driven (Auto-calculated)"
          value={milesDriven()}
          editable={false}
        />
      </View>

      {/* Actions Grouped */}
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
          onPress={saveTrip}
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#2c2c2e" : "#e5e7eb",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#007aff",
              textAlign: "center",
            }}
          >
            Save Trip
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/home")}
          style={{
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: isDark ? "#e5e5ea" : "#6b7280",
              textAlign: "center",
            }}
          >
            Back to Home
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
