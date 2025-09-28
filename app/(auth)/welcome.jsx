import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 items-center justify-center pb-10">
        <Image
          source={require("../../assets/images/robotmascot.png")}
          style={{ width: 170, height: 239 }}
          resizeMode="cover"
        />
        <View>
          <Text className="text-5xl font-black text-purple-primary mt-4">
            buddyverse.
          </Text>
          <Text className="text-base text-purple-primary/70">
            feel deeper live truer
          </Text>
        </View>
      </View>

      {/*Button wrap */}
      <View className="w-full items-center gap-3 mb-10">
        {/*Button 1 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(getstart)")}
          className="h-14 bg-purple-third w-[80%] rounded-[50px] items-center justify-center"
        >
          <Text className="text-beige-primary text-xl font-medium">
            Get start
          </Text>
        </TouchableOpacity>
        {/*Button 2 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/sign-in")}
          className="h-14 bg-purple-primary w-[80%] rounded-[50px] items-center justify-center"
        >
          <Text className="text-beige-primary text-xl font-medium">
            I already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
