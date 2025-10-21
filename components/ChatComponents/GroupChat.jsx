import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import useFetchList from "hooks/useFetchList";
import { router } from "expo-router";
import { getAllGroupRoomOfUserAPI } from "@services/messageService";

export default function GroupChat({ userId }) {
  const fetchChatGroupRoomList = useCallback(
    () => getAllGroupRoomOfUserAPI(userId),
    [userId]
  );
  const { data: groupList, loading } = useFetchList(fetchChatGroupRoomList);

  const renderGroupItem = (item) => {
    return (
      <View className="py-3">
        <TouchableOpacity
          disabled
          // onPress={() =>
          //   router.push(`/(root)/(stack)/groupChat/${item.roomId}`)
          // }
          className="flex-row items-start gap-3"
        >
          {/* avatar */}
          <View className="w-12 h-12 bg-gray-500 rounded-full">
            <Image
              source={{ uri: item?.image }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>

          {/* name, preview, time */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text
                numberOfLines={1}
                className="text-gray-700 font-semibold text-lg max-w-[82%]"
              >
                {item?.name}
              </Text>
              {/*Time */}
              <Text className="text-[11px] text-gray-400 ml-2">
                {new Date(item?.lastMessageAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
      ) : groupList.length == 0 ? (
        <View className="gap-3 mt-3 px-6">
          <Text>No group found</Text>
        </View>
      ) : (
        <FlatList
          data={groupList}
          keyExtractor={(item) => item.roomId.toString()}
          className="flex-1 px-6"
          renderItem={({ item }) => renderGroupItem(item)}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}
    </>
  );
}
