import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { membershipPlans, membershipPlansData } from "data/fakeData";
import { LinearGradient } from "expo-linear-gradient";

export default function Membership() {
  const [selectMembership, setSelectMembership] = useState("Basic");
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <ScrollView className="flex-1 px-6">
        {/*Heading */}
        <View className="h-16 flex-row justify-between items-center ">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={34}
              color="#57298D"
            />
          </TouchableOpacity>
          <Text className="text-purple-primary font-semibold text-2xl">
            Membership Benefits
          </Text>
          <Text className="w-[34px]" />
        </View>

        {/*Filter */}
        <View className="flex-row items-center justify-between my-8">
          <TouchableOpacity
            onPress={() => setSelectMembership("Basic")}
            className={`h-12 w-[33.3%] items-center justify-center ${selectMembership == "Basic" ? "bg-black" : "bg-white"} border border-black`}
          >
            <Text
              className={` ${selectMembership == "Basic" ? " text-white" : " text-black"} `}
            >
              Basic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectMembership("Monthly")}
            className={`h-12 w-[33.3%] items-center justify-center ${selectMembership == "Monthly" ? "bg-black" : "bg-white"} border-y border-black`}
          >
            <Text
              className={` ${selectMembership == "Monthly" ? " text-white" : " text-black"} `}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectMembership("Yearly")}
            className={`h-12 w-[33.3%] items-center justify-center ${selectMembership == "Yearly" ? "bg-black" : "bg-white"} border border-black`}
          >
            <Text
              className={` ${selectMembership == "Yearly" ? " text-white" : " text-black"} `}
            >
              Yearly
            </Text>
          </TouchableOpacity>
        </View>

        {/*Content */}
        <View className="flex-1 rounded-xl overflow-hidden border border-black">
          <LinearGradient
            colors={
              selectMembership === "Basic"
                ? ["#ffffff", "#ffffff"]
                : ["#4B164C30", "#4B164C"]
            }
            className="flex-1 rounded-xl overflow-hidden"
          >
            <View className="p-8">
              {/*Header info */}
              <View
                className={`gap-3 border-b ${selectMembership == "Basic" ? "border-gray-500" : "border-beige-primary/70"} pb-8`}
              >
                {membershipPlansData[selectMembership].info.tag && (
                  <Text className="bg-blue-300 p-1 rounded-lg self-start ">
                    {membershipPlansData[selectMembership].info.tag}
                  </Text>
                )}
                <Text className="bg-gray-200 text-black self-start p-2 px-4 rounded-xl font-semibold">
                  {membershipPlansData[selectMembership].info.name}
                </Text>
                <Text
                  className={`${selectMembership == "Basic" ? "text-black" : "text-beige-primary"}`}
                >
                  {membershipPlansData[selectMembership].info.description}
                </Text>
              </View>

              {/*Price */}
              <View
                className={`border-b ${selectMembership == "Basic" ? "border-gray-500" : "border-beige-primary/70"} py-8 pt-6 `}
              >
                <Text
                  className={`text-[60px] font-semibold ${selectMembership == "Basic" ? "text-black" : "text-beige-primary"}`}
                >
                  {membershipPlansData[selectMembership].info.price} đ
                </Text>
                <Text
                  className={`font-semibold ${selectMembership == "Basic" ? "text-black" : "text-beige-primary"}`}
                >
                  {membershipPlansData[selectMembership].info.rule}
                </Text>
              </View>

              {/*Benefits */}
              <View className="py-8 gap-4">
                {/*Single benefit */}
                {membershipPlansData[selectMembership].benefits.map(
                  (item, index) => (
                    <View key={index} className="flex-row items-center gap-3">
                      <AntDesign
                        name={
                          item.available == false
                            ? "closecircle"
                            : "checkcircle"
                        }
                        size={20}
                        color={
                          item.available == false
                            ? "red"
                            : selectMembership == "Basic"
                              ? "black"
                              : "#F1F3E7"
                        }
                      />
                      <Text
                        className={`font-medium ${selectMembership == "Basic" ? "text-black" : "text-beige-primary"}`}
                      >
                        {item.label}
                      </Text>
                      {item.tag && (
                        <Text className="bg-green-200 text-green-500 text-xs p-1 rounded-lg">
                          {item.tag}
                        </Text>
                      )}
                    </View>
                  )
                )}
              </View>

              {/*Button */}
              <View className="mt-2">
                <TouchableOpacity onPress={() => router.push("/membershipPayment/payment")}>
                  <Text
                    className={` ${selectMembership == "Basic" ? "bg-black text-white" : "bg-yellow-300/70 text-black"} text-center p-2 font-medium rounded-lg`}
                  >
                    Start free 14-days trial
                  </Text>
                </TouchableOpacity>
                <Text
                  className={`text-center mt-2 text-sm ${selectMembership == "Basic" ? " text-black" : " text-white"}`}
                >
                  No credit card required
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
