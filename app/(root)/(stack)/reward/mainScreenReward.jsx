import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
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
  const [points, setPoints] = useState(8868);
  const [openModalRewardHistory, setOpenModalRewardHistory] = useState(false);
  const { userId, userInfo } = useContext(AuthContext);
  const [taskDetailId, setTaskDetailId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: questList, loading: loadingAllTask } =
    useFetchList(getQuestListAPI);

  const fetchYourTask = useCallback(
    () => getAccountQuestListAPI(userId),
    [userId]
  );
  const { data: yourTaskList, loading: loadingYourTask } =
    useFetchList(fetchYourTask);

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (isLoading) {
    return <LoadingCustom label="Loading..." />;
  }
  return (
    <>
      <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 90 }}
        >
          {/*Heading */}
          <View className=" h-16 flex-row justify-between items-center px-6">
            {/*Left */}
            <View className="flex-row items-center gap-3">
              <Image
                source={{
                  uri: userInfo?.photos?.[0],
                }}
                className="w-11 h-11 rounded-full"
                resizeMode="cover"
              />
              {/*Points */}
              <View className="flex-row rounded-full overflow-hidden border border-purple-third">
                <LinearGradient
                  colors={["#4B164C10", "#4B164C80"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View className="flex-row items-center gap-6 p-2">
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={require("@assets/icons/point.png")}
                        className="w-4 h-4"
                      />
                      <Text className="text-purple-primary font-bold">
                        8,868
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Add points");
                        router.push("/(root)/(stack)/reward/payment");
                      }}
                    >
                      <AntDesign name="pluscircleo" size={18} color="#F1F3E7" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>
            {/*Right */}
            <FontAwesome5 name="bell" size={24} color="#57298D" />
          </View>

          {/*Reward Progress & Leader board */}
          <View className="flex-row justify-between items-center gap-4 px-6 py-6 border-y border-purple-primary">
            {/*Reward Progress */}
            <TouchableOpacity
              onPress={() => setOpenModalRewardHistory(true)}
              className="h-24 rounded-2xl flex-1 p-2"
              style={{ backgroundColor: "#EDF0F7" }}
            >
              {/*Top */}
              <View className="flex-row justify-between items-center">
                <Image
                  source={require("@assets/icons/reward.png")}
                  className="w-6 h-6"
                  resizeMode="cover"
                />
                <Text className="text-purple-secondary/70 text-sm">
                  {points}/10000
                </Text>
              </View>
              {/*Bottom */}

              <View className="bg-purple-primary/30 w-full h-6 my-auto rounded-full overflow-hidden">
                <View className="h-full bg-purple-four w-[calc(8686/10000*100%)] rounded-full" />
              </View>
            </TouchableOpacity>
            {/*Leader board */}
            <TouchableOpacity
              onPress={() => router.push(`/(root)/(stack)/reward/leaderBoard`)}
              className="h-24 w-24 overflow-hidden rounded-2xl"
            >
              <Image
                source={require("@assets/images/leaderBoard.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          {/*Daily check in */}
          <View className="px-6 py-6 border-b border-purple-primary">
            {/*Heading */}
            <View className="items-center justify-between flex-row">
              <Feather name="grid" size={24} color="#57298D" />
              <View className="items-center">
                <Text className="text-center text-purple-primary font-semibold">
                  29
                </Text>
                <View className="flex-row items-center gap-1">
                  <Image
                    source={require("@assets/icons/fire.png")}
                    className="w-5 h-5"
                    resizeMode="cover"
                  />
                  <Text className="text-md text-purple-primary">Streaks</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setOpenModalRewardHistory(true)}>
                <Feather name="clock" size={24} color="#57298D" />
              </TouchableOpacity>
            </View>

            {/*Daily */}
            <View className=" bg-purple-primary/40 p-4 rounded-xl justify-center items-center gap-2 mt-6">
              <Text className="text-white text-xl font-semibold">
                Đăng nhập mỗi ngày
              </Text>
              <View className="flex-row flex-wrap gap-[13px] justify-between">
                {[...Array(4)].map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index);

                  return (
                    <View
                      key={index}
                      className=" bg-beige-primary rounded-lg items-center p-2"
                    >
                      <View className="w-[56px] h-[56px]  bg-white items-center justify-center rounded-full">
                        <Text className="text-purple-primary font-medium text-sm">
                          1500
                        </Text>
                        <Text className="text-purple-primary font-medium text-sm">
                          Điểm
                        </Text>
                      </View>
                      <Text className="text-black font-medium text-sm">
                        {index === 0 ? "Hôm nay" : formatDate(date)}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-purple-primary w-full justify-center items-center py-1 rounded-lg mt-2"
              >
                <Text className="text-white text-base font-semibold">
                  Nhận ngay 1500 điểm
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*Your task */}
          <YourTask
            yourTaskList={yourTaskList}
            setTaskDetailId={setTaskDetailId}
            loading={loadingYourTask}
          />

          {/*Active tasks */}
          <ActiveTask
            questList={questList}
            setTaskDetailId={setTaskDetailId}
            loading={loadingAllTask}
          />
        </ScrollView>
      </SafeAreaView>

      <ModalRewardHistory
        openModalRewardHistory={openModalRewardHistory}
        setOpenModalRewardHistory={setOpenModalRewardHistory}
      />

      {taskDetailId && (
        <TaskDetailModal
          taskId={taskDetailId}
          setTaskDetailId={setTaskDetailId}
        />
      )}
    </>
  );
}
