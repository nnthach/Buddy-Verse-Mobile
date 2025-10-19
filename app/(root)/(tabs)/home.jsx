import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useContext, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useFocusEffect } from "expo-router";
import MainHeader from "@components/MainHeader";
import { getAllPostAPI, likePostAPI } from "@services/postService";
import { AuthContext } from "@context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentModal from "@components/CommentModal";
import { VideoView, useVideoPlayer } from "expo-video";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function HomeScreen() {
  const { userInfo } = useContext(AuthContext);

  const statData = [
    {
      id: 1,
      name: "Chuỗi",
      point: "29",
    },
    {
      id: 2,
      name: "Điểm uy tín",
      point: "45",
    },
    {
      id: 3,
      name: "Điểm",
      point: "2,800",
    },
  ];

  const moreButtons = [
    {
      id: 1,
      name: "Nhiệm vụ",
      icon: <Ionicons name="checkmark-done-outline" size={24} color="black" />,
      onPress: () => router.push("/(root)/(stack)/reward/mainScreenReward"),
    },
    {
      id: 2,
      name: "AI tạo nhân vật",
      icon: <Ionicons name="calendar-outline" size={24} color="black" />,
    },
    {
      id: 3,
      name: "Thành viên",
      icon: <Ionicons name="diamond-outline" size={24} color="black" />,
      onPress: () => router.push("/(root)/(stack)/reward/payment"),
    },
    {
      id: 4,
      name: "Hỗ trợ",
      icon: <MaterialIcons name="support-agent" size={24} color="black" />,
    },
  ];
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Header */}
      <MainHeader />
      {/*Content */}
      <ScrollView
        // className="px-6"
        contentContainerStyle={{
          // justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        {/* Cover */}
        <View className="w-full h-[120px] bg-gray-200">
          <Image
            source={require("@assets/images/bannerMain.png")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        {/*character */}
        <Image
          source={
            userInfo?.photos[1]
              ? { uri: userInfo?.photos[1] }
              : require("@assets/images/character/white_body.png")
          }
          className="w-72 h-72"
          resizeMode="cover"
        />
        {/*State */}
        <View className="bg-gray-100 p-4 py-2 border w-[88%] border-gray-400 flex-row justify-around items-center rounded-lg">
          {statData.map((item) => (
            <View key={item.id} className="justify-center items-center">
              <Text className="font-semibold">{item.point}</Text>
              <Text className="font-medium">{item.name}</Text>
            </View>
          ))}
        </View>
        {/*explore buddy */}
        <TouchableOpacity
          onPress={() => router.replace("/(root)/(tabs)/buddy")}
          className="w-[88%] my-6 p-4 bg-gray-100 border border-gray-400 flex-row justify-center items-center gap-3 rounded-lg"
        >
          <Ionicons name={"search-outline"} size={24} color={"black"} />
          <Text className="font-medium">Explore Buddy Verse</Text>
        </TouchableOpacity>
        {/*more btn */}
        <View className="flex-row flex-wrap w-[88%] justify-between gap-y-4">
          {moreButtons.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              className="bg-gray-100 flex-row justify-center items-center w-[48%] p-4 border border-gray-400 gap-3 rounded-lg"
            >
              {item.icon}
              <Text className="font-medium">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
