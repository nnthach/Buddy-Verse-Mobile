import React, { useContext } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { NotificationContext } from "@context/NotificationContext";

const sampleData = [
  {
    id: "1",
    avatar: require("@assets/images/applogo.png"),
    name: "Pickle",
    message:
      'Pickle mentioned you in a post. "Had a blast at my Pickle McParty birthday celebration. Thanks for the bone @Yuna! Can\'t wait to party with you again!"',
    time: "Now",
  },
  {
    id: "2",
    avatar: require("@assets/images/applogo.png"),
    name: "Knives",
    message: "Knives followed Pepper and Sam.",
    time: "Tuesday",
  },
  {
    id: "3",
    avatar: require("@assets/images/applogo.png"),
    name: "Sky",
    message: "Sky and 23 others liked your post",
    time: "4d ago",
  },
  {
    id: "4",
    avatar: require("@assets/images/applogo.png"),
    name: "Pepper",
    message:
      'Pepper made a new post "Had a blast with my family at the pumpkin patch!"',
    time: "6d ago",
  },
  {
    id: "5",
    avatar: require("@assets/images/applogo.png"),
    name: "Hiro",
    message: "Hiro posted a new #shiba photo.",
    time: "1 week ago",
  },
  {
    id: "6",
    avatar: require("@assets/images/applogo.png"),
    name: "Zen Pablo",
    message: "Zen Pablo and 3 others started following you.",
    time: "2 months ago",
  },
  {
    id: "7",
    avatar: require("@assets/images/applogo.png"),
    name: "Gibby",
    message:
      'Gibby mentioned you in a post "Cats and dogs can be friends. Me and @Yuna have hang out every week. Go make a dog friend today!"',
    time: "more than 1 year ago",
  },
  {
    id: "8",
    avatar: require("@assets/images/applogo.png"),
    name: "Gibby",
    message:
      'Gibby mentioned you in a post "Cats and dogs can be friends. Me and @Yuna have hang out every week. Go make a dog friend today!"',
    time: "more than 1 year ago",
  },
  {
    id: "9",
    avatar: require("@assets/images/applogo.png"),
    name: "Gibby",
    message:
      'Gibby mentioned you in a post "Cats and dogs can be friends. Me and @Yuna have hang out every week. Go make a dog friend today!"',
    time: "more than 1 year ago",
  },
  {
    id: "10",
    avatar: require("@assets/images/applogo.png"),
    name: "Gibby",
    message:
      'Gibby mentioned you in a post "Cats and dogs can be friends. Me and @Yuna have hang out every week. Go make a dog friend today!"',
    time: "more than 1 year ago",
  },

  {
    id: "11",
    avatar: require("@assets/images/applogo.png"),
    name: "Gibby",
    message:
      'Gibby mentioned you in a post "Cats and dogs can be friends. Me and @Yuna have hang out every week. Go make a dog friend today!"',
    time: "more than 1 year ago",
  },
];

export default function Notification() {
  const { isOpenNotification, setIsOpenNotification } =
    useContext(NotificationContext);

  const renderItem = ({ item }) => (
    <View className="flex-row items-start px-6 py-3 bg-white-primary">
      <Image source={item.avatar} className="w-9 h-9 rounded-full mr-3" />
      <View className="flex-1">
        <Text className="font-semibold text-sm text-black-primary">
          {item.name}
        </Text>
        <Text className="text-[13px] text-gray-600 mt-1">{item.message}</Text>
      </View>
      <Text className="text-[12px] text-gray-400 ml-2">{item.time}</Text>
    </View>
  );

  const ItemSeparator = () => <View className="h-[1px] bg-gray-100 mx-4" />;

  return (
    <View
      className={`${isOpenNotification ? "" : "hidden"} absolute top-[80px] left-0 right-0 bottom-0 bg-white-primary `}
    >
      <Text className="px-6 text-xl font-semibold">Thông báo</Text>
      <FlatList
        data={sampleData}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
