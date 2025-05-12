import { useState } from "react";
import { View, Text, Pressable, TextInput, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

type DateTimeFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  isDark: boolean; // ✅ passed from parent
};

export default function DateTimeField({
  label,
  value,
  onChange,
  isDark,
}: DateTimeFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatted = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);

  const baseTextColor = isDark ? "#ffffff" : "#1c1c1e";
  const baseBorderColor = isDark ? "#2c2c2e" : "#2C3E50";
  const baseBackground = isDark ? "#1c1c1e" : "#f9fafb";
  const labelColor = isDark ? "#9ca3af" : "#6b7280";

  const handleNow = () => {
    const now = new Date();
    onChange(now);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="time-outline"
            size={16}
            color={labelColor}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: labelColor,
            }}
          >
            {label}
          </Text>
        </View>

        <Pressable onPress={handleNow}>
          <Text
            style={{
              fontSize: 13,
              color: "#007aff",
              fontWeight: "500",
            }}
          >
            Now
          </Text>
        </Pressable>
      </View>

      {Platform.OS === "web" ? (
        <TextInput
          value={formatted}
          onChangeText={(text) => {
            const parsed = new Date(text);
            if (!isNaN(parsed.getTime())) onChange(parsed);
          }}
          style={{
            backgroundColor: baseBackground,
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: baseBorderColor,
            color: baseTextColor,
            fontWeight: "500",
          }}
          placeholder="Enter date/time"
          placeholderTextColor={isDark ? "#666" : "#aaa"}
        />
      ) : (
        <>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={{
              backgroundColor: baseBackground,
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: baseBorderColor,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "ios" ? 0.05 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Text
              style={{
                color: baseTextColor,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              {formatted}
            </Text>

            <Ionicons
              name="calendar-outline"
              size={20}
              color={isDark ? "#aaa" : "#6b7280"}
            />
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={value}
              mode="datetime"
              display="default"
              themeVariant={isDark ? "dark" : "light"}
              onChange={(_, date) => {
                setShowPicker(false);
                if (date) onChange(date);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}
