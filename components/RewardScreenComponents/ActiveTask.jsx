import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { memo } from "react";

function ActiveTask({ questList }) {
  const activeTaskItem = ({ item, index }) => {
    return (
      <View
        className={`w-40 h-40 bg-white rounded-2xl p-3 ${
          index == 0
            ? "mx-4 ml-6"
            : index == questList.length - 1
              ? "mr-6"
              : "mr-4"
        }`}
      >
        <Text className="bg-green-400 self-start text-white text-sm font-medium p-1 px-2 rounded-full">
          {item.type}
        </Text>
        <Text className="font-medium mt-2">{item.title}</Text>
        <View className="items-center justify-left gap-1 flex-row">
          <Image
            source={require("@assets/icons/point.png")}
            className="w-4 h-4"
          />
          <Text className="">{item.rewardPoints}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push(`/(stack)/task/${item.questId}`)}
          className="bg-purple-primary/70 mt-auto rounded-full px-4 py-1 flex-row items-center justify-center gap-2 "
        >
          <Text className="text-white text-sm font-semibold">View Tasks</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View className="py-6">
      {/*Heading */}
      <View className="w-full flex-row items-center justify-between px-6">
        <Text className="text-purple-primary text-2xl font-bold">
          Active Tasks
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(stack)/task/taskList",
              params: { type: "quest-list" },
            })
          }
          className="flex-row items-center"
        >
          <Text className="text-purple-primary/50 text-lg">See more</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color="rgba(87,41,141,0.5)"
          />
        </TouchableOpacity>
      </View>

      {/*Content */}
      <View className="mt-4">
        <FlatList
          data={questList}
          horizontal
          keyExtractor={(item) => item.questId.toString()}
          renderItem={activeTaskItem}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

export default memo(ActiveTask);
