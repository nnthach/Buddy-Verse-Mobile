import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";

export default function LoadingCustom({ label }) {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0  flex-1 justify-center items-center bg-white-primary z-10">
      <View className="justify-center items-center">
        <View className="w-36 h-36 rounded-full border-4 border-yellow-primary mb-4 items-center justify-center">
          <ActivityIndicator
            size={"large"}
            color={"#FBD157"}
            className="scale-150"
          />
        </View>
        <Text className="font-bold text-yellow-primary text-2xl">{label}</Text>
        <View className="flex-row items-center gap-2">
          <Image
            source={require("@assets/icons/light_bulb.png")}
            className="w-3 h-3 mt-1"
          />
          <Text className="text-yellow-primary/50 text-sm mt-2">
            Pro tip: A clear profile photo gets 3x more connections!
          </Text>
        </View>
      </View>
    </View>
  );
}
