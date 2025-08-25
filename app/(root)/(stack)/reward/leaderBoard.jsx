import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { fakeDataRanking } from "data/fakeData";

export default function LeaderBoard() {
  const [rankingList, setRankingList] = useState(fakeDataRanking);

  const rankingItem = ({ item, index }) => {
    return (
      <View className="bg-white flex-row items-center gap-4 py-4 px-4 rounded-full">
        <Text className="text-lg font-semibold">{index + 1}</Text>
        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: item.avatar }}
            className=" bg-gray-300 w-12 h-12 rounded-full"
          />
          <Text className="text-lg">{item.name}</Text>
        </View>
        <View className="flex-1 flex-row justify-end items-center gap-2">
          <Text className="text-right text-lg font-semibold">
            {item.points} pts
          </Text>
          <AntDesign name="arrowup" size={20} color="#79E34B" />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
      {/*Heading */}
      <View className=" h-16 flex-row justify-between items-center px-6">
        {/*Back */}
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="#57298D" />
        </TouchableOpacity>
        {/*Right */}
        <View className="flex-row items-center gap-3">
          {/*Points */}
          <View className="flex-row rounded-full overflow-hidden border border-purple-third">
            <LinearGradient
              colors={["#4B164C10", "#4B164C80"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View className="flex-row items-center gap-6 p-2">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require("@assets/icons/point.png")}
                    className="w-4 h-4"
                  />
                  <Text className="text-purple-primary font-bold">8,868</Text>
                </View>
                <AntDesign name="pluscircleo" size={18} color="#F1F3E7" />
              </View>
            </LinearGradient>
          </View>
          {/*Avatar */}
          <Image
            source={{
              uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
            }}
            className="w-11 h-11 rounded-full"
            resizeMode="cover"
          />
        </View>
      </View>

      {/*Top 3 */}
      <View className="my-6 flex-row justify-between gap-3 items-end px-6">
        {/*3 */}
        <View className="items-center">
          <Image
            source={{ uri: rankingList[2].avatar }}
            className="relative bg-gray-300 w-20 h-20 rounded-full border-2 border-yellow-800"
          />
          <View className="absolute bg-yellow-700 left-5 h-4 w-4 items-center justify-center rounded-full">
            <Text className="text-xs text-white">3</Text>
          </View>
          <Text className="mt-2">{rankingList[2].name}</Text>
          <Text className="text-lg font-semibold">
            {rankingList[2].points} pts
          </Text>
        </View>
        {/*1 */}
        <View className="items-center">
          <Image
            source={{ uri: rankingList[0].avatar }}
            className="relative bg-gray-300 w-28 h-28 rounded-full border-2 border-yellow-400 shadow-yellow-500/50 shadow-lg"
          />
          <View className="absolute bg-yellow-300 left-3 h-6 w-6 items-center justify-center rounded-full">
            <Text className="text-md text-white">1</Text>
          </View>
          <Text className="mt-2">{rankingList[0].name}</Text>
          <Text className="text-lg font-semibold">
            {rankingList[0].points} pts
          </Text>
        </View>
        {/*2 */}
        <View className="items-center">
          <Image
            source={{ uri: rankingList[1].avatar }}
            className="relative bg-gray-300 w-24 h-24 rounded-full border-2 border-gray-500 shadow-gray-500/50 shadow-lg"
          />
          <View className="absolute bg-gray-300 left-3 h-5 w-5 items-center justify-center rounded-full">
            <Text className="text-sm text-white">2</Text>
          </View>
          <Text className="mt-2">{rankingList[1].name}</Text>
          <Text className="text-lg font-semibold">
            {rankingList[1].points} pts
          </Text>
        </View>
      </View>

      {/*List ranking */}
      <View className="px-6 flex-1">
        <FlatList
          data={rankingList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={rankingItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      </View>
    </SafeAreaView>
  );
}
