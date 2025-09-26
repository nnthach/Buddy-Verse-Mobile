import { memo, useCallback, useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { getQuestByIdAPI } from "@services/questService";

function TaskDetailModal({ taskId, setTaskDetailId }) {
  const [questDetail, setQuestDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetTaskDetail = async () => {
    setIsLoading(true);
    try {
      const res = await getQuestByIdAPI(taskId);
      console.log("Get task detail res: ", res.data);
      setQuestDetail(res.data);
    } catch (error) {
      console.log("Get task detail error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuest = async () => {
    try {
      const startQuestData = {
        accountId: userId,
        taskId,
      };
      console.log("Start quest data: ", startQuestData);
      const res = await startQuestAPI(startQuestData);
      console.log("Start quest res: ", res.data);
    } catch (error) {
      console.log("Start quest error: ", error);
    }
  };

  useEffect(() => {
    if (taskId) {
      handleGetTaskDetail();
    }
  }, [taskId]);

  const visible = !!taskId;

  const handleClose = () => {
    setTaskDetailId(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Overlay */}
      <Pressable
        className="flex-1 bg-black opacity-50"
        onPress={handleClose} // click ra ngoài để tắt
      />

      {/* Content */}
      <View className="absolute inset-0 items-center justify-center">
        <View className="bg-white p-4 rounded-2xl w-[90%]">
          <Text className="bg-green-400 self-start text-white font-medium pt-1 px-2 rounded-full">
            {questDetail?.type}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

export default memo(TaskDetailModal);
