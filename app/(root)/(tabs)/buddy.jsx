import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { fakePageTwoGetStart } from "data/fakeData";

export default function BuddyScreen() {
  const [interestList, setInterestList] = useState([]);

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
    <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
      <ScrollView
        className="flex-1 px-6 gap-6 space-y-6"
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View className="gap-6">
          {/*Header */}
          <View className="bg-white h-16 flex-row justify-between items-center">
            {/*Logo */}
            <View>
              <Text>logo</Text>
            </View>
            <FontAwesome5 name="bell" size={24} color="#57298D" />
          </View>

          {/*Select type */}
          <View className="flex-row justify-between items-center w-full gap-3">
            <View className="bg-purple-primary/50 h-28 flex-1 rounded-xl">
              <Text>individual</Text>
            </View>
            <View className="bg-purple-primary/50 h-28 flex-1 rounded-xl">
              <Text>group</Text>
            </View>
          </View>

          {/*Select options */}
          <View className="bg-blue-primary border border-purple-primary">
            <Text className="text-center py-4 text-purple-primary font-semibold">
              OPTIONS
            </Text>

            <View className="p-4 border-y border-purple-primary">
              <Text className="text-purple-primary mb-4">
                What is your interest?
              </Text>
              <View className="flex-row flex-wrap gap-4 my-auto">
                {fakePageTwoGetStart.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() =>
                      handleAddInterestList(item.title.toLowerCase())
                    }
                    className={`rounded-2xl h-9 items-center justify-center ${interestList.includes(item.title.toLowerCase()) ? "bg-purple-third" : "bg-purple-third/50"}`}
                  >
                    <Text className="text-white px-5">{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="p-4">
              <TouchableOpacity className="bg-purple-third py-3 px-6 rounded-full w-full">
                <Text className="text-white text-xl font-medium text-center">
                  Connect
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*Special Offers */}
          <View className="">
            {/*Header */}
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-purple-primary text-2xl font-bold">
                Special Offers
              </Text>
              <View className="flex-row items-center">
                <Text className="text-purple-primary/50 text-lg">See more</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="rgba(87,41,141,0.5)"
                />
              </View>
            </View>

            {/*Content */}
            <View className="bg-black h-[166px] rounded-3xl mt-2 overflow-hidden">
              <View className="mt-6 ml-6 w-[70%] h-[128px]">
                <Text className="text-white font-semibold text-lg ">
                  Buddy Verse Premium
                </Text>
                <Text className="text-gray-500">
                  Unlock Budddy Verse premium to unlock all features.
                </Text>

                <Text className="bg-purple-third text-white self-start p-3 px-4 rounded-2xl mt-auto">
                  Upgrade
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
