import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import React, { useContext, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { AuthContext } from "../../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingProfile() {
  const [isEnabled, setIsEnabled] = useState(false);
  const settingList = [
    {
      icon: <Feather name="user" size={24} color="black" />,
      label: "Thông tin cá nhân",
      type: "nest",
      onPress: () => router.push("/profile/editProfileForm"),
    },
    {
      icon: <Feather name="bell-off" size={24} color="black" />,
      label: "Thông báo",
      onPress: () => router.push("/(stack)/reward/mainScreenReward"),
      type: "onoff",
    },
    {
      icon: <Feather name="message-square" size={24} color="black" />,
      // onPress: () => router.push("/(stack)/gemini/chatSupport"),
      label: "Tin nhắn",
      type: "nest",
    },
    {
      icon: <Feather name="settings" size={24} color="black" />,
      label: "Cài đặt chung",
      type: "nest",
    },
    {
      icon: <AntDesign name="questioncircleo" size={24} color="black" />,
      label: "Câu hỏi thường gặp",
      type: "nest",
    },
    {
      icon: <MaterialIcons name="error-outline" size={24} color="black" />,
      label: "Điều khoản dịch vụ",
      type: "nest",
    },
    {
      icon: <Feather name="shield" size={24} color="black" />,
      label: "Chính sách người dùng",
      type: "nest",
    },
  ];

  const { userInfo } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["userId", "accessToken", "refreshToken"]);
      router.replace("/(auth)/welcome");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      {/*Heading */}
      <View className="h-16 flex-row justify-between items-center px-6">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        </TouchableOpacity>
        <Text className="text-black font-semibold text-2xl">Cài đặt</Text>
        <Text className="w-[34px]" />
      </View>

      <ScrollView className="flex-1 bg-white-primary">
        {/*Avatar */}
        <View className="p-6 justify-start items-center flex-row gap-3 bg-gray-100">
          <Image
            source={
              userInfo?.photos?.[0]
                ? { uri: userInfo.photos[0] }
                : require("@assets/images/avatar.png")
            }
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => router.push("/profile/characterCartoon")}
          >
            <Text className="text-2xl text-black font-medium">
              {userInfo?.lastname} {userInfo?.firstname}
            </Text>
          </TouchableOpacity>
        </View>

        {/*Content */}
        <View className=" gap-4">
          <View className="bg-white-primary ">
            {settingList.slice(0, 4).map((item, index) => (
              <View key={index} className="p-4 px-6">
                <TouchableOpacity
                  onPress={item.onPress}
                  className="flex-row items-center gap-4"
                >
                  {item.icon}
                  <Text className="text-lg font-medium">{item.label}</Text>
                  <View className="flex-1 items-end">
                    {item.type == "nest" ? (
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={24}
                        color="black"
                      />
                    ) : (
                      <Switch
                        trackColor={{ false: "#767577", true: "#C99BF2" }}
                        thumbColor={isEnabled ? "#57298D" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsEnabled((prev) => !prev)}
                        value={isEnabled}
                        style={{
                          transform: [{ scaleY: 0.85 }, { scaleX: 0.85 }],
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text className="text-xl font-semibold p-6 pb-2 bg-gray-100">
            Hỗ trợ
          </Text>
          <View className="bg-white-primary mt-[-12px]">
            {settingList.slice(4, 7).map((item, index) => (
              <View
                key={index}
                className="p-4 px-6 flex-row items-center gap-4"
              >
                {item.icon}
                <Text className="text-lg font-medium">{item.label}</Text>
                <View className="flex-1 items-end">
                  {item.type == "nest" ? (
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={24}
                      color="black"
                    />
                  ) : (
                    <Switch
                      trackColor={{ false: "#767577", true: "#C99BF2" }}
                      thumbColor={isEnabled ? "#57298D" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => setIsEnabled((prev) => !prev)}
                      value={isEnabled}
                      style={{
                        transform: [{ scaleY: 0.85 }, { scaleX: 0.85 }],
                      }}
                    />
                  )}
                </View>
              </View>
            ))}
            {/*sign out */}
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red- p-4 px-6 flex-row items-center gap-4"
            >
              <Feather name="log-out" size={24} color="black" />
              <Text className="text-black text-lg font-medium">Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
