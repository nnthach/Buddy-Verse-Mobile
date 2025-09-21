import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";

export default function SettingProfile() {
  const [isEnabled, setIsEnabled] = useState(false);
  const settingList = [
    {
      icon: <Feather name="user" size={24} color="black" />,
      label: "Manage Account",
      type: "nest",
      onPress: () => router.push("/profile/editProfileForm"),
    },
    {
      icon: <Feather name="bell-off" size={24} color="black" />,
      label: "Notifications",
      type: "onoff",
    },
    {
      icon: <Feather name="message-square" size={24} color="black" />,
      label: "Chat",
      type: "nest",
    },
    {
      icon: <Feather name="settings" size={24} color="black" />,
      label: "General Settings",
      type: "nest",
    },
    {
      icon: <Feather name="moon" size={24} color="black" />,
      label: "Dark Mode",
      type: "onoff",
    },
    {
      icon: <Entypo name="language" size={24} color="black" />,
      label: "Language",
      type: "nest",
    },
    {
      icon: <AntDesign name="contacts" size={24} color="black" />,
      label: "My Contact",
      type: "nest",
    },
    {
      icon: <AntDesign name="questioncircleo" size={24} color="black" />,
      label: "FAQ",
      type: "nest",
    },
    {
      icon: <MaterialIcons name="error-outline" size={24} color="black" />,
      label: "Terms Of Service",
      type: "nest",
    },
    {
      icon: <Feather name="shield" size={24} color="black" />,
      label: "User Policy",
      type: "nest",
    },
  ];
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <ScrollView className="flex-1 px-6">
        {/*Heading */}
        <View className="h-16 flex-row justify-between items-center ">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={34}
              color="#57298D"
            />
          </TouchableOpacity>
          <Text className="text-purple-primary font-semibold text-2xl">
            Setting
          </Text>
          <Text className="w-[34px]" />
        </View>

        {/*Avatar */}
        <View className="mt-6 justify-center items-center">
          <Image
            source={{
              uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
            }}
            className="w-32 h-32 rounded-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => router.push("/profile/characterCartoon")}
          >
            <Text className="text-xl text-purple-primary font-bold mt-3 mb-1">
              Nguyen Ngoc Thach
            </Text>
          </TouchableOpacity>
        </View>

        {/*Content */}
        <View className="mt-6 gap-4">
          <View className="bg-white rounded-xl">
            {settingList.slice(0, 4).map((item, index) => (
              <View key={index} className="p-4">
                <TouchableOpacity
                  onPress={item.onPress}
                  className="flex-row items-center gap-4"
                >
                  {item.icon}
                  <Text className="text-lg">{item.label}</Text>
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

          <View className="bg-white rounded-xl">
            {settingList.slice(4, 7).map((item, index) => (
              <View key={index} className="p-4 flex-row items-center gap-4">
                {item.icon}
                <Text className="text-lg">{item.label}</Text>
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
          </View>

          <View className="bg-white rounded-xl">
            {settingList.slice(7).map((item, index) => (
              <View key={index} className="p-4 flex-row items-center gap-4">
                {item.icon}
                <Text className="text-lg">{item.label}</Text>
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
          </View>

          <View className="mt-4">
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")} className="bg-purple-third py-4 px-6 rounded-full w-full">
              <Text className="text-white text-xl font-medium text-center">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
