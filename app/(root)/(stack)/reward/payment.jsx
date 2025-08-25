import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Payment() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
      {/*Heading */}
      <View className="h-16 flex-row justify-between items-center px-6">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="#57298D" />
        </TouchableOpacity>
        <Text className="text-purple-primary font-semibold text-2xl">
          Payment
        </Text>
        <AntDesign name="questioncircleo" size={24} color="#57298D" />
      </View>

      {/*Info user */}
      <View className="px-6 my-4">
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
                <Text className="text-gray-400 text-md">See benefit</Text>
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
    </SafeAreaView>
  );
}
