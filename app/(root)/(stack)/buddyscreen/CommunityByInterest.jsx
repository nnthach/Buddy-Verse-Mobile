import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { memo, useContext, useMemo } from "react";
import useQuery from "hooks/useQuery";
import { useDebounce } from "hooks/useDebounce";
import useFetchList from "hooks/useFetchList";
import { getInterestListAPI } from "@services/interestService";
import { ChatGroupContext } from "@context/ChatGroupContext";
import { getAllGroupAPI } from "@services/matchService";

function CommunityByInterest() {
  const { query, updateQuery, resetQuery } = useQuery({
    name: "",
    interestIds: [],
  });
  const { setGroupRoomId } = useContext(ChatGroupContext);

  const debouncedSearchInterest = useDebounce(query.interestIds, 500);
  const debouncedQuery = useMemo(
    () => ({ ...query, interestIds: debouncedSearchInterest }),
    [debouncedSearchInterest]
  );

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
  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-black px-6">
        Cộng đồng
      </Text>
      {/* filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6"
        contentContainerStyle={{ paddingRight: 24 }}
      >
        <TouchableOpacity
          onPress={() => updateQuery({ interestIds: [] })}
          className={`mr-2 px-3 py-2 rounded-full ${query?.interestIds.length > 0 ? "bg-gray-100" : "bg-black"}`}
        >
          <Text
            className={`text-[12px] ${query?.interestIds.length > 0 ? "text-black" : "text-white-primary"}`}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        {interestList.map((item) => {
          const selected = query.interestIds.includes(item.interestId);
          return (
            <TouchableOpacity
              key={item.interestId}
              onPress={() => handleSearchInterest(item.interestId)}
              className={`mr-2 px-3 py-2 rounded-full ${
                selected ? "bg-black" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-[12px] ${
                  selected ? "text-white-primary" : "text-gray-700"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/*group list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6"
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {groupList?.map((item) => (
          <TouchableOpacity
            key={item.roomId}
            onPress={() => {
              setGroupRoomId(item.roomId);
            }}
            className="w-[180px] mr-4 overflow-hidden"
          >
            <Image
              source={{ uri: item?.image }}
              className="w-full h-[110px] rounded-xl bg-gray-200"
              resizeMode="cover"
            />
            <View className="mt-2">
              <Text
                numberOfLines={1}
                className="text-[13px] font-semibold text-black-primary"
              >
                {item?.name}
              </Text>
              <Text className="text-[12px] text-gray-500">
                {item?.presentMember} Members
              </Text>
              <View className="flex-row items-center gap-1">
                {item?.interestNames.map((tag, index) => (
                  <View
                    key={index}
                    className="mt-1 self-start bg-gray-100 px-2 py-1 rounded-full"
                  >
                    <Text className="text-[11px] text-gray-600">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(CommunityByInterest);
