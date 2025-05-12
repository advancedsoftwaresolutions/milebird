import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Option = { label: string; value: string };

type Props = {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: Option[];
  hasError?: boolean;
  isDark: boolean; // ✅ passed in instead of using useTheme
};

export default function FormSelectField({
  label,
  selectedValue,
  onValueChange,
  options,
  hasError = false,
  isDark,
}: Props) {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || "Select";

  const borderColor = hasError ? "#ef4444" : isDark ? "#3a3a3c" : "#d1d5db";

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

      <Pressable
        onPress={() => setVisible(true)}
        style={{
          borderWidth: 1,
          borderColor,
          backgroundColor: isDark ? "#2c2c2e" : "#f9fafb",
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: selectedValue ? (isDark ? "#fff" : "#000") : "#888",
          }}
        >
          {selectedLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={isDark ? "#aaa" : "#666"}
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          onPress={() => setVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "#00000088",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#1c1c1e" : "#fff",
              paddingTop: 12,
              paddingBottom: 32,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        item.value === selectedValue
                          ? "#007aff"
                          : isDark
                          ? "#fff"
                          : "#000",
                      fontWeight: item.value === selectedValue ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
