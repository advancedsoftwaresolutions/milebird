import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <HeaderLogo />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "black",
            marginBottom: 24,
          }}
        >
          MileBird Home
        </Text>
        <Button title="Log New Trip" onPress={() => router.push("/new-trip")} />
        <View style={{ height: 16 }} />
        <Button
          title="View Trip History"
          onPress={() => router.push("/history")}
        />
      </View>
    </View>
  );
}
