// EditTrip.tsx
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
import { Ionicons } from "@expo/vector-icons";

type Trip = {
  id: string;
  start: string;
  destination: string;
  purpose: string;
  vehicle: string;
  tripType?: string;
  startOdometer: string;
  endOdometer: string;
  miles: string;
  startDateTime: string;
  endDateTime: string;
};

const tripTypeOptions = [
  { label: "Business", value: "business" },
  { label: "Medical", value: "medical" },
  { label: "Moving", value: "moving" },
  { label: "Charitable", value: "charitable" },
];

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

    const updated = { ...trip, [field]: value };

    // Recalculate miles if odometer values changed
    const start = parseFloat(
      field === "startOdometer" ? value : updated.startOdometer
    );
    const end = parseFloat(
      field === "endOdometer" ? value : updated.endOdometer
    );

    if (!isNaN(start) && !isNaN(end)) {
      updated.miles = (end - start).toFixed(1);
    }

    setTrip(updated);
  };

  const SectionTitle = ({ icon, text }: { icon: string; text: string }) => {
    const iconBackgrounds: Record<string, string> = {
      "location-outline": "#fde68a",
      "car-outline": "#fcd34d",
      "speedometer-outline": "#bfdbfe",
      "time-outline": "#c4b5fd",
      "pricetag-outline": "#d1fae5",
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
            color: isDark ? "#e5e5ea" : "#374151",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {text}
        </Text>
      </View>
    );
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
        backgroundColor: isDark ? "#000" : "#F4D35E",
        padding: 24,
      }}
    >
      <HeaderLogo />

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: isDark ? "#ffffff" : "#2C3E50",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Edit Trip
      </Text>

      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="location-outline" text="Where & Why" />
        <FormField
          label="Starting Location"
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
      </View>

      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="car-outline" text="Vehicle" />
        <FormSelectField
          label="Vehicle"
          selectedValue={trip.vehicle}
          onValueChange={(v) => updateTripField("vehicle", v)}
          options={[
            { label: "Select Vehicle", value: "" },
            ...vehicleList.map((v) => ({ label: v, value: v })),
          ]}
          isDark={isDark}
        />
      </View>

      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="pricetag-outline" text="Trip Type" />
        <FormSelectField
          label="Trip Type"
          selectedValue={trip.tripType || "business"}
          onValueChange={(v) => updateTripField("tripType", v)}
          options={tripTypeOptions}
          isDark={isDark}
        />
      </View>

      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="speedometer-outline" text="Odometer" />
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
      </View>

      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="time-outline" text="Timing" />
        <DateTimeField
          label="Start Date/Time"
          value={new Date(trip.startDateTime)}
          onChange={(d) => updateTripField("startDateTime", d.toISOString())}
          isDark={isDark}
        />
        <DateTimeField
          label="End Date/Time"
          value={new Date(trip.endDateTime)}
          onChange={(d) => updateTripField("endDateTime", d.toISOString())}
          isDark={isDark}
        />
      </View>

      <View style={sectionBoxStyle(isDark)}>
        <Pressable
          onPress={saveChanges}
          style={{
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#007aff",
            }}
          >
            Save Changes
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace("/history")}
          style={{
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: isDark ? "#e5e5ea" : "#6b7280",
            }}
          >
            Cancel
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function sectionBoxStyle(isDark: boolean) {
  return {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? "#2c2c2e" : "#2C3E50",
    backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
  };
}
