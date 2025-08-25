import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { fakeDataTransaction } from "data/fakeData";

export default function Payment() {
  const [transactionList, setTransactionList] = useState(fakeDataTransaction);

  const transactionItem = ({ item }) => {
    return (
      <View className="flex-row items-center gap-4">
        {/*Icon payment */}
        <View className="bg-purple-five w-14 h-14 rounded-2xl justify-center items-center">
          <Image
            source={require("@assets/icons/payment_card.png")}
            className="w-10 h-10"
            resizeMode="cover"
          />
        </View>
        {/*Name */}
        <View className="gap-1">
          <Text className="text-purple-primary font-semibold text-lg">
            {item.title}
          </Text>
          <Text className="text-gray-400 text-sm">{item.time}</Text>
        </View>
        {/*Money & status*/}
        <View className="flex-1 items-end gap-1">
          <Text className="text-purple-primary text-lg font-bold">
            {item.total.toLocaleString("vi-VN")}đ
          </Text>
          <Text
            className={`${item.status == "Success" ? "bg-green-success text-green-800" : "bg-red-500 text-red-200"} font-semibold px-2 py-1 text-xs rounded-full`}
          >
            {item.status}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <ScrollView
        className="flex-1 px-6 gap-6 space-y-6"
        showsVerticalScrollIndicator={false}
      >
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
            Payment
          </Text>
          <AntDesign name="questioncircleo" size={24} color="#57298D" />
        </View>

        {/*Info user */}
        <View className=" my-4">
          <View className="bg-blue-primary rounded-2xl">
            {/*Top */}
            <View className=" flex-row items-center justify-between p-2">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("@assets/icons/point.png")}
                  className="w-5 h-5"
                />
                <Text className="font-semibold text-xl text-purple-primary">
                  6,868 Pts
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text className="text-purple-primary/50 text-md">History</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="rgba(87,41,141,0.5)"
                />
              </View>
            </View>
            {/*Content */}
            <View className="bg-purple-five rounded-2xl p-4">
              {/*Avatar */}
              <View className="mt-6 justify-center items-center">
                <Image
                  source={{
                    uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
                  }}
                  className="w-32 h-32 rounded-full"
                  resizeMode="cover"
                />
                <Text className="text-xl text-purple-primary font-semibold mt-3 mb-1">
                  Nguyen Ngoc Thach
                </Text>
              </View>
              {/*Membership */}
              <View className="bg-white/70 flex-row items-center justify-between p-2 px-4 my-3 rounded-full">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require("@assets/icons/crown_membership.png")}
                    className="w-6 h-6"
                    resizeMode="cover"
                  />
                  <Text className="text-purple-primary font-medium">
                    Premium Member
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() =>
                      router.push(
                        "/(root)/(stack)/membershipPayment/membership"
                      )
                    }
                  >
                    <Text className="text-gray-400 text-md">See benefits</Text>
                  </TouchableOpacity>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={20}
                    color="#9ca3af"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/*Recent transactions*/}
        <View className="bg-blue-primary rounded-2xl p-4 mb-10">
          <Text className="text-xl text-blue-500 font-semibold">
            Recent transactions
          </Text>
          <View className="mt-4">
            <FlatList
              data={transactionList.slice(0, 5)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={transactionItem}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className="h-4" />}
            />
          </View>
          <Text className="text-center border border-purple-primary self-center p-2 rounded-full text-purple-primary font-medium mt-4">
            View More
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
