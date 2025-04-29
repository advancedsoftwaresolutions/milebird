import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import HeaderLogo from "../components/HeaderLogo";

export default function HistoryScreen() {
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
          Trip History
        </Text>
        <Button title="Back to Home" onPress={() => router.replace("/home")} />
      </View>
    </View>
  );
}
