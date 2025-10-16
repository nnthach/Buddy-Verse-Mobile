import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useContext, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useFocusEffect } from "expo-router";
import MainHeader from "@components/MainHeader";
import { getAllPostAPI, likePostAPI } from "@services/postService";
import { AuthContext } from "@context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentModal from "@components/CommentModal";
import { VideoView, useVideoPlayer } from "expo-video";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function HomeScreen() {
  const { userId } = useContext(AuthContext);
  const [favoriteList, setFavoriteList] = useState([]);
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postId, setPostId] = useState(null);

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
