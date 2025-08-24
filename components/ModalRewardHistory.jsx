import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { fakeDataHistoryReward } from "data/fakeData";

export default function ModalRewardHistory({
  openModalRewardHistory,
  setOpenModalRewardHistory,
}) {
  const [historyList, setHistoryList] = useState(fakeDataHistoryReward);
  const historyItem = ({ item, index }) => {
    return (
      <View
        key={item.id}
        className="p-2 px-4 rounded-xl bg-beige-primary flex-row gap-4 items-start"
      >
        <Image
          source={require("@assets/icons/daily_checkin_reward.png")}
          className="w-10 h-10"
          resizeMode="contain"
        />
        <View className="max-w-[50%]">
          <Text className="font-semibold text-lg">{item.title}</Text>
          <Text className="text-sm">{item.description}</Text>
        </View>

        <View className="flex-1 items-end">
          <Text className="text-green-500 text-xl font-medium">
            +{item.points} pts
          </Text>
          <Text className="text-xs text-gray-400 text-right">{item.date}</Text>
        </View>
      </View>
    );
  };
  return (
    <Modal
      visible={openModalRewardHistory}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setOpenModalRewardHistory(false);
      }}
    >
      <View className="flex-1 bg-black/50 justify-end">
        {/* Overlay */}
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={() => setOpenModalRewardHistory(false)}
        />

        {/* Container */}
        <View className="h-[70%] bg-white rounded-t-2xl rounded-tl-[40px] rounded-tr-[40px] overflow-hidden">
          {/*Heading */}
          <View className="border-b border-gray-300 pb-4 flex-row justify-center items-center pt-4">
            <Text className="text-center text-xl font-semibold">History</Text>
          </View>

          {/*List */}
          <View className="p-6">
            <FlatList
              data={historyList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={historyItem}
              ItemSeparatorComponent={() => <View className="h-4" />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 60 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
