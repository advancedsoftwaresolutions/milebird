import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Pencil, Trash2 } from "lucide-react-native";

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

export default function HistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [trips, setTrips] = useState<Trip[]>([]);
  const [irsRate, setIrsRate] = useState<number>(0.655);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const data = await AsyncStorage.getItem("trips");
    const savedRate = await AsyncStorage.getItem("irsRate");
    if (savedRate) {
      const rate = parseFloat(savedRate);
      if (!isNaN(rate)) setIrsRate(rate);
    }

    if (data) {
      let parsed: Trip[] = JSON.parse(data);
      parsed = parsed.map((t) => ({
        ...t,
        id: t.id || Math.random().toString(36).substring(2, 10),
        startDateTime: t.startDateTime || t.startTime,
        endDateTime: t.endDateTime || t.endTime,
      }));
      await AsyncStorage.setItem("trips", JSON.stringify(parsed));
      setTrips(parsed);
    }
  };

  const deleteTrip = async (id: string) => {
    const existing = await AsyncStorage.getItem("trips");
    if (!existing) return;

    const parsed: Trip[] = JSON.parse(existing);
    const updated = parsed.filter((t) => String(t.id) !== String(id));
    await AsyncStorage.setItem("trips", JSON.stringify(updated));
    setTrips(updated);
  };

  const confirmDelete = useCallback((id: string) => {
    Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          console.log("Deleting trip with ID:", id); // ✅ logs
          const stored = await AsyncStorage.getItem("trips");
          if (stored) {
            const parsed = JSON.parse(stored);
            const updated = parsed.filter((t: Trip) => t.id !== id);
            await AsyncStorage.setItem("trips", JSON.stringify(updated));
            setTrips(updated);
          }
        },
      },
    ]);
  }, []);

  const groupByYear = (trips: Trip[]) => {
    const map: { [year: string]: Trip[] } = {};
    trips.forEach((trip) => {
      const year = new Date(trip.startDateTime).getFullYear().toString();
      if (!map[year]) map[year] = [];
      map[year].push(trip);
    });
    return map;
  };

  const formatCurrency = (amount: number) =>
    `$${amount.toFixed(2).toLocaleString()}`;

  const formatDateTime = (date: string) => new Date(date).toLocaleString();

  const exportCSV = async (year: string, trips: Trip[]) => {
    const headers = [
      "Start",
      "Destination",
      "Purpose",
      "Vehicle",
      "Start Odometer",
      "End Odometer",
      "Miles",
      "Start Time",
      "End Time",
      "Deduction",
    ];
    const rows = trips.map((trip) => {
      const miles = parseFloat(trip.miles);
      const deduction = isNaN(miles) ? 0 : miles * irsRate;
      return [
        trip.start,
        trip.destination,
        trip.purpose,
        trip.vehicle,
        trip.startOdometer,
        trip.endOdometer,
        trip.miles,
        trip.startDateTime,
        trip.endDateTime,
        deduction.toFixed(2),
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const fileUri = FileSystem.documentDirectory + `trips_${year}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv);
    await Sharing.shareAsync(fileUri);
  };

  const tripsByYear = groupByYear(trips);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000" : "#f2f2f7" }}>
      <HeaderLogo />
      <ScrollView style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: isDark ? "#fff" : "#1c1c1e",
            marginBottom: 24,
          }}
        >
          Trip History
        </Text>

        {Object.entries(tripsByYear)
          .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
          .map(([year, yearTrips]) => {
            const total = yearTrips.reduce((sum, t) => {
              const m = parseFloat(t.miles);
              return sum + (isNaN(m) ? 0 : m * irsRate);
            }, 0);

            return (
              <View key={year}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: isDark ? "#fff" : "#111827",
                    marginBottom: 12,
                  }}
                >
                  {year} — Total Deduction:{" "}
                  <Text style={{ color: "#22c55e" }}>
                    {formatCurrency(total)}
                  </Text>
                </Text>

                <View
                  style={{
                    backgroundColor: isDark ? "#1c1c1e" : "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
                  }}
                >
                  {yearTrips.map((trip, idx) => {
                    const deduction = parseFloat(trip.miles) * irsRate || 0;

                    return (
                      <View
                        key={trip.id}
                        style={{
                          position: "relative",
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderBottomWidth:
                            idx !== yearTrips.length - 1 ? 1 : 0,
                          borderBottomColor: isDark ? "#2c2c2e" : "#e5e7eb",
                        }}
                      >
                        {/* Edit button */}
                        <TouchableOpacity
                          onPress={() =>
                            router.push(`/edit-trip?tripId=${trip.id}`)
                          }
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 42,
                            zIndex: 10,
                            backgroundColor: isDark ? "#111" : "#eee",
                            padding: 6,
                            borderRadius: 20,
                          }}
                        >
                          <Pencil color="#3b82f6" size={18} />
                        </TouchableOpacity>

                        {/* Delete Button */}
                        <TouchableOpacity
                          onPress={() => deleteTrip(trip.id)}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 10,
                            backgroundColor: isDark ? "#111" : "#eee",
                            padding: 6,
                            borderRadius: 20,
                          }}
                        >
                          <Trash2 color="#ef4444" size={18} />
                        </TouchableOpacity>

                        {/* Trip Content */}
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: isDark ? "#fff" : "#111827",
                            marginBottom: 4,
                          }}
                        >
                          {trip.start} → {trip.destination}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: isDark ? "#aaa" : "#6b7280",
                            marginBottom: 4,
                          }}
                        >
                          {formatDateTime(trip.startDateTime)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: isDark ? "#ccc" : "#374151",
                          }}
                        >
                          Miles: {trip.miles} • Purpose: {trip.purpose}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: isDark ? "#ccc" : "#374151",
                          }}
                        >
                          Vehicle: {trip.vehicle} • Odometer:{" "}
                          {trip.startOdometer} → {trip.endOdometer}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#22c55e",
                            fontWeight: "bold",
                            marginTop: 4,
                          }}
                        >
                          Deduction: {formatCurrency(deduction)}
                        </Text>
                      </View>
                    );
                  })}
                  <Pressable
                    onPress={() => exportCSV(year, yearTrips)}
                    style={{
                      padding: 14,
                      backgroundColor: "#16a34a",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Export {year} to CSV
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
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
      </ScrollView>
    </View>
  );
}
