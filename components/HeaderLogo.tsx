import { Image, View, Text } from "react-native";
import { useTheme } from "../app/context/ThemeContext";

export default function HeaderLogo() {
  const { theme } = useTheme();

  const isDark = theme === "dark";
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32,
        marginBottom: 24,
      }}
    >
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 70, height: 70, resizeMode: "contain" }}
      />
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: isDark ? "#fff" : "#1c1c1e",
          marginLeft: 16,
        }}
      >
        MileBird
      </Text>
    </View>
  );
}
