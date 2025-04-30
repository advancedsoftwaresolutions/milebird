import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  useColorScheme,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

type DateTimeFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

export default function DateTimeField({
  label,
  value,
  onChange,
}: DateTimeFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const isDark = useColorScheme() === "dark";

  const formatted = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);

  const baseTextColor = isDark ? "#e5e5ea" : "#374151";
  const baseBorderColor = isDark ? "#3a3a3c" : "#d1d5db";
  const baseBackground = isDark ? "#2c2c2e" : "#f9fafb";
  const labelColor = isDark ? "#8e8e93" : "#6e6e73";

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
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            color: labelColor,
            fontSize: 14,
            fontWeight: "500",
          }}
        >
          {label}
        </Text>

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
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 14,
            fontSize: 16,
            borderWidth: 1,
            borderColor: baseBorderColor,
            color: baseTextColor,
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
              borderRadius: 10,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: baseBorderColor,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
