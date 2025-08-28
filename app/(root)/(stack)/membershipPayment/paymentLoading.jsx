import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";

export default function PaymentLoading() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/membershipPayment/paymentResult");
    }, 2000);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-beige-primary">
      <View className="justify-center items-center">
        <View className="w-36 h-36 rounded-full border-4 border-purple-primary mb-4 items-center justify-center">
          <ActivityIndicator
            size={"large"}
            color={"#57298D"}
            className="scale-150"
          />
        </View>
        <Text className="font-bold text-purple-primary text-2xl">
          Purchase Loading...
        </Text>
        <View className="flex-row items-center gap-2">
          <Image
            source={require("@assets/icons/light_bulb.png")}
            className="w-3 h-3 mt-1"
          />
          <Text className="text-purple-primary/50 text-sm mt-2">
            Pro tip: A clear profile photo gets 3x more connections!
          </Text>
        </View>
      </View>
    </View>
  );
}
