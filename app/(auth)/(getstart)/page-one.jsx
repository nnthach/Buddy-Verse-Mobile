import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

export default function GetStartOneScreen() {
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 bg-beige-primary px-8">
        {/*Heading */}
        <View className="mt-4">
          <Text className="text-[38px] text-purple-primary font-bold">
            Where did you find us?
          </Text>
          <Text className="text-xl text-purple-primary/70">
            feel free to let we know
          </Text>
        </View>

        {/*Content */}
        <View>
          <Image
            source={require("../../../assets/images/facebook_getstart_banner.png")}
            className="w-full h-[300px]"
            resizeMode="cover"
          />
        </View>

        {/*Footer */}
        <View className="mt-auto mb-6 flex-row justify-between items-center">
          <View className=" flex-row gap-3">
            {[...Array(3)].map((_, index) => (
              <View
                key={index}
                className={`w-[16px] h-[16px] rounded-full border border-purple-primary ${index == 0 && "bg-purple-primary"}`}
              />
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/page-two")}
            className="rounded-full w-14 h-14 bg-purple-primary items-center justify-center"
          >
            <MaterialIcons
              name="keyboard-arrow-right"
              size={36}
              color="#F1F3E7"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
