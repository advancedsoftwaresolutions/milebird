import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import HeaderLogo from '../components/HeaderLogo';

export default function NewTripScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <HeaderLogo />
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-black mb-6">Log New Trip</Text>
        <Button title="Save Trip" onPress={() => router.replace('/home')} />
      </View>
    </View>
  );
}