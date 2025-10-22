import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MatchContext } from "../../../context/MatchContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import MainHeader from "@components/MainHeader";
import CommunityByInterest from "@app/(root)/(stack)/buddyscreen/CommunityByInterest";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BuddyScreen() {
  const { matchForm, setMatchForm } = useContext(MatchContext);
  const flatListRef = useRef(null);
  const { width } = Dimensions.get("window");

  //banner
  const imgBannerList = [
    require("@assets/images/applogo.png"),
    require("@assets/images/signinbanner.jpg"),
    require("@assets/images/banner_explore.png"),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelectConnect = (name) => {
    setMatchForm((prev) => ({
      ...prev,
      roomType: name,
    }));
    console.log("match form", matchForm);

    if (matchForm.interestIds.length < 3) {
      router.push("/(stack)/match/chooseInterest");
    } else {
      router.replace({
        pathname: "/(stack)/match/matchLoading",
        params: {
          label: "Đang kết nối...",
        },
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % imgBannerList.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);
  //end banner

  // for you data
  const forYouData = [
    {
      id: 1,
      title: "Stars Wars Torrent",
      members: 14440,
      tag: "Movies",
      image: {
        uri: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800",
      },
    },
    {
      id: 2,
      title: "Crypto Art NFT",
      members: 6510,
      tag: "Art",
      image: {
        uri: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      },
    },
    {
      id: 3,
      title: "Lord of the Rings",
      members: 1050,
      tag: "Movies",
      image: {
        uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      },
    },
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Header */}
      <View className="px-6 h-16 flex-row justify-between items-center overflow-hidden">
        {/*Logo */}
        <View className="w-[150px] overflow-hidden">
          <Image
            source={require("@assets/images/logo_text_black.png")}
            style={{ width: "100%", height: 84, resizeMode: "contain" }}
          />
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(stack)/reward/mainScreenReward")}
        >
          <Ionicons name="calendar-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View className="gap-6">
          <View className="px-6 gap-6">
            {/*Banner */}
            <View className="bg-gray-200 w-full h-[100px] rounded-2xl overflow-hidden">
              <FlatList
                ref={flatListRef}
                data={imgBannerList}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={item}
                    style={{
                      width: width - 40,
                      height: "100%",
                    }}
                    resizeMode="cover"
                  />
                )}
              />
            </View>

            {/*Select type */}
            <View className="flex-row justify-between items-center w-full gap-3">
              <TouchableOpacity
                onPress={() => handleSelectConnect("Private")}
                className={`${matchForm?.roomType == "Private" ? "bg-gray-300" : "bg-gray-100"} h-[80px] flex-1 rounded-md items-center justify-center flex-row gap-2`}
              >
                <FontAwesome name="user" size={16} color="black" />
                <Text className="text-gray-700 font-semibold">
                  Kết nối cá nhấn
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(stack)/match/chooseInterestGroup")
                }
                className={`${matchForm?.roomType == "group" ? "bg-gray-300" : "bg-gray-100"} h-[80px] flex-1 rounded-md items-center justify-center flex-row gap-2`}
              >
                <FontAwesome name="users" size={16} color="black" />
                <Text className="text-gray-700 font-semibold">
                  Kết nối nhóm
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-full h-[100px] bg-gray-100 rounded-md justify-center items-center p-4">
              <Text className="text-gray-600">
                “It is better to conquer yourself than to win a thousand
                battles”
              </Text>
            </View>
          </View>

          {/*For you */}
          <View className="gap-3">
            <Text className="text-base font-semibold text-black-primary px-6">
              Cộng đồng phù hợp với bạn
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-6"
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {forYouData.map((item, index) => (
                <TouchableOpacity key={item.id} className="w-[180px] mr-4">
                  <Image
                    source={item.image}
                    className="w-full h-[110px] rounded-xl"
                    resizeMode="cover"
                  />
                  <View className="mt-2">
                    <Text
                      numberOfLines={1}
                      className="text-[13px] font-semibold text-black-primary"
                    >
                      {item.title}
                    </Text>
                    <Text className="text-[12px] text-gray-500">
                      {item.members.toLocaleString()} Members
                    </Text>
                    <View className="mt-1 self-start bg-gray-100 px-2 py-1 rounded-full">
                      <Text className="text-[11px] text-gray-600">
                        {item.tag}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/*Community by interest */}
          <CommunityByInterest />
        </View>
      </ScrollView>

      {/*floating button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/(stack)/match/chooseInterest")}
        className="absolute right-4 bottom-24 bg-yellow-400 w-16 h-16 rounded-full items-center justify-center shadow-md"
      >
        <FontAwesome6 name="sliders" size={20} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
