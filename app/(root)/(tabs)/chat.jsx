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

export default function ChatScreen() {
  const [searchAccount, setSearchAccount] = useState("");
  const [filterState, setFilterState] = useState("all");
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

    const timeText = otherMember?.time || item?.lastMessage?.time || "";

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
          <View className="w-10 h-10 bg-gray-500 rounded-full">
            <Image
              source={{ uri: otherMember?.photos[0] }}
              className="w-10 h-10 rounded-full"
              resizeMode="cover"
            />
          </View>

          {/* name, preview, time */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text
                numberOfLines={1}
                className="text-gray-700 font-semibold text-[14px]"
              >
                {otherMember?.username}
              </Text>
              {/*Time */}
              <Text className="text-[11px] text-gray-400 ml-2">23:11</Text>
            </View>
            <Text numberOfLines={1} className="text-[13px] text-gray-600 mt-1">
              an com chua bro
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
      <View className="h-16 flex-row justify-between items-center px-6">
        {/*Logo */}
        <View className="w-[150px] overflow-hidden">
          <Image
            source={require("@assets/images/logoTextBlack.png")}
            style={{ width: "100%", height: 84, resizeMode: "contain" }}
          />
        </View>
        <Entypo name="notification" size={22} color="black" />
      </View>

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
