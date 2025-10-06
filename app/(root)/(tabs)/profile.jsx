import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AuthContext } from "../../../context/AuthContext";
import Feather from "@expo/vector-icons/Feather";

export default function ProfileScreen() {
  const { userInfo } = useContext(AuthContext);

  const displayName =
    (userInfo?.lastname || "Yuna") + " " + (userInfo?.firstname || "Lu");

  const [activeTab, setActiveTab] = useState("posts");
  const tags = [
    "friendly",
    "exploring",
    "eating",
    "napping",
    "fetch",
    "sleeping",
  ];

  // Minimal sample posts; layout mirrors home.jsx
  const [posts] = useState([
    {
      id: "post_1",
      user: {
        name: "Yuna",
        handle: "@spicyyunaroll",
        avatar: require("@assets/images/avatar.png"),
      },
      time: "11:18 AM • June 20, 2021",
      content: "Sleep in Sunday is the best day of the week!\n#sunspot",
      likes: 54,
      comments: 27,
    },
    {
      id: "post_2",
      user: {
        name: "Yuna",
        handle: "@spicyyunaroll",
        avatar: require("@assets/images/avatar.png"),
      },
      time: "11:18 AM • June 20, 2021",
      content: "Sleep in Sunday is the best day of the week!\n#sunspot",
      likes: 54,
      comments: 27,
    },
    {
      id: "post_3",
      user: {
        name: "Yuna",
        handle: "@spicyyunaroll",
        avatar: require("@assets/images/avatar.png"),
      },
      time: "11:18 AM • June 20, 2021",
      content: "Sleep in Sunday is the best day of the week!\n#sunspot",
      likes: 54,
      comments: 27,
    },
  ]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Header */}
      <View className="px-6 h-16 flex-row justify-between items-center overflow-hidden">
        {/*Logo */}
        <View className="w-[150px] overflow-hidden">
          <Image
            source={require("@assets/images/logoTextBlack.png")}
            style={{ width: "100%", height: 84, resizeMode: "contain" }}
          />
        </View>
        <View className="flex-row justify-between items-center gap-4">
          <FontAwesome5 name="bell" size={24} color="black" />
          <TouchableOpacity
            onPress={() => router.push("/(stack)/profile/settingProfile")}
          >
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        {/* Cover */}
        <View className="w-full h-[140px] bg-gray-200">
          <Image
            source={require("@assets/images/bannerMain.png")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Profile header */}
        <View className="px-6">
          {/* Avatar overlapping */}
          <View className="-mt-8 items-center">
            <Image
              source={
                userInfo?.photos?.[0]
                  ? { uri: userInfo.photos[0] }
                  : require("@assets/images/avatar.png")
              }
              className="w-20 h-20 rounded-full border-4 border-white"
              resizeMode="cover"
            />
          </View>

          {/* Name and stats */}
          <View className="mt-2 items-center">
            <Text className="text-[20px] font-semibold text-black text-center">
              {displayName}
            </Text>
            <View className="flex-row items-center justify-center gap-3 mt-2">
              <Text className="text-gray-500 text-[12px]">San Francisco</Text>
              <Text className="text-gray-400 text-[12px]">184 following</Text>
              <Text className="text-gray-400 text-[12px]">611 followers</Text>
            </View>
          </View>

          {/* Bio */}
          <View className="mt-3 gap-3 items-center">
            <Text className="text-[13px] text-gray-700 text-center">
              My name is Yuna, and I’m a 4 year old Shiba Inu. I’m currently
              travelling the world! Follow me on Petma @spicy_yuna_roll!
            </Text>
            <Text className="text-[13px] text-gray-700 text-center">
              初めまして、ユナです。四歳柴犬。世界の犬！
            </Text>
          </View>

          {/* Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3 -mx-1"
          >
            {tags.map((t, idx) => (
              <View
                key={idx}
                className="mr-2 bg-gray-100 px-3 py-2 rounded-full"
              >
                <Text className="text-[12px] text-gray-700">{t}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Tabs */}
          <View className="flex-row items-center gap-6 mt-5">
            {[
              { key: "posts", label: "My posts" },
              { key: "likes", label: "Likes" },
              { key: "bookmarks", label: "Bookmarks" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
              >
                <View className="items-center">
                  <Text
                    className={`text-[13px] ${activeTab === tab.key ? "text-black font-semibold" : "text-gray-500"}`}
                  >
                    {tab.label}
                  </Text>
                  {activeTab === tab.key && (
                    <View className="h-[2px] bg-black w-10 mt-2" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Posts list (reuse home.jsx style) */}
          <View className="mt-4">
            {posts.map((post) => (
              <View key={post.id} className="bg-white overflow-hidden">
                {/* Post header */}
                <View className="flex-row items-center gap-3 py-3">
                  <Image
                    source={post.user.avatar}
                    className="w-10 h-10 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="font-semibold text-lg text-black">
                      {post.user.name}
                    </Text>
                    {post.user.handle && (
                      <Text className="text-gray-500 text-sm">
                        {post.user.handle}
                      </Text>
                    )}
                  </View>
                  <MaterialIcons name="more-horiz" size={22} color="#6C757D" />
                </View>

                {/* Post content */}
                {post.content?.length > 0 && (
                  <Text className="pb-3 text-[16px] text-purple-third">
                    {post.content}
                  </Text>
                )}

                {/* Actions */}
                <View className="flex-row items-center justify-between pb-2">
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity className="flex-row items-center gap-2">
                      <FontAwesome5 name="heart" size={18} color="#6C757D" />
                      <Text className="text-gray-600 text-sm">
                        {post.likes}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center gap-2">
                      <FontAwesome5 name="comment" size={18} color="#6C757D" />
                      <Text className="text-gray-600 text-sm">
                        {post.comments}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity>
                    <MaterialIcons
                      name="bookmark-border"
                      size={20}
                      color="#6C757D"
                    />
                  </TouchableOpacity>
                </View>

                {/* Timestamp */}
                <Text className="pb-3 text-gray-500 text-xs">{post.time}</Text>

                {/* Separator */}
                <View className="h-[1px] bg-black/10" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
