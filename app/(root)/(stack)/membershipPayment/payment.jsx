import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import { AuthContext } from "@context/AuthContext";
import {
  createPaymentAPI,
  getSubscriptionPlanDetailAPI,
} from "@services/userSubscriptionService";

export default function Payment() {
  const [isChecked, setIsChecked] = useState(false);
  const { planId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [subscriptionDetail, setSubscriptionDetail] = useState(null);
  console.log("planId", planId);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const handleFetchSubscriptionDetail = async () => {
      try {
        setLoading(true);
        const res = await getSubscriptionPlanDetailAPI(planId);
        console.log("fetch res detail", res.data);
        setSubscriptionDetail(res?.data);
      } catch (error) {
        console.error("Fetch subscription failed:", error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchSubscriptionDetail();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await createPaymentAPI({
        accountId: userId,
        planId,
        paymentMethod: "Payos",
      });
      console.log("payment create res", res);

      if (res?.data?.checkoutUrl) {
        router.push({
          pathname: "/paymentQR",
          params: { url: res.data.checkoutUrl },
        });
      }
    } catch (error) {
      console.log("payment create err", error);
    }
  };

  const methodPayment = [
    // { title: "ATM Card", icon: require("@assets/icons/atm_card.png") },
    { title: "QR Code", icon: require("@assets/icons/qr_method.png") },
  ];

  const RadioButton = ({ select }) => {
    return (
      <View className="bg-yellow-200 border border-yellow-500 w-10 h-10 rounded-full justify-center items-center">
        <View className="bg-yellow-primary/80 w-7 h-7 rounded-full" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      {/*Heading */}
      <View className="px-6 h-16 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        </TouchableOpacity>
        <Text className="text-black font-semibold text-2xl">
          Phương thức thanh toán
        </Text>
        <AntDesign name="questioncircleo" size={24} color="black" />
      </View>
      <ScrollView className="flex-1 px-6">
        {/*Payment method */}
        <View className="mt-6">
          <Text className="text-black/70 text-lg">Payment Method</Text>
          {/*Payment method item */}
          <View className="mt-1">
            {methodPayment.map((item, index) => (
              <View
                key={index}
                className="items-center gap-4 flex-row border-b border-black py-4"
              >
                <View className="bg-yellow-100 w-14 h-14 rounded-2xl justify-center items-center">
                  <Image
                    source={item.icon}
                    className="w-10 h-10"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-black font-medium">{item.title}</Text>
                <View className="flex-1 items-end">
                  <RadioButton select={false} />
                </View>
              </View>
            ))}
            <View className="pt-4 items-center justify-between flex-row">
              <Text className="text-black font-medium text-lg">Other</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="black"
              />
            </View>
          </View>
        </View>

        {/*Payment detail */}
        <View className="mt-6">
          <Text className="text-black/70 text-lg">Payment Method</Text>

          <View className="flex-row items-start gap-4 mt-3">
            <View className="bg-white w-14 h-14 rounded-xl bg-yellow-200">
              <Image
                source={require("@assets/icons/member-card.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View>
              <Text className="font-semibold text-lg">
                {subscriptionDetail?.name}
              </Text>
              <Text className="text-yellow-primary font-semibold text-xl">
                {subscriptionDetail?.price?.toLocaleString()} đ
              </Text>
            </View>
            <View className="flex-1 items-end">
              <AntDesign name="close" size={20} color="black" />
            </View>
          </View>
        </View>

        {/*Accept checkbox */}
        <View className="flex-row items-center mt-6">
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            color={"black"}
          />
          <Text className="text-black ml-2">Agree with payment policy</Text>
        </View>

        {/*Accept BTN */}
        <TouchableOpacity
          disabled={!isChecked}
          onPress={handlePayment}
          className={`bg-yellow-primary py-3 rounded-xl items-center mt-8 ${
            isChecked ? "" : "opacity-50"
          }`}
        >
          <Text className="text-white-primary text-lg font-semibold">
            Payment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
