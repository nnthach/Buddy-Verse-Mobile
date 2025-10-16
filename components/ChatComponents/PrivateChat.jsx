import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import { getAllRoomOfUserAPI } from "@services/messageService";
import useFetchList from "hooks/useFetchList";
import { router } from "expo-router";

export default function PrivateChat({ userId }) {
  const fetchChatRoomList = useCallback(
    () => getAllRoomOfUserAPI(userId),
    [userId]
  );
  const { data: roomList, loading } = useFetchList(fetchChatRoomList);

  const renderRoomItem = (item) => {
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
    <>
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
          renderItem={({ item }) => renderRoomItem(item)}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}
    </>
  );
}
