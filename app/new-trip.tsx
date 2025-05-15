// NewTrip.tsx
import { useEffect, useMemo, useState } from "react";
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
import DateTimeField from "../components/DateTimeField";
import { Ionicons } from "@expo/vector-icons";

export default function NewTrip() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [tripType, setTripType] = useState("business");

  const [startOdometer, setStartOdometer] = useState("");
  const [endOdometer, setEndOdometer] = useState("");
  const [vehicleList, setVehicleList] = useState<string[]>([]);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [errors, setErrors] = useState({
    start: false,
    destination: false,
    purpose: false,
    vehicle: false,
    startOdometer: false,
    endOdometer: false,
  });

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("vehicles");
      if (saved) setVehicleList(JSON.parse(saved));
    })();
  }, []);

  const vehicleOptions = useMemo(
    () => [
      { label: "Select Vehicle", value: "" },
      ...vehicleList.map((v) => ({ label: v, value: v })),
    ],
    [vehicleList]
  );

  const tripTypeOptions = [
    { label: "Business (70¢/mi)", value: "business" },
    { label: "Medical (21¢/mi)", value: "medical" },
    { label: "Moving (Military, 21¢/mi)", value: "moving" },
    { label: "Charitable (14¢/mi)", value: "charitable" },
  ];

  const milesDriven = () => {
    const startVal = parseFloat(startOdometer);
    const endVal = parseFloat(endOdometer);
    if (isNaN(startVal) || isNaN(endVal)) return "";
    return (endVal - startVal).toFixed(1);
  };

  const saveTrip = async () => {
    const newErrors = {
      start: !start,
      destination: !destination,
      purpose: !purpose,
      vehicle: !vehicle,
      startOdometer: !startOdometer || isNaN(Number(startOdometer)),
      endOdometer: !endOdometer || isNaN(Number(endOdometer)),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((v) => v)) {
      Alert.alert(
        "Missing or Invalid Input",
        "Please fill out all fields correctly."
      );
      return;
    }

    const trip = {
      id: Math.random().toString(36).substring(2, 10),
      start,
      destination,
      purpose,
      vehicle,
      tripType,
      startOdometer,
      endOdometer,
      miles: milesDriven(),
      startTime: startTime.toLocaleString(),
      endTime: endTime.toLocaleString(),
      dateLogged: new Date().toLocaleString(),
    };

    const existing = await AsyncStorage.getItem("trips");
    const parsed = existing ? JSON.parse(existing) : [];
    parsed.push(trip);
    await AsyncStorage.setItem("trips", JSON.stringify(parsed));

    Alert.alert("Saved", "Your trip has been logged.");

    setStart("");
    setDestination("");
    setPurpose("");
    setVehicle("");
    setTripType("business");
    setStartOdometer("");
    setEndOdometer("");
    setStartTime(new Date());
    setEndTime(new Date());
    setErrors({
      start: false,
      destination: false,
      purpose: false,
      vehicle: false,
      startOdometer: false,
      endOdometer: false,
    });
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

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#F4D35E",
        padding: 24,
      }}
    >
      <HeaderLogo isDark={isDark} />

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
          Log New Trip
        </Text>
      </View>

      {/* Where & Why */}
      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="location-outline" text="Where & Why" />
        <FormField
          label="Starting Location"
          value={start}
          onChangeText={setStart}
          hasError={errors.start}
          isDark={isDark}
        />
        <FormField
          label="Destination"
          value={destination}
          onChangeText={setDestination}
          hasError={errors.destination}
          isDark={isDark}
        />
        <FormField
          label="Purpose"
          value={purpose}
          onChangeText={setPurpose}
          hasError={errors.purpose}
          isDark={isDark}
        />
      </View>

      {/* Vehicle */}
      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="car-outline" text="Vehicle" />
        <FormSelectField
          label="Vehicle"
          selectedValue={vehicle}
          onValueChange={setVehicle}
          hasError={errors.vehicle}
          options={vehicleOptions}
          isDark={isDark}
        />
      </View>

      {/* Trip Type */}
      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="pricetag-outline" text="Trip Type" />
        <FormSelectField
          label="Trip Type"
          selectedValue={tripType}
          onValueChange={setTripType}
          hasError={false}
          options={tripTypeOptions}
          isDark={isDark}
        />
      </View>

      {/* Odometer */}
      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="speedometer-outline" text="Odometer" />
        <FormField
          label="Starting Odometer"
          value={startOdometer}
          onChangeText={setStartOdometer}
          placeholder="e.g. 12034.5"
          keyboardType="numeric"
          hasError={errors.startOdometer}
          isDark={isDark}
        />
        <FormField
          label="Ending Odometer"
          value={endOdometer}
          onChangeText={setEndOdometer}
          placeholder="e.g. 12054.9"
          keyboardType="numeric"
          hasError={errors.endOdometer}
          isDark={isDark}
        />
      </View>

      {/* Timing */}
      <View style={sectionBoxStyle(isDark)}>
        <SectionTitle icon="time-outline" text="Timing" />
        <DateTimeField
          label="Start Date/Time"
          value={startTime}
          onChange={setStartTime}
          isDark={isDark}
        />
        <DateTimeField
          label="End Date/Time"
          value={endTime}
          onChange={setEndTime}
          isDark={isDark}
        />
      </View>

      {/* Summary */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Ionicons
          name="walk-outline"
          size={18}
          color={isDark ? "#fcd34d" : "#2C3E50"}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: isDark ? "#fcd34d" : "#2C3E50",
          }}
        >
          {milesDriven() || "0.0"} miles driven
        </Text>
      </View>

      {/* Actions */}
      <View style={sectionBoxStyle(isDark)}>
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
          style={{ padding: 16 }}
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
