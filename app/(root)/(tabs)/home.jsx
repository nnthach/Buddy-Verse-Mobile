import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useContext, useEffect, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useFocusEffect } from "expo-router";
import MainHeader from "@components/MainHeader";
import useFetchList from "hooks/useFetchList";
import { getAllPostAPI, likePostAPI } from "@services/postService";
import { AuthContext } from "@context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentModal from "@components/CommentModal";

export default function HomeScreen() {
  const { userId } = useContext(AuthContext);
  const [favoriteList, setFavoriteList] = useState([]);
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postId, setPostId] = useState(null);

  const handleFetchAllPost = async () => {
    setLoading(true);
    try {
      const res = await getAllPostAPI();
      setPostList(res.data);
    } catch (error) {
      console.log("fetch all err", error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllPostAPI();
      setPostList(res.data);
      console.log("run");
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
        <Text className="pb-3 text-gray-500 text-xs">{post?.createdAt}</Text>

        {/* Separator */}
        <View className="h-[1px] bg-black/10" />
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const storedFavoriteList = await AsyncStorage.getItem("favoriteList");
          if (storedFavoriteList) {
            setFavoriteList(JSON.parse(storedFavoriteList));
          } else {
            await AsyncStorage.setItem("favoriteList", JSON.stringify([]));
            setFavoriteList([]);
          }
        } catch (error) {
          console.log("Error loading favorites:", error);
        }
      };

      fetchFavorites();
      handleFetchAllPost();
    }, [])
  );

  return (
    <>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
        {/*Header */}
        <MainHeader />

        <FlatList
          data={postList}
          renderItem={renderPostItem}
          keyExtractor={(item) => item?.postId?.toString()}
          contentContainerStyle={{ paddingBottom: 50 }}
          refreshing={loading}
          onRefresh={refresh}
          showsVerticalScrollIndicator={false}
        />

        {/*floating button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(root)/(stack)/post/createPost")}
          className="absolute right-4 bottom-24 bg-yellow-400 w-16 h-16 rounded-full items-center justify-center shadow-md"
        >
          <FontAwesome6 name="plus" size={20} color="black" />
        </TouchableOpacity>
      </SafeAreaView>

      {postId && <CommentModal setPostId={setPostId} postId={postId} />}
    </>
  );
}
