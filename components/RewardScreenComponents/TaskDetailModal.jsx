import { memo, useEffect, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import {
  claimQuestAPI,
  completeQuestAPI,
  getAccountQuestByIdAPI,
  startQuestAPI,
} from "@services/questService";

function TaskDetailModal({ taskId, setTaskDetailId, refreshList }) {
  const [questDetail, setQuestDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("task detail id", taskId);

  const handleGetTaskDetail = async () => {
    setIsLoading(true);
    try {
      const res = await getAccountQuestByIdAPI(taskId);
      console.log("Get account quest detail res: ", res.data);
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

  const handleClaimQuest = async (accountQuestId) => {
    try {
      const res = await claimQuestAPI(accountQuestId);
      console.log("claim quest res: ", res.data);
      handleGetTaskDetail();
      refreshList();
    } catch (error) {
      console.log("claim quest error: ", error);
    }
  };

  const handleCompleteQuest = async (accountQuestId) => {
    console.log("accountQuestId", accountQuestId);
    try {
      const res = await completeQuestAPI(accountQuestId);
      console.log("complete quest res: ", res.data);
      handleGetTaskDetail();
      refreshList();
    } catch (error) {
      console.log("complete quest error: ", error);
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
        className="flex-1 bg-white-primary opacity-50"
        onPress={handleClose} // click ra ngoài để tắt
      />

      {/* Content */}
      <View className="absolute inset-0 items-center justify-center">
        <View className="bg-white-primary border border-black p-4 rounded-2xl w-[90%]">
          <View className="absolute top-[-10px] bg-purple-primary p-4 py-1 self-center rounded-full">
            <Text className="text-beige-primary font-medium text-lg">
              Chi tiét nhiệm vụ
            </Text>
          </View>

          <View className="my-4 mt-6">
            <Text className="font-semibold">Tên: {questDetail?.title}</Text>
            <Text className="">
              <Text className="font-semibold">Mô tả:</Text>
              {questDetail?.description}
            </Text>
            <Text className="">
              <Text className="font-semibold">Trạng thái:</Text>
              {questDetail?.status == "InProgress"
                ? "Đang thực hiện"
                : questDetail?.status == "Completed"
                  ? "Hoàn thành"
                  : "Đã nhận thưởng"}
            </Text>
          </View>

          {questDetail?.status == "Completed" ? (
            <TouchableOpacity
              className="bg-purple-primary/70 self-center px-4 py-1 pb-0 rounded-full"
              onPress={() => handleClaimQuest(questDetail?.accountQuestId)}
            >
              <Text className="text-white font-medium">Nhận tiền</Text>
            </TouchableOpacity>
          ) : questDetail?.status == "InProgress" ? (
            <TouchableOpacity
              className="bg-purple-primary/70 self-center px-4 py-1 pb-0 rounded-full"
              onPress={() => handleCompleteQuest(questDetail?.accountQuestId)}
            >
              <Text className="text-white font-medium">
                Xác nhận hoàn thành
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="bg-purple-primary/70 self-center px-4 py-1 pb-0 rounded-full">
              <Text className="text-white font-medium">Hoàn thành</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default memo(TaskDetailModal);
