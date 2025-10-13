import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AuthContext } from "../../../context/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useFocusEffect } from "expo-router";
import useFetchList from "hooks/useFetchList";
import { getAllPostOfUserAPI } from "@services/postService";

export default function ProfileScreen() {
  const { userInfo, userId } = useContext(AuthContext);

  console.log("user info", userInfo);

  const [activeTab, setActiveTab] = useState("posts");

  const tags = [
    "friendly",
    "exploring",
    "eating",
    "napping",
    "fetch",
    "sleeping",
  ];

  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetAllPostOfUser = async () => {
    setLoading(true);
    try {
      const res = await getAllPostOfUserAPI(userId);
      console.log("res", res.data);
      setPostList(res.data);
    } catch (error) {
      console.log("get all post user err", error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      await handleGetAllPostOfUser(); // gọi lại API
    } catch (error) {
      console.log("refresh err", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllPostOfUser();
    }, [])
  );

  const renderPostItem = ({ item: post }) => {
    const screenWidth = Dimensions.get("window").width;

    return (
      <View key={post?.postId} className="bg-white px-6 py-3 mb-4">
        {/* Post header */}
        <View className="flex-row items-center gap-3 mb-3">
          <Image
            source={{ uri: post?.author?.photoUrls?.[0] }}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="font-semibold text-lg text-black">
              {post?.author?.username}
            </Text>
            <Text className="text-gray-500 text-sm">
              {post?.author?.lastname} {post?.author?.firstname}
            </Text>
          </View>
          <MaterialIcons name="more-horiz" size={22} color="#6C757D" />
        </View>

        {/* Post content */}
        {post?.content?.length > 0 && (
          <Text className="pb-3 text-[16px] text-black">{post.content}</Text>
        )}

        {/* 🖼️ Attachments (carousel) */}
        {post?.attachments?.length > 0 && (
          <FlatList
            data={post.attachments}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            decelerationRate="fast"
            renderItem={({ item }) => (
              <View
                style={{
                  width: screenWidth - 42,
                  height: screenWidth - 48,
                  backgroundColor: "lightgray",
                  overflow: "hidden",
                  borderRadius: 12,
                }}
              >
                <Image
                  source={{ uri: item.fileUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        )}

        {/* Actions */}
        <View className="flex-row items-center gap-4 mt-3 mb-2">
          <TouchableOpacity className="flex-row items-center gap-2">
            <FontAwesome5 name="heart" size={18} color="#6C757D" />
            <Text className="text-gray-600 text-sm">{post?.likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-2">
            <FontAwesome5 name="comment" size={18} color="#6C757D" />
            <Text className="text-gray-600 text-sm">{post?.commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <MaterialIcons name="bookmark-border" size={20} color="#6C757D" />
          </TouchableOpacity>
        </View>

        {/* Timestamp */}
        <Text className="pb-3 text-gray-500 text-xs">{post?.createdAt}</Text>

        {/* Separator */}
        <View className="h-[1px] bg-black/10" />
      </View>
    );
  };

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
          <Entypo name="notification" size={22} color="black" />
          <TouchableOpacity
            onPress={() => router.push("/(stack)/profile/settingProfile")}
          >
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={postList}
        renderItem={renderPostItem}
        keyExtractor={(item) => item?.postId?.toString()}
        ListHeaderComponent={
          <View>
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
                  className="w-20 h-20 rounded-full"
                  resizeMode="cover"
                />
              </View>

              {/* Name and stats */}
              <View className="mt-2 items-center">
                <Text className="text-[20px] font-semibold text-black text-center">
                  {userInfo?.lastname} {userInfo?.firstname}
                </Text>
                <View className="flex-row items-center justify-center gap-3 mt-2">
                  <Text className="text-gray-500 text-[12px]">
                    San Francisco
                  </Text>
                  <Text className="text-gray-400 text-[12px]">
                    184 following
                  </Text>
                  <Text className="text-gray-400 text-[12px]">
                    611 followers
                  </Text>
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
                        className={`text-[13px] ${
                          activeTab === tab.key
                            ? "text-black font-semibold"
                            : "text-gray-500"
                        }`}
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
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshing={loading}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
      />

      {/*floating btn */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/(stack)/profile/editInterest")}
        className="absolute right-4 bottom-24 bg-yellow-400 w-16 h-16 rounded-full items-center justify-center shadow-md"
      >
        <FontAwesome6 name="edit" size={20} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
