import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

type Trip = {
  start: string;
  destination: string;
  purpose: string;
  vehicle: string;
  startOdometer: string;
  endOdometer: string;
  miles: string;
  date: string;
};

export default function HistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [trips, setTrips] = useState<Trip[]>([]);
  const [mileageRate, setMileageRate] = useState<number>(0.0);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("trips");
      if (data) {
        setTrips(JSON.parse(data));
      }
      const savedRate = await AsyncStorage.getItem("mileageRate");
      if (savedRate) {
        setMileageRate(parseFloat(savedRate));
      }
    })();
  }, []);

  const calculateDeduction = (miles: string) => {
    const milesNum = parseFloat(miles);
    if (isNaN(milesNum) || isNaN(mileageRate)) return "-";
    return (milesNum * mileageRate).toFixed(2);
  };

  const totalMiles = trips.reduce(
    (sum, trip) => sum + parseFloat(trip.miles || "0"),
    0
  );
  const totalDeduction = (totalMiles * mileageRate).toFixed(2);

  const exportCSV = async () => {
    const header =
      "Start,Destination,Purpose,Vehicle,Start Odometer,End Odometer,Miles,Date\n";
    const rows = trips.map((trip) =>
      [
        trip.start,
        trip.destination,
        trip.purpose,
        trip.vehicle,
        trip.startOdometer,
        trip.endOdometer,
        trip.miles,
        trip.date,
      ]
        .map((field) => `"${field}"`) // Quote fields
        .join(",")
    );
    const csv = header + rows.join("\n");

    const fileUri = FileSystem.cacheDirectory + "trips.csv";
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "text/csv",
      dialogTitle: "Export Trip History",
      UTI: "public.comma-separated-values-text",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000" : "#f2f2f7" }}>
      <HeaderLogo />

      <ScrollView style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        {/* Title */}
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

        {/* Section Heading */}
        <Text
          style={{
            fontSize: 13,
            color: isDark ? "#8e8e93" : "#6e6e73",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 1,
            paddingLeft: 4,
          }}
        >
          Your Trips
        </Text>

        {/* Grouped Card */}
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
          {trips.length === 0 ? (
            <View style={{ paddingVertical: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: isDark ? "#888" : "#6b7280",
                  textAlign: "center",
                }}
              >
                No trips logged yet.
              </Text>
            </View>
          ) : (
            trips.map((trip, idx) => (
              <View
                key={idx}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderBottomWidth: idx !== trips.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? "#2c2c2e" : "#e5e7eb",
                }}
              >
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
                  {trip.date}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#ccc" : "#374151",
                    marginBottom: 2,
                  }}
                >
                  Miles: {trip.miles} • Purpose: {trip.purpose}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#ccc" : "#374151",
                    marginBottom: 2,
                  }}
                >
                  Vehicle: {trip.vehicle}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#ccc" : "#374151",
                  }}
                >
                  Odometer: {trip.startOdometer} → {trip.endOdometer}
                </Text>

                {/* 💵 Deduction */}
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#34d399" : "#059669",
                    marginTop: 6,
                    fontWeight: "600",
                  }}
                >
                  Trip Deduction: ${calculateDeduction(trip.miles)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Total Miles and Deduction */}
        {trips.length > 0 && (
          <View
            style={{
              backgroundColor: isDark ? "#1c1c1e" : "#fff",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 32,
              borderWidth: 1,
              borderColor: isDark ? "#2c2c2e" : "#e5e7eb",
              padding: 16,
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#fff" : "#111827",
                marginBottom: 8,
              }}
            >
              Summary
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? "#ccc" : "#374151",
                marginBottom: 4,
              }}
            >
              Total Miles: {totalMiles.toFixed(1)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? "#34d399" : "#059669",
              }}
            >
              Total Deduction: ${totalDeduction}
            </Text>
          </View>
        )}

        {/* Actions Section */}
        <Text
          style={{
            fontSize: 13,
            color: isDark ? "#8e8e93" : "#6e6e73",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 1,
            paddingLeft: 4,
          }}
        >
          Actions
        </Text>

        {/* Grouped Actions */}
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
            onPress={exportCSV}
            style={{
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: isDark ? "#2c2c2e" : "#e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#007aff",
              }}
            >
              Export Trips as CSV
            </Text>
          </Pressable>

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
    </View>
  );
}
