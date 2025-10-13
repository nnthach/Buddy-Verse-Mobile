import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import MainHeader from "@components/MainHeader";

export default function HomeScreen() {
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
        name: "Sky",
        handle: "@skybudgie",
        avatar: require("@assets/images/avatar.png"),
      },
      time: "11:18 AM • June 20, 2021",
      content: "Going soaring this Sunday!",
      likes: 54,
      comments: 27,
    },
    {
      id: "post_3",
      user: {
        name: "Thea",
        handle: "@theacat",
        avatar: require("@assets/images/avatar.png"),
      },
      time: "Yesterday",
      content: "Catching sunbeams on the window today.",
      likes: 12,
      comments: 4,
    },
    {
      id: "post_4",
      user: {
        name: "Mochi",
        handle: "@mochipaws",
        avatar: require("@assets/images/avatar.png"),
      },
      time: "3 hours ago",
      content: "Snack time or nap time? Why not both.",
      likes: 33,
      comments: 6,
    },
    {
      id: "post_5",
      user: {
        name: "Kuro",
        handle: "@kurodachi",
        avatar: require("@assets/images/avatar.png"),
      },
      time: "1 minute ago",
      content: "Monday mood: motivated (after coffee).",
      likes: 5,
      comments: 0,
    },
  ]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Header */}
      <MainHeader />

      <ScrollView
        className="flex-1 px-6 gap-6 space-y-6"
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View className="gap-6">
          {/*Posts */}
          <View className="gap-4">
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
                  <Text className="pb-3 text-[16px] text-black">
                    {post.content}
                  </Text>
                )}

                {/* Actions */}
                <View className="flex-row items-center gap-4 mb-2">
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <FontAwesome5 name="heart" size={18} color="#6C757D" />
                    <Text className="text-gray-600 text-sm">{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <FontAwesome5 name="comment" size={18} color="#6C757D" />
                    <Text className="text-gray-600 text-sm">
                      {post.comments}
                    </Text>
                  </TouchableOpacity>
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

      {/*floating button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/(root)/(stack)/post/createPost")}
        className="absolute right-4 bottom-24 bg-yellow-400 w-16 h-16 rounded-full items-center justify-center shadow-md"
      >
        <FontAwesome6 name="plus" size={20} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
