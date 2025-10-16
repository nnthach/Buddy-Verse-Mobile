import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { getSubscriptionPlanAPI } from "@services/userSubscriptionService";
import useQuery from "hooks/useQuery";

export default function Membership() {
  const { query, updateQuery, resetQuery } = useQuery({
    name: "Cơ bản",
  });

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearchName = (data) => {
    updateQuery({ name: data });
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const res = await getSubscriptionPlanAPI(query);
        console.log("fetch res", res.data);
        setSubscription(res?.data[0]);
      } catch (error) {
        console.error("Fetch subscription failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      {/*Heading */}
      <View className="px-6 h-16 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        </TouchableOpacity>
        <Text className="text-black font-semibold text-2xl">
          Membership Benefits
        </Text>
        <Text className="w-[34px]" />
      </View>

      {/*Co */}
      <ScrollView className="flex-1 px-6">
        {/*Filter */}
        <View className="flex-row items-center justify-between my-8">
          <TouchableOpacity
            onPress={() => handleSearchName("Cơ bản")}
            className={`h-12 w-[33.3%] items-center justify-center ${query.name == "Cơ bản" ? "bg-black" : "bg-white-primary"} border border-black`}
          >
            <Text
              className={` ${query.name == "Cơ bản" ? "text-white-primary" : " text-black"} `}
            >
              Cơ bản
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchName("Cao cấp")}
            className={`h-12 w-[33.3%] items-center justify-center ${query.name == "Cao cấp" ? "bg-black" : "bg-white"} border-y border-black`}
          >
            <Text
              className={` ${query.name == "Cao cấp" ? "text-white-primary" : " text-black"} `}
            >
              Cao cấp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchName("Theo năm")}
            className={`h-12 w-[33.3%] items-center justify-center ${query.name == "Theo năm" ? "bg-black" : "bg-white"} border border-black`}
          >
            <Text
              className={` ${query.name == "Theo năm" ? "text-white-primary" : " text-black"} `}
            >
              Theo năm
            </Text>
          </TouchableOpacity>
        </View>

        {/*Content */}
        <View className="flex-1 rounded-xl overflow-hidden border border-black">
          <LinearGradient
            colors={
              query.name === "Cơ bản"
                ? ["#ffffff", "#ffffff"]
                : ["#4B164C30", "#4B164C"]
            }
            className="flex-1 rounded-xl overflow-hidden"
          >
            <View className="p-8">
              {/*Header info */}
              <View
                className={`gap-3 border-b ${query.name == "Cơ bản" ? "border-gray-500" : "border-white-primary/70"} pb-8`}
              >
                {query.name != "Cơ bản" && (
                  <Text className="bg-blue-300 p-1 rounded-lg self-start ">
                    Phổ biến
                  </Text>
                )}
                <Text
                  className={`${query.name == "Cơ bản" ? "bg-black text-white-primary" : "bg-white-primary text-black"} self-start p-2 px-4 rounded-xl font-semibold`}
                >
                  {subscription?.name}
                </Text>
                <Text
                  className={`${query.name == "Cơ bản" ? "text-black" : "text-white-primary"}`}
                >
                  {subscription?.description}
                </Text>
              </View>

              {/*Price */}
              <View
                className={`border-b ${query.name == "Cơ bản" ? "border-gray-500" : "border-white-primary/70"} py-8 pt-6 `}
              >
                <Text
                  className={`text-[55px] font-semibold ${query.name == "Cơ bản" ? "text-black" : "text-white-primary"}`}
                >
                  {subscription?.price?.toLocaleString()}đ
                </Text>
                <Text
                  className={`font-semibold ${query.name == "Cơ bản" ? "text-black" : "text-white-primary"}`}
                >
                  For everyone
                </Text>
              </View>

              {/*Benefits */}
              <View className="py-8 gap-4">
                {/*Single benefit */}
                {subscription?.planFeatures?.map((item, index) => (
                  <View key={index} className="flex-row items-center gap-3">
                    <AntDesign
                      name={
                        item?.isEnabled == false ? "closecircle" : "checkcircle"
                      }
                      size={20}
                      color={
                        item?.isEnabled == false
                          ? "red"
                          : query.name == "Cơ bản"
                            ? "black"
                            : "white"
                      }
                    />
                    <Text
                      className={`font-medium ${query.name == "Cơ bản" ? "text-black" : "text-white-primary"}`}
                    >
                      {item?.feature?.name}
                    </Text>
                  </View>
                ))}
              </View>

              {/*Button */}
              <View className="mt-2">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/membershipPayment/payment",
                      params: { planId: subscription?.planId },
                    })
                  }
                >
                  <Text
                    className={` ${query.name == "Cơ bản" ? "bg-black text-white-primary" : "bg-yellow-300/70 text-white-primary"} text-center p-2 font-medium rounded-lg`}
                  >
                    Đăng ký ngay
                  </Text>
                </TouchableOpacity>
                <Text
                  className={`text-center mt-2 text-sm ${query.name == "Cơ bản" ? " text-black" : "text-white-primary"}`}
                >
                  Không cần thẻ
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
