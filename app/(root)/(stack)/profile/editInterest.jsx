import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import useFetchList from "hooks/useFetchList";
import { getInterestListAPI } from "@services/interestService";

export default function EditInterest() {
  const { data: interestList, loading } = useFetchList(getInterestListAPI);
  const [editInterestList, setEditInterestList] = useState({
    interestIds: [],
  });

  const handleAddInterestList = (item) => {
    setEditInterestList((prev) => {
      const isSelected = prev.interestIds.includes(item);

      return {
        ...prev,
        interestIds: isSelected
          ? prev.interestIds.filter((id) => id !== item)
          : [...prev.interestIds, item],
      };
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("edit interest", editInterestList);
    } catch (error) {
      console.log("edit interest err", error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      {/*Header */}
      <View className="h-16 px-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        </TouchableOpacity>
        <Text className="font-semibold text-xl">Cập nhật sở thích</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSubmit}
          className={`rounded-xl items-center justify-center ${editInterestList?.interestIds.length > 2 ? "bg-yellow-primary" : "bg-gray-200"}`}
        >
          <Text className={` py-1 px-2 text-lg text-white-primary`}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <View
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/*Main Content */}
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-semibold text-black text-center mb-12">
            Hãy chọn ít nhất 3 sở thích của bạn
          </Text>

          {/*Interest Grid */}
          <ScrollView
            className="max-h-[80%] overflow-auto"
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#FBD157" />
            ) : (
              interestList.map((item) => (
                <TouchableOpacity
                  key={item.interestId}
                  activeOpacity={0.8}
                  onPress={() => handleAddInterestList(item.interestId)}
                  className={`w-[30%] aspect-square rounded-xl items-center justify-center p-3 mb-4 ${
                    editInterestList?.interestIds.includes(item.interestId)
                      ? "bg-yellow-primary"
                      : "bg-gray-five"
                  }`}
                >
                  <View className="w-16 h-16 bg-white-primary rounded-full mb-2">
                    <Image
                      source={{
                        uri: item.image,
                      }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <Text className="text-lg text-black text-center font-medium">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
