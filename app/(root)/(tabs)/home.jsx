import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useEffect, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { fakeDataDiscover } from "data/fakeData";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../../context/AuthContext";

export default function HomeScreen() {
  const [stats, setStats] = useState([
    {
      number: 29,
      label: "Chuỗi",
      icon: require("@assets/icons/fire.png"),
    },
    {
      number: 45,
      label: "Độ uy tín",
      icon: require("@assets/icons/trustscore.png"),
    },
    {
      number: 6.868,
      label: "Điểm",
      icon: require("@assets/icons/point.png"),
    },
  ]);

  const [discoverList, setDiscoverList] = useState(fakeDataDiscover);

  const { userInfo } = useContext(AuthContext);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
      <ScrollView
        className="flex-1 px-6 gap-6 space-y-6"
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View className="gap-6">
          {/*Header */}
          <View className="h-16 flex-row justify-between items-center overflow-hidden">
            {/*Logo */}
            <View className="w-[150px] overflow-hidden">
              <Image
                source={require("@assets/images/logoTextPurple.png")}
                style={{ width: "100%", height: 84, resizeMode: "contain" }}
              />
            </View>
            <FontAwesome5 name="bell" size={24} color="#57298D" />
          </View>

          {/*User info */}
          <View className=" justify-center items-center">
            <View className="mt-6 justify-center items-center">
              <View className="bg-gray-300 w-32 h-32 rounded-full p-2 justify-center items-center">
                <Image
                  source={
                    userInfo?.photos?.[0]
                      ? { uri: userInfo.photos[0] }
                      : require("@assets/images/avatar.png")
                  }
                  className="w-32 h-32 rounded-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xl text-purple-primary font-bold mt-3 mb-1">
                {userInfo?.lastname} {userInfo?.firstname}
              </Text>
              <Text className="text-md text-purple-primary">
                District 3, Ho Chi Minh
              </Text>
            </View>
          </View>

          {/*Stats Card */}
          <View className="bg-white/80 w-full rounded-full flex-row justify-around items-center py-2 overflow-hidden">
            {stats.map((item, index) => (
              <View key={index} className="items-center">
                <Text className="font-bold text-lg text-purple-primary">
                  {item.number}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Image
                    source={item.icon}
                    className="w-5 h-5"
                    resizeMode="cover"
                  />
                  <Text className="text-md text-purple-primary">
                    {item.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/*Someone waiting */}
          {/* <View className="border border-purple-primary w-full rounded-2xl  justify-around items-center py-6">
            <Image
              source={{
                uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
              }}
              className="w-24 h-24 rounded-full"
              resizeMode="cover"
            />

            <Text className="text-3xl text-purple-primary mt-3 mb-1">
              Someone is waiting
            </Text>
            <Text className="text-md text-purple-primary/60">Chat now</Text>

            <View className="bg-purple-primary rounded-3xl mt-3">
              <Text className="text-beige-primary text-lg py-2 px-8 ">
                Find Buddy
              </Text>
            </View>
          </View> */}

          {/*Discover */}
          <View className="">
            {/*Discover header */}
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-purple-primary text-2xl font-bold">
                Khám phá
              </Text>
              <View className="flex-row items-center">
                <Text className="text-purple-primary/50 text-lg">Xem thêm</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="rgba(87,41,141,0.5)"
                />
              </View>
            </View>

            {/*Discover content */}
            <View className="flex-row flex-wrap justify-between mt-2 gap-2">
              {discoverList.map((item, index) => (
                <View
                  key={index}
                  className="relative h-[130px] w-[32%] rounded-2xl overflow-hidden"
                >
                  {/* <View className="absolute w-full h-full bg-red-300 z-10" /> */}
                  <Image
                    source={{
                      uri: item.image,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0.3)", "rgba(87, 41, 141, 0.5)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  <Text className="absolute top-2 left-2 text-[8px] py-[2px] px-[6px] rounded-lg bg-purple-primary text-white">
                    Mới
                  </Text>
                  <View className="absolute bottom-1 left-0 right-0 items-center z-">
                    <Text className="text-xs font-bold text-beige-primary">
                      {item.name}, {item.age}
                    </Text>
                    <Text className="text-xs font-medium text-beige-primary">
                      {item.address}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/*Special Offers */}
          <View className="">
            {/*Header */}
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-purple-primary text-2xl font-bold">
                Uư đãi đặc biệt
              </Text>
              <View className="flex-row items-center">
                <Text className="text-purple-primary/50 text-lg">Xem thêm</Text>
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
