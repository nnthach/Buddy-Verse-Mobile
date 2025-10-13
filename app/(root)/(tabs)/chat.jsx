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
import Entypo from "@expo/vector-icons/Entypo";
import MainHeader from "@components/MainHeader";

export default function ChatScreen() {
  const { userId } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchYourTask = useCallback(
    () => getAllRoomOfUserAPI(userId),
    [userId]
  );
  const { data: roomList, loading } = useFetchList(fetchYourTask);

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

  if (isLoading) {
    return <LoadingCustom label="Loading..." />;
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Heading */}
      <MainHeader />

      {loading ? (
        <ActivityIndicator />
      ) : roomList.length == 0 ? (
        <View className="gap-3 mt-3 px-6">
          <Text>No chat found</Text>
        </View>
      ) : (
        <FlatList
          data={roomList}
          keyExtractor={(item) => item.roomId.toString()}
          className="flex-1 px-6"
          renderItem={({ item }) => userMessageItem(item)}
          contentContainerStyle={{ paddingBottom: 90 }}
          initialNumToRender={13}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}
