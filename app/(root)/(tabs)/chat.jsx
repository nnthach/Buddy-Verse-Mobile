import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fakeDataMessageList } from "data/fakeData";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { AuthContext } from "../../../context/AuthContext";
import { getAllRoomOfUserAPI } from "@services/messageService";
import LoadingCustom from "@components/LoadingCustom";

export default function ChatScreen() {
  const [searchAccount, setSearchAccount] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [roomList, setRoomList] = useState([]);
  const { userId } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const getAllRoomOfUser = async () => {
    setIsLoading(true);
    try {
      const res = await getAllRoomOfUserAPI(userId);
      console.log("get all room of user res: ", res.data);
      console.log("get all room with member: ", res.data.roomMembers);
      setRoomList(res.data);
    } catch (error) {
      console.log("get all room of user error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllRoomOfUser();
    }, [])
  );

  const userMessageItem = (item) => {
    const otherMember = item.roomMembers.find(
      (member) => member.accountId !== userId
    );

    return (
      <View className="h-20 py-3">
        <TouchableOpacity
          // onPress={() => router.push(`/(root)/(stack)/chat/${item.roomId}`)}
          onPress={() =>
            router.push({
              pathname: `/(root)/(stack)/chat/${item.roomId}`,
              params: {
                roomId: item.roomId,
                accountId2: otherMember.accountId, // truyền thêm ở đây
              },
            })
          }
          className="flex-row gap-2 items-center"
        >
          {/*Avatar */}
          <Image
            source={{
              uri: otherMember?.photos[0],
            }}
            className="w-14 h-14 rounded-full"
            resizeMode="cover"
          />
          {/*Name & message */}
          <View className="flex-1">
            <Text className="font-semibold text-xl">
              {otherMember?.username}
            </Text>
            <Text className="text-gray-500">{otherMember?.message}</Text>
          </View>
          {/*Time & number */}
          <View className="items-end h-full justify-between py-1">
            <Text className="text-gray-400 text-xs">{otherMember?.time}</Text>
            {otherMember?.numberOfMessage != 0 && (
              <Text className="bg-red-500 rounded-full w-5 h-5 text-center text-white text-xs leading-5">
                {otherMember?.numberOfMessage}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingCustom label="Loading..." />;
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
      {/*Heading */}
      <View className="bg-white h-16 flex-row justify-between items-center px-6">
        {/*Logo */}
        <View>
          <Text>logo</Text>
        </View>
        <FontAwesome5 name="bell" size={24} color="#57298D" />
      </View>

      {roomList.length == 0 ? (
        <View className="gap-3 mt-3 px-6">
          {/*Search */}
          <View className=" border border-purple-primary rounded-xl h-14 w-full items-center flex-row px-3 ">
            <Ionicons name="search-sharp" size={24} color="#57298D" />
            <TextInput
              className="flex-1 h-full px-3 pb-1 text-xl text-purple-primary "
              onChangeText={(text) => setSearchAccount(text)}
              textAlignVertical="center"
              placeholder="Search"
              placeholderTextColor="#57298D80"
            />
          </View>

          {/*filter */}
          <View className="h-12 items-center">
            <View className="flex-row justify-between w-full">
              {["all", "unread", "groups"].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setFilterState(item)}
                  className={`border rounded-xl w-[32%] py-2 ${filterState == item ? "bg-purple-third border-purple-third" : "border-gray-300"}`}
                >
                  <Text
                    className={`${filterState == item ? " text-beige-primary" : "text-purple-primary "} text-center`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
          ListHeaderComponent={
            <View className="gap-3 mt-3">
              {/*Search */}
              <View className=" border border-purple-primary rounded-xl h-14 w-full items-center flex-row px-3 ">
                <Ionicons name="search-sharp" size={24} color="#57298D" />
                <TextInput
                  className="flex-1 h-full px-3 pb-1 text-xl text-purple-primary "
                  onChangeText={(text) => setSearchAccount(text)}
                  textAlignVertical="center"
                  placeholder="Search"
                  placeholderTextColor="#57298D80"
                />
              </View>

              {/*filter */}
              <View className="h-12 items-center">
                <View className="flex-row justify-between w-full">
                  {["all", "unread", "groups"].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setFilterState(item)}
                      className={`border rounded-xl w-[32%] py-2 ${filterState == item ? "bg-purple-third border-purple-third" : "border-gray-300"}`}
                    >
                      <Text
                        className={`${filterState == item ? " text-beige-primary" : "text-purple-primary "} text-center`}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
