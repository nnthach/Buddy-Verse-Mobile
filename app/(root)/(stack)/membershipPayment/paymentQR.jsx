import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { getPaymentAPI } from "@services/userSubscriptionService";

export default function PaymentQR() {
  const { url, orderCode } = useLocalSearchParams();

  const handleGetPayment = async () => {
    try {
      const res = await getPaymentAPI(orderCode);

      if (res?.data?.data.status !== "PENDING") {
        router.push({
          pathname: "/(stack)/membershipPayment/paymentResult",
          params: {
            orderCode: orderCode,
          },
        });
      }
    } catch (error) {
      console.log("get payment err", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        handleGetPayment();
      }, 5000);

      return () => clearInterval(interval);
    }, [orderCode])
  );

  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      {/*Heading */}
      <View className="px-6 h-16 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        </TouchableOpacity>
        <Text className="text-black font-semibold text-2xl">Thanh toán</Text>
        <MaterialIcons name="keyboard-arrow-left" size={34} color="white" />
      </View>
      <WebView source={{ uri: url }} className="flex-1" />
    </SafeAreaView>
  );
}
