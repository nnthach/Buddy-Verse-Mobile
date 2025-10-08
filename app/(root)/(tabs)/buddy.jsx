import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MatchContext } from "../../../context/MatchContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";

export default function BuddyScreen() {
  const { matchForm, setMatchForm } = useContext(MatchContext);
  const flatListRef = useRef(null);
  const { width } = Dimensions.get("window");

  //banner
  const imgBannerList = [
    require("@assets/images/bannerMain.png"),
    require("@assets/images/signinbanner.jpg"),
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

  //community by interest data
  const communityByInterestData = [
    {
      id: 11,
      title: "Tech World",
      members: 22114,
      tag: "Tech",
      image: {
        uri: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800",
      },
    },
    {
      id: 12,
      title: "Crypto Insiders",
      members: 4412,
      tag: "Crypto",
      image: {
        uri: "https://images.unsplash.com/photo-1621416894569-0f39b4950fd8?w=800",
      },
    },
    {
      id: 13,
      title: "Web Dev News",
      members: 9875,
      tag: "Web",
      image: {
        uri: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      },
    },
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Header */}
      <View className="px-6 h-16 flex-row justify-between items-center">
        {/*Logo */}
        <View className="w-[150px] overflow-hidden">
          <Image
            source={require("@assets/images/logoTextBlack.png")}
            style={{ width: "100%", height: 84, resizeMode: "contain" }}
          />
        </View>
        <Entypo name="notification" size={22} color="black" />
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
                <Text className="text-gray-700 font-semibold">Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelectConnect("Group")}
                className={`${matchForm?.roomType == "group" ? "bg-gray-300" : "bg-gray-100"} h-[80px] flex-1 rounded-md items-center justify-center flex-row gap-2`}
              >
                <FontAwesome name="users" size={16} color="black" />
                <Text className="text-gray-700 font-semibold">Group Chat</Text>
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
              For you
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-1"
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
          <View className="gap-3">
            <Text className="text-base font-semibold text-black px-6">
              Communities by Interests
            </Text>
            {/* filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mx-6"
            >
              {[
                "All",
                "Movies",
                "Art",
                "Sports",
                "Crypto",
                "Finance",
                "Health",
              ].map((label, index) => (
                <View
                  key={index}
                  className={`mr-2 px-3 py-2 rounded-full ${index === 0 ? "bg-black" : "bg-gray-100"}`}
                >
                  <Text
                    className={`text-[12px] ${index === 0 ? "text-white-primary" : "text-gray-700"}`}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-1"
            >
              {communityByInterestData.map((item) => (
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
