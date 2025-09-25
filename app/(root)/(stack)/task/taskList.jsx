import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  getAccountQuestListAPI,
  getQuestListAPI,
} from "@services/questService";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingCustom from "@components/LoadingCustom";

export default function TaskList() {
  const { type } = useLocalSearchParams();
  const [taskListData, setTaskListData] = useState(null);
  const { userId } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetQuestList = async () => {
    setIsLoading(true);
    try {
      const res = await getQuestListAPI();
      setTaskListData(res.data);
    } catch (error) {
      console.log("Get quest list error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAccountQuestList = async () => {
    setIsLoading(true);
    try {
      const res = await getAccountQuestListAPI(userId);
      setTaskListData(res.data);
    } catch (error) {
      console.log("Get account task list error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (type === "quest-list") {
        handleGetQuestList();
        return;
      }
      handleGetAccountQuestList();
    }, [])
  );

  const taskItem = ({ item, index }) => (
    <View className="w-full bg-white rounded-2xl p-2 px-4 flex-row items-center justify-between">
      <View className="gap-1">
        <Text className="text-base font-semibold">Uong nuoc</Text>
        <Text className="text-gray-500">di uong nuoc di anh em oi</Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push(`/(stack)/task/${item?.questId}`)}
        className="bg-yellow-300 rounded-full p-1"
      >
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <LoadingCustom label="Loading..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      {/*Heading */}
      <View className="flex-row justify-between items-center px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="#57298D" />
        </TouchableOpacity>
        <Text className="text-purple-primary font-semibold text-2xl">
          Nhiệm vụ
        </Text>
        <Text className="w-[34px]" />
      </View>

      {/*Content */}
      <FlatList
        data={taskListData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={taskItem}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}
