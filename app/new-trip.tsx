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
import { TextInput } from "react-native-gesture-handler";

export default function NewTrip() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vehicle, setVehicle] = useState("");

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

  const FormSection = ({ children }) => (
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

  const SectionTitle = ({ icon, text }) => (
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

      <TextInput
        value={start}
        onChangeText={setStart}
        placeholder="Test Input"
        style={{
          backgroundColor: "#fff",
          padding: 12,
          marginBottom: 16,
          borderColor: "#ccc",
          borderWidth: 1,
        }}
      />

      <FormSection>
        <SectionTitle icon="location-outline" text="Where & Why" />
        <FormField
          label="Starting Location"
          value={start}
          onChangeText={setStart}
          hasError={errors.start}
          isDark={isDark} // ✅ pass down
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
      </FormSection>

      <FormSection>
        <SectionTitle icon="car-outline" text="Vehicle" />
        <FormSelectField
          label="Vehicle"
          selectedValue={vehicle}
          onValueChange={setVehicle}
          hasError={errors.vehicle}
          options={vehicleOptions}
          isDark={isDark} // ✅ pass down
        />
      </FormSection>

      <FormSection>
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
      </FormSection>

      <FormSection>
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
      </FormSection>

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

      <FormSection>
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
      </FormSection>
    </ScrollView>
  );
}
