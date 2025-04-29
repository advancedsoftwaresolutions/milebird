import { Image, View } from "react-native";

export default function HeaderLogo() {
  return (
    <View style={{ alignItems: "center", marginTop: 32, marginBottom: 24 }}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 120, height: 120, resizeMode: "contain" }}
      />
    </View>
  );
}
