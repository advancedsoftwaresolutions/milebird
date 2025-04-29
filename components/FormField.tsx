// components/FormField.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Platform } from "react-native";
import { useTheme } from "../app/context/ThemeContext";

type Props = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "decimal-pad";
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  editable = true,
  onFocus,
  onBlur,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = isFocused ? "#007aff" : isDark ? "#3a3a3c" : "#d1d5db";

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: isDark ? "#e5e5ea" : "#374151",
          marginBottom: 6,
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={isDark ? "#999" : "#aaa"}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        style={{
          borderWidth: 1,
          borderColor,
          backgroundColor: isDark ? "#2c2c2e" : "#f9fafb",
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 16,
          fontSize: 16,
          color: isDark ? "#fff" : "#111827",
          shadowColor: "#000",
          shadowOpacity: isFocused ? 0.05 : 0,
          shadowRadius: isFocused ? 4 : 0,
          shadowOffset: { width: 0, height: 2 },
        }}
      />
    </View>
  );
}
