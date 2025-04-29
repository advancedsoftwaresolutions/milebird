import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";

type Trip = {
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

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("trips");
      if (data) {
        setTrips(JSON.parse(data));
      }
    })();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // adjust as needed for your preferred format
  };

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

        {/* Section Heading */}
        <Text
          style={{
            fontSize: 13,
            color: isDark ? "#8e8e93" : "#6e6e73",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 1,
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

                {/* Show Start and End Times */}
                {trip.startDateTime && trip.endDateTime ? (
                  trip.startDateTime === trip.endDateTime ? (
                    <Text
                      style={{
                        fontSize: 13,
                        color: isDark ? "#aaa" : "#6b7280",
                        marginBottom: 4,
                      }}
                    >
                      {formatDateTime(trip.startDateTime)}
                    </Text>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: 13,
                          color: isDark ? "#aaa" : "#6b7280",
                          marginBottom: 2,
                        }}
                      >
                        Start: {formatDateTime(trip.startDateTime)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: isDark ? "#aaa" : "#6b7280",
                          marginBottom: 4,
                        }}
                      >
                        End: {formatDateTime(trip.endDateTime)}
                      </Text>
                    </>
                  )
                ) : null}

                {/* Trip Details */}
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
                  Vehicle: {trip.vehicle} • Odometer: {trip.startOdometer} →{" "}
                  {trip.endOdometer}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Section Heading */}
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

        {/* Grouped Button */}
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
