import { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome"); // sau splash thì đi đâu
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-xl font-bold text-blue-500">
        Buddy Verse Splash Screen
      </Text>
    </View>
  );
}
