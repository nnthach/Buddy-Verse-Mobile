import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { fakePageTwoGetStart } from "../../../data/fakeData";
import FooterGetStart from "../../../components/FooterGetStart";

export default function GetStartTwoScreen() {
  const [interestList, setInterestList] = useState([]);

  console.log("interest list", interestList);

  const handleAddInterestList = (item) => {
    console.log("item", item);

    setInterestList((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 bg-beige-primary px-8">
        {/*Heading */}
        <View className="mt-4">
          <Text className="text-[38px] text-purple-secondary font-bold">
            Select your interests
          </Text>
          <Text className="text-xl text-purple-secondary/70">
            for better matches
          </Text>
        </View>

        {/*Content */}
        <View className="flex-row flex-wrap gap-4 my-auto">
          {fakePageTwoGetStart.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleAddInterestList(item.title.toLowerCase())}
              className={`rounded-2xl h-9 items-center justify-center ${interestList.includes(item.title.toLowerCase()) ? "bg-purple-third" : "bg-purple-third/50"}`}
            >
              <Text className="text-white px-5">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/*Footer */}
        <FooterGetStart
          pageIndex={1}
          back={"/page-one"}
          next={"/page-three"}
          disabled={interestList.length == 0}
        />
      </View>
    </SafeAreaView>
  );
}

{
  /* <View className="mt-auto mb-6 flex-row justify-between items-center">
  <View className=" flex-row gap-3">
    {[...Array(3)].map((_, index) => (
      <View
        key={index}
        className={`w-[16px] h-[16px] rounded-full border border-purple-primary ${index == 1 && "bg-purple-primary"}`}
      />
    ))}
  </View>

  <View className="flex-row gap-3">
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.back("/page-one")}
      className="rounded-full w-14 h-14 bg-purple-primary/50 items-center justify-center"
    >
      <MaterialIcons name="keyboard-arrow-left" size={36} color="#F1F3E7" />
    </TouchableOpacity>
    <TouchableOpacity
      disabled={interestList.length == 0}
      activeOpacity={0.8}
      onPress={() => router.push("/page-three")}
      className={`rounded-full w-14 h-14 items-center justify-center ${interestList.length == 0 ? "bg-gray-500" : "bg-purple-primary"}`}
    >
      <MaterialIcons name="keyboard-arrow-right" size={36} color="#F1F3E7" />
    </TouchableOpacity>
  </View>
</View>; */
}
