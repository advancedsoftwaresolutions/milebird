import { View, Text, ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderLogo from "../components/HeaderLogo";
import { useRouter } from "expo-router";

export default function SummaryScreen() {
  const [trips, setTrips] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("trips");
      if (data) setTrips(JSON.parse(data));
    })();
  }, []);

  const totalMiles = trips
    .reduce((sum, t) => sum + parseFloat(t.miles || 0), 0)
    .toFixed(1);
  const vehicleUsage = {};
  const purposeUsage = {};

  trips.forEach((t) => {
    vehicleUsage[t.vehicle] = (vehicleUsage[t.vehicle] || 0) + 1;
    purposeUsage[t.purpose] = (purposeUsage[t.purpose] || 0) + 1;
  });

  const topVehicle =
    Object.entries(vehicleUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  const topPurpose =
    Object.entries(purposeUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 24 }}>
      <HeaderLogo />

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#1e3a8a",
          marginBottom: 24,
        }}
      >
        Trip Summary
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Total Trips
        </Text>
        <Text style={{ fontSize: 16, color: "#374151" }}>{trips.length}</Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Total Miles Driven
        </Text>
        <Text style={{ fontSize: 16, color: "#374151" }}>{totalMiles} mi</Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Most Used Vehicle
        </Text>
        <Text style={{ fontSize: 16, color: "#374151" }}>{topVehicle}</Text>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Top Purpose
        </Text>
        <Text style={{ fontSize: 16, color: "#374151" }}>{topPurpose}</Text>
      </View>

      <Pressable
        onPress={() => router.replace("/home")}
        style={{
          marginTop: 24,
          backgroundColor: "#6b7280",
          paddingVertical: 14,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Back to Home
        </Text>
      </Pressable>
    </ScrollView>
  );
}
