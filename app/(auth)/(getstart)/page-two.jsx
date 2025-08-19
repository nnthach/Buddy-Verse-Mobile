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

export default function GetStartTwoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 bg-beige-primary px-8">
        {/*Heading */}
        <View className="mt-4">
          <Text className="text-[38px] text-purple-primary font-bold">
            Select your interests
          </Text>
          <Text className="text-xl text-purple-primary/70">
            for better matches
          </Text>
        </View>

        {/*Content */}
        <View>
          <Text>alo alo</Text>
        </View>

        {/*Footer */}
        <View className="mt-auto mb-6 flex-row justify-between items-center">
          <View className=" flex-row gap-3">
            {[...Array(3)].map((_, index) => (
              <View
                key={index}
                className={`w-[16px] h-[16px] rounded-full border border-purple-primary ${index == 1 && "bg-purple-primary"}`}
              />
            ))}
          </View>

          {/*Arrow */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back("/page-one")}
              className="rounded-full w-14 h-14 bg-purple-primary/50 items-center justify-center"
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={36}
                color="#F1F3E7"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/page-three")}
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
      </View>
    </SafeAreaView>
  );
}
