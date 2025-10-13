import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../../context/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { getUserByIdAPI } from "@services/userService";
import ModalReportAccount from "@components/ReportComponent/ModalReportAccount";
import { createReportMessageAPI } from "@services/reportService";

export default function ProfileByIdScreen() {
  const { profileId } = useLocalSearchParams();

  const [openReportAccount, setOpenReportAccount] = useState(false);

  const { userInfo } = useContext(AuthContext);

  const [reportAccountForm, setReportAccountForm] = useState({
    reporterId: userInfo.accountId,
    reportedAccountId: profileId,
    reportedMessageId: null,
    reportedRoomId: null,
    reason: "",
  });

  const [profileInfo, setProfileInfo] = useState(null);

  const handleGetUserById = async (id) => {
    try {
      const res = await getUserByIdAPI(profileId);
      console.log("get profile detail", res.data);
      setProfileInfo(res.data);
    } catch (error) {
      console.log("get profile by id err", error);
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

  useEffect(() => {
    handleGetUserById();
  }, []);

  return (
    <>
      <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
        {/*Header */}
        <View className="px-6 h-16 flex-row justify-between items-center overflow-hidden">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
          </TouchableOpacity>
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
                  profileInfo?.photos?.[0]
                    ? { uri: profileInfo.photos[0] }
                    : require("@assets/images/avatar.png")
                }
                className="w-20 h-20 rounded-full"
                resizeMode="cover"
              />
            </View>

            {/* Name and stats */}
            <View className="mt-2 items-center">
              <Text className="text-[20px] font-semibold text-black text-center">
                {profileInfo?.lastname} {profileInfo?.firstname}
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
                    <MaterialIcons
                      name="more-horiz"
                      size={22}
                      color="#6C757D"
                    />
                  </View>

                  {/* Post content */}
                  {post.content?.length > 0 && (
                    <Text className="pb-3 text-[16px] text-black">
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
                        <FontAwesome5
                          name="comment"
                          size={18}
                          color="#6C757D"
                        />
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
                  <Text className="pb-3 text-gray-500 text-xs">
                    {post.time}
                  </Text>

                  {/* Separator */}
                  <View className="h-[1px] bg-black/10" />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
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
    </>
  );
}
