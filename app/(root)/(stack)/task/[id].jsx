import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getQuestByIdAPI, startQuestAPI } from "@services/questService";
import { AuthContext } from "../../../../context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const [questDetail, setQuestDetail] = useState(null);
  const { userId } = useContext(AuthContext);

  const handleGetTaskDetail = async () => {
    try {
      const res = await getQuestByIdAPI(id);
      console.log("Get task detail res: ", res.data);
      setQuestDetail(res.data);
    } catch (error) {
      console.log("Get task detail error: ", error);
    }
  };

  const handleStartQuest = async (questId) => {
    try {
      const startQuestData = {
        accountId: userId,
        questId,
      };
      console.log("Start quest data: ", startQuestData);
      const res = await startQuestAPI(startQuestData);
      console.log("Start quest res: ", res.data);
    } catch (error) {
      console.log("Start quest error: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetTaskDetail();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      {/*Heading */}
      <View className="h-16 flex-row justify-between items-center px-4 border-b border-yellow-50">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="#57298D" />
        </TouchableOpacity>
      </View>

      {/*Content */}
      <View>
        <Text>{questDetail?.type}</Text>
        <Text>{questDetail?.title}</Text>
        <Text>{questDetail?.description}</Text>
        <Text>{questDetail?.rewardPoints}</Text>
        <Text>{questDetail?.expiredAt}</Text>

        <TouchableOpacity
          onPress={() => handleStartQuest(questDetail?.questId)}
          className="bg-purple-primary/70 mt-auto rounded-full px-4 py-2 flex-row items-center justify-center gap-2 "
        >
          <Text className="text-white font-semibold">Do Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
