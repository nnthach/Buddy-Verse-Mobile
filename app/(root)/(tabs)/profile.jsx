import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../context/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";

export default function ProfileScreen() {
  const screenWidth = Dimensions.get("window").width;

  const imgList = [
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
  ];

  const { userInfo } = useContext(AuthContext);
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
      number: userInfo?.point || 1900,
      label: "Điểm",
      icon: require("@assets/icons/point.png"),
    },
  ]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/*Header */}
        <View className=" px-6 h-16 flex-row justify-between items-center overflow-hidden">
          {/*Logo */}
          <View className="w-[150px] overflow-hidden">
            <Image
              source={require("@assets/images/logoTextPurple.png")}
              style={{ width: "100%", height: 84, resizeMode: "contain" }}
            />
          </View>
          <FontAwesome5 name="bell" size={24} color="#57298D" />
        </View>

        {/*Banner profile */}
        <View className="mb-2">
          <Image
            source={require("@assets/images/bannerMain.png")}
            style={{ height: 100, width: "100%" }}
          />
        </View>
        {/*Info */}
        <View className="px-6 gap-4 mb-6">
          {/*User ava && points */}
          <View className=" flex-row justify-between items-center gap-4">
            {/*Avatar */}
            <Image
              source={
                userInfo?.photos?.[0]
                  ? { uri: userInfo.photos[0] }
                  : require("@assets/images/avatar.png")
              }
              className="w-24 h-24 rounded-full"
              resizeMode="cover"
            />
            <View className=" flex-1 flex-row justify-around items-center py-2">
              {stats.map((item, index) => (
                <View key={index} className="items-center">
                  <Text className="font-bold text-2xl text-purple-primary">
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
          </View>

          {/*bio */}
          <View className="">
            <Text className="text-purple-third text-2xl font-semibold">
              {userInfo?.lastname} {userInfo?.firstname}
            </Text>
            <Text>{userInfo?.gender}</Text>
          </View>

          {/*Feature */}
          <View className="flex-row gap-2 justify-between items-center">
            <TouchableOpacity className="bg-white rounded-2xl w-[42%] p-2 items-center justify-center">
              <Text className="text-purple-primary font-semibold text-lg">
                Kết bạn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white rounded-2xl w-[42%] p-2 items-center justify-center">
              <Text className="text-purple-primary font-semibold text-lg">
                Nhắn tin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(stack)/profile/settingProfile")}
            >
              <Feather name="settings" size={24} color="#57298D" />
            </TouchableOpacity>
          </View>
        </View>

        {/*Picture */}
        <View className="flex-row gap-[2.5px] flex-wrap">
          {imgList.map((item, index) => (
            <Image
              key={index}
              source={item}
              style={{
                width: screenWidth / 3.04,
                height: screenWidth / 3.04,
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
