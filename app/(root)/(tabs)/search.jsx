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

  const trendingData = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiRu3CHYnGE9Fq69bqI_sOH_zbSdisP6272Q&s",
    "https://media.istockphoto.com/id/1035676256/photo/background-of-galaxy-and-stars.jpg?s=612x612&w=0&k=20&c=dh7eWJ6ovqnQZ9QwQQlq2wxqmAR7mgRlQTgaIylgBwc=",
    "https://jp.static.pronews.com/pronewscore/wp-content/uploads/2024/10/241014_Photoshop_top-560x410.jpg",
  ];

  const newData = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6wHc3OzKebPw9iQ9NMcjKRHSxIFKN2Ds2LQ&s",
    "https://cdn2.tuoitre.vn/471584752817336320/2025/7/28/2025-07-28t101548z2070528497rc2mvfa7mp9grtrmadp3thailand-cambodia-malaysia-1753701023211168126167.jpg",
    "https://forbes.vn/wp-content/uploads/2025/04/thailand-cambodia-paetongtarn_Bangkok-Post_c1_3007239_250421093800.jpg",
  ];

  const suggetData = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ45YQWCqiGTmYd4XL6iLsfFNfRhTjaWC27EA&s",
    "https://vcdn1-thethao.vnecdn.net/2025/10/17/mu-1760694964-1760695093-8893-1760695212.jpg?w=500&h=300&q=100&dpr=1&fit=crop&s=_6Fu6Nq3BFaU4Pov56gLMw",
    "https://diff.vn/wp-content/uploads/2025/06/Copy-of-MU-team-1.jpg",
  ];

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
            Nhóm hoạt động
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {groupList?.map((group, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-gray-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={{ uri: group?.image }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">Xu hướng</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {trendingData.map((item, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-gray-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* New */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">Tin tức</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {newData.map((item, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-gray-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Suggested for you */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">
            Gợi ý cho bạn
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {suggetData.map((item, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-gray-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={{ uri: item }}
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
