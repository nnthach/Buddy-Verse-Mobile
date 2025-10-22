import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../../context/AuthContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getUserByIdAPI } from "@services/userService";
import ModalReportAccount from "@components/ReportComponent/ModalReportAccount";
import { createReportMessageAPI } from "@services/reportService";
import { getAllPostOfUserAPI, likePostAPI } from "@services/postService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useVideoPlayer, VideoView } from "expo-video";
import CommentModal from "@components/CommentModal";

export default function ProfileByIdScreen() {
  const { profileId } = useLocalSearchParams();
  const { userInfo } = useContext(AuthContext);
  const [profileInfo, setProfileInfo] = useState(null);
  const [favoriteList, setFavoriteList] = useState([]);
  const [postId, setPostId] = useState(null);
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [openReportAccount, setOpenReportAccount] = useState(false);

  const [reportAccountForm, setReportAccountForm] = useState({
    reporterId: userInfo.accountId,
    reportedAccountId: profileId,
    reportedMessageId: null,
    reportedRoomId: null,
    reason: "",
  });

  const handleGetUserById = async (id) => {
    try {
      const res = await getUserByIdAPI(profileId);
      console.log("get profile detail", res.data);
      setProfileInfo(res.data);
    } catch (error) {
      console.log("get profile by id err", error);
    }
  };

  const handleGetAllPostOfUser = async () => {
    setLoading(true);
    try {
      const res = await getAllPostOfUserAPI(profileId);
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

  const handleSubmitReport = useCallback(async () => {
    try {
      console.log("report account data", reportAccountForm);
      const res = await createReportMessageAPI(reportAccountForm);
      console.log("reportMessageForm res", res.data);

      setReportAccountForm((prev) => ({
        ...prev,
        reason: "",
      }));

      setOpenReportAccount(false);
    } catch (error) {
      console.log("submit report err", error);
    }
  }, [reportAccountForm]);

  useFocusEffect(
    useCallback(() => {
      handleGetAllPostOfUser();
      handleGetUserById();
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
      <View key={post?.postId} className="bg-white-primary py-3 mb-3">
        {/* Post header */}
        <View className="flex-row items-center gap-3 mb-3 px-6">
          <Image
            source={{ uri: post?.author?.avatarUrl }}
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
      <View className="mb-3">
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
                profileInfo?.avatarUrl
                  ? { uri: profileInfo?.avatarUrl }
                  : require("@assets/images/avatar.png")
              }
              className="w-24 h-24 rounded-full bg-white-primary"
              resizeMode="cover"
            />
          </View>

          {/* Name and stats */}
          <View className="mt-2 items-center">
            <Text className="text-[20px] font-semibold text-black text-center">
              {profileInfo?.lastname} {profileInfo?.firstname}
            </Text>
          </View>

          {/* Bio */}
          <View className="mt-2 gap-3 items-center">
            <Text className="text-[13px] text-gray-700 text-center">
              {profileInfo?.bio}
            </Text>
          </View>

          {/*interest */}
          {profileInfo?.interests.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-3 -mx-1"
            >
              {profileInfo?.interests?.map((t, idx) => (
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
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
          </TouchableOpacity>
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
      </SafeAreaView>

      {openReportAccount && (
        <ModalReportAccount
          openReportAccount={openReportAccount}
          setOpenReportAccount={setOpenReportAccount}
          reportAccountForm={reportAccountForm}
          setReportAccountForm={setReportAccountForm}
          handleSubmitReport={handleSubmitReport}
        />
      )}

      {postId && <CommentModal setPostId={setPostId} postId={postId} />}
    </>
  );
}
