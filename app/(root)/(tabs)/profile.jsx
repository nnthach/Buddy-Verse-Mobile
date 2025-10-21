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
import { getAllPostOfUserAPI, likePostAPI } from "@services/postService";
import CommentModal from "@components/CommentModal";
import { VideoView, useVideoPlayer } from "expo-video";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const { userInfo, userId } = useContext(AuthContext);
  const [favoriteList, setFavoriteList] = useState([]);
  const [postId, setPostId] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
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

  const handleLike = async (post) => {
    try {
      await likePostAPI(post.postId, { accountId: userId });

      const updatedPosts = postList.map((p) =>
        p.postId === post.postId
          ? { ...p, likeCount: (p.likeCount || 0) + 1 }
          : p
      );
      setPostList(updatedPosts);

      const updatedFavoriteList = [...favoriteList, post];
      setFavoriteList(updatedFavoriteList);
      await AsyncStorage.setItem(
        "favoriteList",
        JSON.stringify(updatedFavoriteList)
      );
    } catch (error) {
      console.log("like post err", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAllPostOfUser();
    }, [])
  );

  function PostAttachmentItem({ item }) {
    const screenWidth = Dimensions.get("window").width;

    const player = useVideoPlayer(item?.fileUrl, (player) => {
      player.loop = true;
      player.play();
    });

    const isVideo = item?.fileType === "VIDEO";

    return (
      <View
        style={{
          width: screenWidth - 54,
          height: screenWidth - 54,
          backgroundColor: "black",
          overflow: "hidden",
          borderRadius: 12,
          marginRight: 10,
        }}
      >
        {isVideo ? (
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{ uri: item.fileUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        )}
      </View>
    );
  }

  const renderPostItem = ({ item: post }) => {
    return (
      <View key={post?.postId} className="bg-white py-3 mb-3">
        {/* Post header */}
        <View className="flex-row items-center gap-3 mb-3 px-6">
          <Image
            source={{ uri: post?.author?.photoUrls?.[0] }}
            className="w-10 h-10 rounded-full border"
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

        {/* 🖼️ Attachments (carousel) */}
        {post?.attachments?.length > 0 && (
          <ScrollView
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {post?.attachments?.map((item, index) => (
              <PostAttachmentItem key={index} item={item} />
            ))}
          </ScrollView>
        )}

        {/* Post content */}
        {post?.content?.length > 0 && (
          <Text className="my-1 mt-2 text-[16px] text-black px-6">
            {post.content}
          </Text>
        )}

        {/* Actions */}
        <View className="flex-row items-center gap-4 mt-3 mb-2 px-6">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => handleLike(post)}
          >
            <FontAwesome5
              name={
                favoriteList.some((fav) => fav.postId === post.postId)
                  ? "heartbeat"
                  : "heart"
              }
              size={18}
              color={
                favoriteList.some((fav) => fav.postId === post.postId)
                  ? "red"
                  : "#6C757D"
              }
            />
            <Text className="text-gray-600 text-sm">{post?.likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPostId(post.postId)}
            className="flex-row items-center gap-2"
          >
            <FontAwesome5 name="comment" size={18} color="#6C757D" />
            <Text className="text-gray-600 text-sm">{post?.commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <MaterialIcons name="bookmark-border" size={20} color="#6C757D" />
          </TouchableOpacity>
        </View>

        {/* Timestamp */}
        <Text className="pb-3 text-gray-500 text-xs px-6">
          {new Date(post?.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  const listRender = () => {
    return (
      <View className='mb-3'>
        {/* Cover */}
        <View className="w-full h-[140px] bg-gray-200">
          <Image
            source={require("@assets/images/applogo.png")}
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
                userInfo?.avatarUrl
                  ? { uri: userInfo?.avatarUrl }
                  : require("@assets/images/avatar.png")
              }
              className="w-24 h-24 rounded-full bg-white-primary"
              resizeMode="cover"
            />
          </View>

          {/* Name and stats */}
          <View className="mt-2 items-center">
            <Text className="text-[20px] font-semibold text-black text-center">
              {userInfo?.lastname} {userInfo?.firstname}
            </Text>
          </View>

          {/* Bio */}
          <View className="mt-2 gap-3 items-center">
            <Text className="text-[13px] text-gray-700 text-center">
              {userInfo?.bio}
            </Text>
          </View>

          {/*interest */}
          {userInfo?.interests.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-3 -mx-1"
            >
              {userInfo?.interests?.map((t, idx) => (
                <View
                  key={idx}
                  className="mr-2 bg-gray-100 px-3 py-2 rounded-full"
                >
                  <Text className="text-[12px] text-gray-700">{t}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Tabs */}
          <View className="flex-row items-center gap-6 mt-5">
            {[
              { key: "posts", label: "Bài viết" },
              { key: "photo", label: "Hình ảnh" },
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
    );
  };

  return (
    <>
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
          <View className="flex-row justify-between items-center gap-4">
            <Entypo name="notification" size={22} color="black" />
            <TouchableOpacity
              onPress={() => router.push("/(stack)/profile/settingProfile")}
            >
              <Feather name="settings" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === "posts" ? (
          <FlatList
            key={"posts"}
            data={postList}
            renderItem={renderPostItem}
            keyExtractor={(item) => item?.postId?.toString()}
            ListHeaderComponent={listRender}
            contentContainerStyle={{ paddingBottom: 50 }}
            refreshing={loading}
            onRefresh={refresh}
            showsVerticalScrollIndicator={false}
          />
        ) : (
            <FlatList
              key={"photo"}
              data={userInfo?.photos || []}
              renderItem={({ item }) => {
                const screenWidth = Dimensions.get("window").width;
                const itemSize = (screenWidth - 4) / 3;
                return (
                  <View
                    style={{
                      width: itemSize,
                      height: itemSize,
                      margin: 1,
                      backgroundColor: "#f3f3f3",
                    }}
                  >
                    <Image
                      source={{ uri: item }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </View>
                );
              }}
              keyExtractor={(_, index) => index.toString()}
              ListHeaderComponent={listRender}
              numColumns={3}
              contentContainerStyle={{
                paddingBottom: 50,
              }}
              refreshing={loading}
              onRefresh={refresh}
              showsVerticalScrollIndicator={false}
            />
        )}

        {/*floating btn */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(stack)/profile/editInterest")}
          className="absolute right-4 bottom-24 bg-yellow-400 w-16 h-16 rounded-full items-center justify-center shadow-md"
        >
          <FontAwesome6 name="edit" size={20} color="black" />
        </TouchableOpacity>
      </SafeAreaView>

      {postId && <CommentModal setPostId={setPostId} postId={postId} />}
    </>
  );
}
