import { Image, View, Text } from "react-native";
import React from "react";

type Props = {
  isDark: boolean;
};

function HeaderLogo({ isDark }: Props) {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32,
        marginBottom: 24,
      }}
    >
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 80, height: 80, marginLeft: 20, resizeMode: "contain" }}
      />
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: isDark ? "#EE6C4D" : "#2C3E50",
        }}
      >
        Mile Monkey
      </Text>
    </View>
  );
}

export default React.memo(HeaderLogo); // ✅ optional but recommended
