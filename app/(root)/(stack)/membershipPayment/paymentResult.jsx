import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

export default function PaymentResult() {
  const [orderData, setOrderData] = useState({
    transactionData: "23:29, 16/0/2025",
    paymentMethod: "VNPAY",
    paymentAccount: "Khoa",
    content: "PREMIUMMONTHLY",
    total: 49000,
  });

  const orderContent = [
    { label: "Transaction Date", value: orderData?.transactionData },
    { label: "Payment Method", value: orderData?.paymentMethod },
    { label: "Payment Account", value: orderData?.paymentAccount },
    { label: "Content", value: orderData?.content },
    { label: "Total", value: orderData?.total.toLocaleString("vi-VN") },
  ];
  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      <View className="flex-1 w-full px-6 justify-center items-center">
        <View className="bg-green-success self-center w-28 h-28 rounded-full items-center justify-center mb-4">
          <AntDesign name="checkcircle" size={60} color="white" />
        </View>
        <Text className="text-2xl text-black font-semibold">
          Payment Completed
        </Text>
        <Text className="text-black">Order #NVQFGFJG8</Text>
        {/*Content */}
        <View className="w-full bg-white rounded-xl border-2 border-black p-6 py-8 mt-4">
          <View className="gap-3">
            {orderContent.map((item, index) => (
              <View
                key={index}
                className="items-center justify-between flex-row"
              >
                <Text className="text-md black">{item.label}</Text>
                <Text className="text-lg font-semibold black">
                  {item.value} VND
                </Text>
              </View>
            ))}
          </View>

          {/*User */}
          <View className="mt-10 flex-row gap-2">
            <Image
              source={{
                uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
              }}
              className="w-11 h-11 rounded-full border border-black"
              resizeMode="cover"
            />
            <View>
              <Text className="text-black font-medium">Khoa</Text>
              <Text className="text-sm text-gray-500">#345345345</Text>
            </View>
          </View>
        </View>

        <View className="mt-10 w-full">
          <TouchableOpacity
            onPress={() => router.replace("/(root)/(tabs)/home")}
            className="bg-yellow-primary py-4 px-6 rounded-full w-full"
          >
            <Text className="text-white-primary text-xl font-medium text-center">
              Return Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
