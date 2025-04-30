import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderLogo from "../components/HeaderLogo";
import { useTheme } from "./context/ThemeContext";
import FormField from "../components/FormField";
import FormSelectField from "../components/FormSelectField";
import DateTimeField from "../components/DateTimeField";

type Trip = {
  id: string;
  start: string;
  destination: string;
  purpose: string;
  vehicle: string;
  startOdometer: string;
  endOdometer: string;
  miles: string;
  startDateTime: string;
  endDateTime: string;
};

export default function EditTrip() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { tripId } = useLocalSearchParams();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [vehicleList, setVehicleList] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("trips");
      if (!raw) return;
      const parsed: Trip[] = JSON.parse(raw);
      const found = parsed.find((t) => t.id === tripId);
      if (found) setTrip(found);

      const savedVehicles = await AsyncStorage.getItem("vehicles");
      if (savedVehicles) setVehicleList(JSON.parse(savedVehicles));
    })();
  }, [tripId]);

  const saveChanges = async () => {
    if (!trip) return;
    const raw = await AsyncStorage.getItem("trips");
    if (!raw) return;
    const parsed: Trip[] = JSON.parse(raw);
    const updated = parsed.map((t) => (t.id === trip.id ? trip : t));
    await AsyncStorage.setItem("trips", JSON.stringify(updated));
    Alert.alert("Updated", "Your trip has been saved.");
    router.replace("/history");
  };

  const updateTripField = (field: keyof Trip, value: string) => {
    if (!trip) return;
    setTrip({ ...trip, [field]: value });
  };

  if (!trip) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>Loading trip...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#f2f2f7",
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
        Edit Trip
      </Text>

      <View
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#fff",
          borderRadius: 12,
          padding: 16,
          marginBottom: 32,
          borderWidth: 1,
          borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
        }}
      >
        <FormField
          label="Start"
          value={trip.start}
          onChangeText={(v) => updateTripField("start", v)}
        />
        <FormField
          label="Destination"
          value={trip.destination}
          onChangeText={(v) => updateTripField("destination", v)}
        />
        <FormField
          label="Purpose"
          value={trip.purpose}
          onChangeText={(v) => updateTripField("purpose", v)}
        />
        <FormSelectField
          label="Vehicle"
          selectedValue={trip.vehicle}
          onValueChange={(v) => updateTripField("vehicle", v)}
          options={[
            { label: "Select Vehicle", value: "" },
            ...vehicleList.map((v) => ({ label: v, value: v })),
          ]}
        />
        <FormField
          label="Start Odometer"
          value={trip.startOdometer}
          onChangeText={(v) => updateTripField("startOdometer", v)}
        />
        <FormField
          label="End Odometer"
          value={trip.endOdometer}
          onChangeText={(v) => updateTripField("endOdometer", v)}
        />
        <DateTimeField
          label="Start Time"
          value={new Date(trip.startDateTime)}
          onChange={(d) => updateTripField("startDateTime", d.toISOString())}
        />
        <DateTimeField
          label="End Time"
          value={new Date(trip.endDateTime)}
          onChange={(d) => updateTripField("endDateTime", d.toISOString())}
        />
      </View>

      <Pressable
        onPress={saveChanges}
        style={{
          padding: 16,
          backgroundColor: "#007aff",
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Save Changes
        </Text>
      </Pressable>
    </ScrollView>
  );
}
