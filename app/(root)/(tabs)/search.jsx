import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useMemo, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetchList from "hooks/useFetchList";
import { getInterestListAPI } from "@services/interestService";
import useQuery from "../../../hooks/useQuery";
import { useDebounce } from "../../../hooks/useDebounce";
import { getAllGroupAPI } from "../../../services/matchService";
import { ChatGroupContext } from "@context/ChatGroupContext";

export default function SearchScreen() {
  const { query, updateQuery, resetQuery } = useQuery({
    name: "",
    interestIds: [],
  });
  const { setGroupRoomId } = useContext(ChatGroupContext);

  // const debouncedSearchInterest = useDebounce(query.interestIds, 500);
  // const debouncedSearchName = useDebounce(query.name, 500);
  // const debouncedQuery = useMemo(
  //   () => ({
  //     ...query,
  //     interestIds: debouncedSearchInterest,
  //     name: debouncedSearchName,
  //   }),
  //   [debouncedSearchInterest, debouncedSearchName]
  // );

  const debouncedQuery = useDebounce(query, 500);

  const { data: interestList, loading } = useFetchList(getInterestListAPI);
  const { data: groupList, loading: groupLoading } = useFetchList(
    getAllGroupAPI,
    debouncedQuery
  );

  const handleSearchInterest = (interestId) => {
    updateQuery((prev) => {
      const current = prev.interestIds || [];
      const isSelected = current.includes(interestId);
      const newIds = isSelected
        ? current.filter((id) => id !== interestId)
        : [...current, interestId];

      return { ...prev, interestIds: newIds };
    });
  };

  const handleSearchName = (data) => {
    updateQuery({ name: data });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Header search */}
      <View className="px-6 mt-4">
        {/* Search Input Field */}
        <View className="flex-row items-center justify-center mb-4">
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-1 flex-1 border border-gray-200">
            <Ionicons name="search" size={22} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="Search for tags and users"
              placeholderTextColor="#9CA3AF"
              value={query.name}
              onChangeText={(text) => handleSearchName(text)}
            />
          </View>
        </View>

        {/* Filter Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {interestList.map((item, index) => {
            const selected = query.interestIds.includes(item.interestId);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSearchInterest(item.interestId)}
                className={`mr-2 px-3 py-2 rounded-full ${
                  selected ? "bg-black" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selected ? "text-white-primary" : "text-gray-700"
                  }`}
                >
                  {item?.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={true}
      >

          

        {/* Pets you follow */}
        <View className="px-6 mb-6 mt-4">
          <Text className="text-lg font-bold text-black mb-3">
            Pets you follow
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {groupList?.map((group, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-yellow-100 rounded-lg mr-3 overflow-hidden"
              >
                {/* <Image
                  source={require("@assets/images/searchListImage.png")}
                  style={{ width: "100%", height: "100%" }}
                /> */}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">Trending</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-yellow-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={require("@assets/images/searchListImage.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* New */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">New</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-yellow-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={require("@assets/images/searchListImage.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Suggested for you */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">
            Suggested for you
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-yellow-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={require("@assets/images/searchListImage.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
