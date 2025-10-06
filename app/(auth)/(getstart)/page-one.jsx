import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import FooterGetStart from "../../../components/FooterGetStart";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function GetStartOneScreen() {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <View className="flex-1 bg-gray-200">
        {/*wrap */}
        <View className="relative items-center flex-1">
          <Image
            source={require("@assets/images/applogo.png")}
            style={{
              width: screenWidth,
              height: screenWidth,
              position: "absolute",
            }}
            resizeMode="cover"
          />

          {/*Content */}
          <View
            className="absolute bg-white-primary rounded-xl p-10 w-[350px] h-[320px] justify-center items-center border border-yellow-secondary"
            style={{ bottom: screenHeight * 0.15 }}
          >
            <Text className="text-yellow-secondary text-[38px] font-bold">
              Buddy Verse
            </Text>
            <Text className="text-center text-gray-500 text-lg mb-10 mt-8">
              "Welcome to Buddy Verse - Real connections, real friendships.
              Where every conversation matters."
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/page-two")}
              className="bg-yellow-primary w-full rounded-full p-3 items-center"
            >
              <Text className="text-white-primary text-lg font-semibold">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
