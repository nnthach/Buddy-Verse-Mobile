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
import { AuthContext } from "@context/AuthContext";
import { updateUserInterestAPI } from "@services/userService";
import Toast from "react-native-toast-message";

export default function EditInterest() {
  const { data: interestList, loading } = useFetchList(getInterestListAPI);
  const [editInterestList, setEditInterestList] = useState([]);
  const { userId, userInfo, handleGetUserById } = useContext(AuthContext);

  const handleAddInterestList = (item) => {
    setEditInterestList((prev) => {
      return prev.includes(item)
        ? prev.filter((id) => id !== item)
        : [...prev, item];
    });
  };

  const handleSubmit = async () => {
    try {

      const res = await updateUserInterestAPI(userId, editInterestList);
      await handleGetUserById(userId);

      Toast.show({
        type: "success",
        text1: "Cập nhật sở thích thành công!",
        text2: "Thành công",
      });
      setEditInterestList([]);
      router.back();
    } catch (error) {
      console.log("edit interest err", error);
      Toast.show({
        type: "error",
        text1: "Cập nhật sở thích thất bại!",
        text2: "Thử lại nhé",
      });
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
          className={`rounded-xl items-center justify-center ${editInterestList?.length > 2 ? "bg-yellow-primary" : "bg-gray-200"}`}
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
                    editInterestList?.includes(item.interestId)
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
