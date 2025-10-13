import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { memo } from "react";

function YourTask({ yourTaskList, setTaskDetailId, loading }) {
  const yourTaskItem = ({ item, index }) => {
    return (
      <View
        className={`w-full bg-gray-100 rounded-2xl p-2 px-4 flex-row items-center justify-between`}
      >
        <View className="gap-1">
          <Text
            className={`font-medium text-white-primary self-start rounded-xl px-2 pt-1 ${
              item?.status === "InProgress"
                ? "bg-yellow-primary"
                : item?.status === "Completed"
                  ? "bg-blue-400"
                  : "bg-green-400"
            }`}
          >
            {item?.status === "InProgress"
              ? "Đang thực hiện"
              : item?.status === "Completed"
                ? "Hoàn thành"
                : "Đã nhận thưởng"}
          </Text>

          <Text className="text-base font-semibold">{item?.title}</Text>
          <Text className="text-gray-500">{item?.description}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setTaskDetailId(item?.accountQuestId)}
          className="bg-yellow-300 rounded-full p-1"
        >
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View className="pt-6">
      {/*Heading */}
      <View className="w-full flex-row items-center justify-between px-6">
        <Text className="text-black text-2xl font-bold">Nhiệm vụ đang làm</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(stack)/task/taskList",
              params: { type: "your-task-list" },
            })
          }
          className="flex-row items-center"
        >
          <Text className="text-black/50 text-lg">Xem thêm</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color="rgba(0,0,0,0.5)"
          />
        </TouchableOpacity>
      </View>

      {/*Content */}
      <View className="mt-4 px-6">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={yourTaskList.slice(0, 5)} // chỉ lấy 5 phần tử
            keyExtractor={(item) => item.questId.toString()}
            renderItem={yourTaskItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}
      </View>
    </View>
  );
}

export default memo(YourTask);
