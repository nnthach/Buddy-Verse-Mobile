import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { getPaymentAPI } from "@services/userSubscriptionService";
import { AuthContext } from "@context/AuthContext";

export default function PaymentResult() {
  const { orderCode } = useLocalSearchParams();
  const { userInfo } = useContext(AuthContext);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetPayment = async () => {
    setIsLoading(true);
    try {
      const res = await getPaymentAPI(orderCode);

      setOrderData(res.data.data);
    } catch (error) {
      console.log("get payment err", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetPayment();
  }, [orderCode]);

  const orderContent = [
    {
      label: "Transaction Date",
      value: orderData?.createdAt
        ? new Date(orderData.createdAt)
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(",", "")
        : "-",
    },
    { label: "Payment Method", value: orderData?.paymentMethod },
    // { label: "Payment Account", value: orderData?.accountId },
    { label: "Content", value: orderData?.planName },
    { label: "Total", value: orderData?.amount?.toLocaleString("vi-VN") },
  ];

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      <View className="flex-1 w-full px-6 justify-center items-center">
        <View
          className={`${orderData?.status !== "SUCCESS" ? "bg-red-500" : "bg-green-success"} self-center w-28 h-28 rounded-full items-center justify-center mb-4`}
        >
          <AntDesign
            name={
              orderData?.status !== "SUCCESS" ? "close-circle" : "checkcircle"
            }
            size={60}
            color="white"
          />
        </View>
        <Text className="text-2xl text-black font-semibold">
          {orderData?.status !== "SUCCESS"
            ? "Payment Failed"
            : "Payment Completed"}
        </Text>
        {orderData?.status == "SUCCESS" && (
          <>
            <Text className="text-black">Order #{orderData?.paymentId}</Text>
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
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>

              {/*User */}
              <View className="mt-10 flex-row gap-2">
                <Image
                  source={
                    userInfo?.avatarUrl
                      ? { uri: userInfo?.avatarUrl }
                      : require("@assets/images/avatar.png")
                  }
                  className="w-11 h-11 rounded-full border border-black bg-white-primary"
                  resizeMode="cover"
                />
                <View>
                  <Text className="text-black font-medium">
                    {userInfo?.lastname} {userInfo?.firstname}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    #{userInfo?.accountId}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

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
