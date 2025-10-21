import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import ModalRewardHistory from "@components/ModalRewardHistory";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  claimQuestAPI,
  completeQuestAPI,
  getAccountQuestListAPI,
  getQuestListAPI,
  startQuestAPI,
} from "@services/questService";
import { AuthContext } from "../../../../context/AuthContext";
import YourTask from "@components/RewardScreenComponents/YourTask";
import ActiveTask from "@components/RewardScreenComponents/ActiveTask";
import TaskDetailModal from "@components/RewardScreenComponents/TaskDetailModal";
import LoadingCustom from "@components/LoadingCustom";
import useFetchList from "hooks/useFetchList";

export default function MainScreenReward() {
  const [openModalRewardHistory, setOpenModalRewardHistory] = useState(false);
  const { userId, userInfo } = useContext(AuthContext);
  const [taskDetailId, setTaskDetailId] = useState(null);

  // task user chưa có
  const { data: questList, loading: loadingAllTask } =
    useFetchList(getQuestListAPI);
  console.log("quest list", questList);

  // task của user
  const fetchYourTask = useCallback(
    () => getAccountQuestListAPI(userId),
    [userId]
  );
  const {
    data: yourTaskList,
    loading: loadingYourTask,
    refresh,
  } = useFetchList(fetchYourTask);
  console.log("your task list", yourTaskList);

  const handleStartQuest = async (taskId) => {
    try {
      const startQuestData = {
        accountId: userId,
        questId: taskId,
      };
      console.log("Start quest data: ", startQuestData);
      const res = await startQuestAPI(startQuestData);
      refresh();
      console.log("Start quest res: ", res.data);
    } catch (error) {
      console.log("Start quest error: ", error);
    }
  };

  const yourTaskStatusText = (status) => {
    switch (status) {
      case "InProgress":
        return "Chưa xong";
      case "Completed":
        return "Hoàn thánh";
      case "Claimed":
        return "Đã nhận thưởng";
    }
  };

  const yourTaskStatusColor = (status) => {
    switch (status) {
      case "InProgress":
        return "bg-yellow-300 text-white-primary self-start font-medium text-sm px-2 rounded-xl";
      case "Completed":
        return "bg-blue-300 text-white-primary self-start font-medium text-sm px-2 rounded-xl";
      case "Claimed":
        return "bg-green-300 text-white-primary self-start font-medium text-sm px-2 rounded-xl";
    }
  };

  const yourTaskStatusButton = (status) => {
    switch (status) {
      case "InProgress":
        return "Cập nhật";
      case "Completed":
        return "Nhận thưởng";
      case "Claimed":
        return "Đã nhận thưởng";
    }
  };

  const handleDoQuest = async (accountQuestId, status) => {
    try {
      switch (status) {
        case "InProgress": {
          const res = await completeQuestAPI(accountQuestId);
          console.log("complete quest res:", res.data);
          refresh();
          break;
        }
        case "Completed": {
          const res = await claimQuestAPI(accountQuestId);
          console.log("claim quest res:", res.data);
          refresh();
          break;
        }
        default:
          console.log("err status:", status);
      }
    } catch (error) {
      console.log("handleDoQuest error:", error);
    }
  };

  return (
    <>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
        {/*Header */}
        <View className="h-16 flex-row justify-between items-center px-6">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
          </TouchableOpacity>
          <Text className="text-black font-semibold text-2xl">Nhiệm vụ</Text>
          <Text className="w-[34px]" />
        </View>
        <View
          className="flex-1 bg-white-primary"
          // contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/**banner */}
          <View className="bg-black h-[140px]">
            <Text className="absolute text-white-primary top-4 left-6 text-lg font-medium">
              Mời thêm bạn bè{"\n"}
              Để nhận them điểm nhé
            </Text>
          </View>
          {/*Content */}
          <ScrollView className="absolute top-24 right-6 left-6 h-[85%]">
            {/*Point */}
            <View className="bg-white-primary border p-4 gap-6 rounded-lg">
              {/*Top */}
              <View className="flex-row bg-gray-100 p-1 items-center gap-2 border border-gray-300">
                <Image
                  source={require("@assets/icons/smellstar.png")}
                  className="w-12 h-12"
                />
                <View>
                  <Text className="text-2xl font-bold">2806 điểm</Text>
                  <Text className="text-gray-500">Tổng điểm</Text>
                </View>
              </View>
              {/**Link */}
              <View className="flex-row items-end justify-between">
                <View>
                  <Text className="font-bold text-lg">Mã mời</Text>
                  <Text className="text-gray-500">
                    www.buddyverse.vn/ag35dfw32
                  </Text>
                </View>
                <View className="border border-gray-400 p-1 px-2 rounded-lg">
                  <Text className="text-sm">Chia sẻ</Text>
                </View>
              </View>
            </View>

            {/*Reward */}
            <View className="bg-white-primary border mt-4 rounded-lg">
              <Text className="text-lg font-bold p-4">Nhiệm vụ của bạn</Text>
              {/*Reward item */}
              {loadingYourTask ? (
                <ActivityIndicator />
              ) : yourTaskList.length == 0 ? (
                <View className="flex-row items-center p-4">
                  <Text>Bạn chưa có nhiệm vụ</Text>
                </View>
              ) : (
                yourTaskList.map((item) => (
                  <View
                    key={item.accountQuestId}
                    className="flex-row items-center gap-4 border-t border-gray-400 px-4 py-2"
                  >
                    <View className="gap-1">
                      <Text className="font-semibold">{item?.title}</Text>
                      <Text className="text-gray-500">
                        {item?.rewardPoints}1500 điểm
                      </Text>
                    </View>
                    {/*Button */}
                    <TouchableOpacity
                      onPress={() =>
                        handleDoQuest(item.accountQuestId, item.status)
                      }
                      className="ml-auto border border-gray-400 p-1 px-2 rounded-lg"
                    >
                      <Text className="text-sm">
                        {yourTaskStatusButton(item?.status)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/*Nhiệm vụ có thể nhận */}
            <View className="gap-2">
              <Text className="text-lg font-bold mt-4">
                Nhiệm vụ có thể nhận
              </Text>
              {questList.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-4 bg-gray-100 rounded-xl p-2 px-4"
                >
                  <View>
                    <Text className="font-semibold">{item?.title}</Text>
                    <Text className="text-gray-500">
                      {item?.rewardPoints} điểm
                    </Text>
                  </View>
                  {/*Button */}
                  <TouchableOpacity
                    onPress={() => handleStartQuest(item.questId)}
                    className="ml-auto border border-gray-400 p-1 px-2 rounded-lg"
                  >
                    <Text className="text-sm">Nhận</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {taskDetailId && (
        <TaskDetailModal
          taskId={taskDetailId}
          setTaskDetailId={setTaskDetailId}
          refreshList={refresh}
        />
      )}
    </>
  );
}

