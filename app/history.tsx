import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Haptics from "expo-haptics";
import { useTheme } from "./context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

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
  tripType?: string;
};

const IRS_RATES: Record<string, number> = {
  Business: 0.7,
  Medical: 0.21,
  Moving: 0.21,
  Charitable: 0.14,
};

export default function HistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const data = await AsyncStorage.getItem("trips");
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

  const groupByYear = (trips: Trip[]) => {
    const map: { [year: string]: Trip[] } = {};
    trips.forEach((trip) => {
      const year = new Date(trip.startDateTime).getFullYear().toString();
      if (!map[year]) map[year] = [];
      map[year].push(trip);
    });
    return map;
  };

  const getRateForType = (type?: string): number => {
    const normalized = type?.toLowerCase() ?? "";
    if (normalized === "business") return IRS_RATES["Business"];
    if (normalized === "medical") return IRS_RATES["Medical"];
    if (normalized === "moving") return IRS_RATES["Moving"];
    if (normalized === "charitable") return IRS_RATES["Charitable"];
    return IRS_RATES["Business"];
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

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
      "Trip Type",
      "Deduction",
    ];
    const rows = trips.map((trip) => {
      const miles = parseFloat(trip.miles);
      const rate = getRateForType(trip.tripType);
      const deduction = isNaN(miles) ? 0 : miles * rate;
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
        trip.tripType || "Business",
        deduction.toFixed(2),
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");

    if (Platform.OS === "web") {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `trips_${year}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const fileUri = FileSystem.documentDirectory + `trips_${year}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv);
      await Sharing.shareAsync(fileUri);
    }
  };

  const tripsByYear = groupByYear(trips);

  const TripRow = ({ trip }: { trip: Trip }) => {
    const anim = useRef(new Animated.Value(0)).current;
    const rate = getRateForType(trip.tripType);
    const deduction = parseFloat(trip.miles) * rate || 0;

    const handlePress = () => {
      if (Platform.OS !== "web") Haptics.selectionAsync();
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 6,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.push(`/edit-trip?tripId=${trip.id}`);
      });
    };

    return (
      <Pressable
        onPress={handlePress}
        android_ripple={{ color: isDark ? "#333" : "#ccc" }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#d1fae5",
              borderRadius: 999,
              padding: 10,
              marginRight: 16,
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.3,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            }}
          >
            <Ionicons name="car" size={18} color="#1f2937" />
          </View>

          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#fff" : "#111827",
              }}
            >
              {trip.start} → {trip.destination}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: isDark ? "#aaa" : "#6b7280",
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
              {trip.miles} mi · {trip.tripType || "Business"} · {trip.vehicle}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#22c55e",
                fontWeight: "bold",
              }}
            >
              Deduction: {formatCurrency(deduction)}
            </Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ translateX: anim }] }}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#9fa1a6" : "#2C3E50"}
          />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#000" : "#F4D35E" }}
    >
      <ScrollView style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <HeaderLogo />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: isDark ? "#fff" : "#2C3E50",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Trip History
        </Text>

        {Object.entries(tripsByYear)
          .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
          .map(([year, yearTrips]) => {
            const total = yearTrips.reduce((sum, t) => {
              const m = parseFloat(t.miles);
              const rate = getRateForType(t.tripType);
              return sum + (isNaN(m) ? 0 : m * rate);
            }, 0);

            return (
              <View key={year} style={{ marginBottom: 32 }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: isDark ? "#8e8e93" : "#2C3E50",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {year} — Total Deduction:
                  <Text style={{ color: "#22c55e", fontWeight: "600" }}>
                    {" "}
                    {formatCurrency(total)}
                  </Text>
                </Text>

                <View
                  style={{
                    backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark ? "#2c2c2e" : "#2C3E50",
                    overflow: "hidden",
                  }}
                >
                  {yearTrips.map((trip) => (
                    <TripRow key={trip.id} trip={trip} />
                  ))}

                  <Pressable
                    onPress={() => exportCSV(year, yearTrips)}
                    style={{
                      backgroundColor: "#16a34a",
                      paddingVertical: 14,
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

        <View
          style={{
            padding: 16,
            backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: isDark ? "#2c2c2e" : "#2C3E50",
            shadowColor: "#000",
            shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
          }}
        >
          <Pressable
            onPress={() => router.replace("/home")}
            style={{ padding: 16, alignItems: "center" }}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
