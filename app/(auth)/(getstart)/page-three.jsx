import { View, Text, SafeAreaView, Dimensions, Image } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import FooterGetStart from "../../../components/FooterGetStart";

export default function GetStartThreeScreen() {
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 bg-beige-primary ">
        {/*Heading */}
        <View className="mt-8 px-8">
          <Text className="text-[38px] text-purple-secondary font-bold">
            What we have here in
          </Text>
          <Text className="text-xl text-purple-secondary/70">buddyverse.</Text>
        </View>

        {/*Content */}
        <View
          className="my-auto pb-8 items-center px-8"
          style={{ width: screenWidth }}
        >
          <View className="bg-white rounded-xl w-full h-[450px] p-6">
            {/*heading */}
            <View className="flex-row gap-4">
              <Image
                source={require("@assets/images/applogo.png")}
                className="w-12 h-12 rounded-full"
              />
              <View>
                <Text className="text-yellow-primary font-semibold text-lg">
                  Buddy Verse
                </Text>
                <Text className="text-sm text-gray-500 mt-[-2px]">
                  #feeldeeperlivetruer
                </Text>
              </View>
            </View>

            {/*img */}
            <View className="w-full bg-red-500 h-[300px] my-6 rounded-xl overflow-hidden">
              <Image
                source={require("@assets/images/getstartthree.png")}
                className="w-full h-full"
              />
            </View>

            <Text className="text-center text-purple-third font-semibold">
              Let's explore more features!!!
            </Text>
          </View>
        </View>

        {/*Footer */}
        <View className="px-8">
          <FooterGetStart
            pageIndex={2}
            back={"/page-two"}
            next={"/page-four"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
