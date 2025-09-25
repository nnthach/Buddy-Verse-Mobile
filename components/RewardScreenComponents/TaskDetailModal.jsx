import { memo } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text, TouchableOpacity, View } from "react-native";

function TaskDetailModal({ taskId, setTaskDetailId }) {
  const [questDetail, setQuestDetail] = useState(null);

  const handleGetTaskDetail = async () => {
    try {
      const res = await getQuestByIdAPI(taskId);
      console.log("Get task detail res: ", res.data);
      setQuestDetail(res.data);
    } catch (error) {
      console.log("Get task detail error: ", error);
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

  useFocusEffect(
    useCallback(() => {
      handleGetTaskDetail();
    }, [])
  );
  return (
    <View className="bg-white p-4 m-4 rounded-2xl">
      <View>
        <Text className="bg-green-400 self-start text-white items-center justify-center font-medium pt-1 px-2 rounded-full">
          {questDetail?.type}
        </Text>

        <TouchableOpacity onPress={() => setTaskDetailId(null)}>
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Text className="">{questDetail?.title}</Text>
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
  );
}

export default memo(TaskDetailModal);
