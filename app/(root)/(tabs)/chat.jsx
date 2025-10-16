import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AuthContext } from "../../../context/AuthContext";
import { getAllRoomOfUserAPI } from "@services/messageService";
import LoadingCustom from "@components/LoadingCustom";
import useFetchList from "hooks/useFetchList";
import MainHeader from "@components/MainHeader";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PrivateChat from "@components/ChatComponents/PrivateChat";
import GroupChat from "@components/ChatComponents/GroupChat";

export default function ChatScreen() {
  const { userId } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Private");

  const fetchChatRoomList = useCallback(
    () => getAllRoomOfUserAPI(userId),
    [userId]
  );
  const { data: roomList, loading } = useFetchList(fetchChatRoomList);

  const userMessageItem = (item) => {
    const otherMember = item.roomMembers.find(
      (member) => member.accountId !== userId
    );

    return (
      <View className="py-3">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/(root)/(stack)/chat/${item.roomId}`,
              params: {
                accountId2: otherMember.accountId,
              },
            })
          }
          className="flex-row items-start gap-3"
        >
          {/* avatar */}
          <View className="w-12 h-12 bg-gray-500 rounded-full">
            <Image
              source={{ uri: otherMember?.photos[0] }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>

          {/* name, preview, time */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text
                numberOfLines={1}
                className="text-gray-700 font-semibold text-lg"
              >
                {otherMember?.username}
              </Text>
              {/*Time */}
              <Text className="text-[11px] text-gray-400 ml-2">
                {new Date(item?.lastMessageAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              </Text>
            </View>
            <Text numberOfLines={1} className="text-base text-gray-600">
              {item?.lastMessageContent}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Heading */}
      <MainHeader />

      {/*type of chat */}
      <View className="flex-row items-center justify-between px-6 gap-3 my-3">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveTab("Private")}
          className={`px-4 py-2 rounded-lg border w-[50%] ${
            activeTab === "Private" ? "bg-black" : "bg-white-primary"
          }`}
        >
          <Text
            className={`font-semibold text-center ${
              activeTab === "Private" ? "text-white-primary" : "text-gray-700"
            }`}
          >
            Private
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveTab("Group")}
          className={`px-4 py-2 rounded-lg border  w-[50%] ${
            activeTab === "Group" ? "bg-black" : "bg-white-primary"
          }`}
        >
          <Text
            className={`font-semibold text-center ${
              activeTab === "Group" ? "text-white-primary" : "text-gray-700"
            }`}
          >
            Group
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Private" ? (
        <PrivateChat userId={userId} />
      ) : (
        <GroupChat userId={userId} />
      )}

      {/*floating button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/(root)/(stack)/chat/createGroup")}
        className="absolute right-4 bottom-24 bg-yellow-400 w-16 h-16 rounded-full items-center justify-center shadow-md"
      >
        <MaterialIcons name="group-add" size={20} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
