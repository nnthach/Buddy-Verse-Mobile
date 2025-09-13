import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";

export default function Payment() {
  const [selectMethod, setSelectMethod] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const methodPayment = [
    { title: "ATM Card", icon: require("@assets/icons/atm_card.png") },
    { title: "QR Code", icon: require("@assets/icons/qr_method.png") },
  ];

  const RadioButton = ({ select }) => {
    return (
      <View className="bg-purple-200 border border-purple-500 w-10 h-10 rounded-full justify-center items-center">
        <View className="bg-purple-primary/80 w-7 h-7 rounded-full" />
      </View>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <ScrollView className="flex-1 px-6">
        {/*Heading */}
        <View className="h-16 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={34}
              color="#57298D"
            />
          </TouchableOpacity>
          <Text className="text-purple-primary font-semibold text-2xl">
            Payment
          </Text>
          <AntDesign name="questioncircleo" size={24} color="#57298D" />
        </View>

        {/*Payment method */}
        <View className="mt-6">
          <Text className="text-purple-primary/70 text-lg">Payment Method</Text>
          {/*Payment method item */}
          <View className="mt-1">
            {methodPayment.map((item, index) => (
              <View
                key={index}
                className="items-center gap-4 flex-row border-b border-purple-secondary py-4"
              >
                <View className="bg-purple-third w-14 h-14 rounded-2xl justify-center items-center">
                  <Image
                    source={item.icon}
                    className="w-10 h-10"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-purple-third font-medium">
                  {item.title}
                </Text>
                <View className="flex-1 items-end">
                  <RadioButton select={false} />
                </View>
              </View>
            ))}
            <View className="pt-4 items-center justify-between flex-row">
              <Text className="text-purple-third font-medium text-lg">
                Other
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="#57298D"
              />
            </View>
          </View>
        </View>

        {/*Payment detail */}
        <View className="mt-6">
          <Text className="text-purple-primary/70 text-lg">Payment Method</Text>

          <View className="flex-row items-start gap-4 mt-3">
            <View className="bg-white w-14 h-14 rounded-xl"></View>
            <View>
              <Text className="font-semibold text-lg">Basic Membership</Text>
              <Text className="text-purple-primary font-semibold text-xl">
                29,999 đ
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
            color={"#57298D"}
          />
          <Text className="text-purple-primary ml-2">
            Agree with payment policy
          </Text>
        </View>

        {/*Accept BTN */}
        <TouchableOpacity
          disabled={!isChecked}
          onPress={() =>
            router.replace({
              pathname: "/membershipPayment/paymentLoading",
              params: {
                label: "Purchase Loading...",
                next: "/membershipPayment/paymentResult",
              },
            })
          }
          className={`bg-purple-primary py-3 rounded-xl items-center mt-8 ${
            isChecked ? "" : "opacity-50"
          }`}
        >
          <Text className="text-white text-lg font-semibold">Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
