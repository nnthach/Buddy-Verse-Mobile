import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import useFetchList from "hooks/useFetchList";
import { router } from "expo-router";
import { getInterestListAPI } from "@services/interestService";
import { MatchContext } from "../../../../context/MatchContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChooseInterest() {
  const { data: interestList, loading } = useFetchList(getInterestListAPI);
  const { matchForm, setMatchForm } = useContext(MatchContext);

  const handleAddInterestList = (item) => {
    setMatchForm((prev) => {
      const isSelected = prev.interestIds.includes(item);

      return {
        ...prev,
        interestIds: isSelected
          ? prev.interestIds.filter((id) => id !== item)
          : [...prev.interestIds, item],
      };
    });
  };

  const handleNavigate = () => {
    if (matchForm.interestIds.length < 3) {
      Toast.show({
        type: "error",
        text1: "Hãy chọn ít nhất 3 điều bạn thích",
        text2: "Thử lại nhé",
      });
      return;
    } else if (matchForm.roomType === "") {
      router.back();
    } else {
      router.replace({
        pathname: "/(stack)/match/matchLoading",
        params: {
          label: "Đang kết nối...",
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      {/*Header */}
      <View className="h-16 px-6">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/*Main Content */}
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-semibold text-black text-center mb-12">
            Hãy chọn 3 sở thích của bạn
          </Text>

          {/*Interest Grid */}
          <View className="flex-row flex-wrap justify-start gap-3 mb-12">
            {loading ? (
              <ActivityIndicator size="large" color="#FBD157" />
            ) : (
              interestList.map((item) => (
                <TouchableOpacity
                  key={item.interestId}
                  activeOpacity={0.8}
                  onPress={() => handleAddInterestList(item.interestId)}
                  className={`w-[30%] aspect-square rounded-xl items-center justify-center p-3 ${
                    matchForm.interestIds.includes(item.interestId)
                      ? "bg-yellow-primary"
                      : "bg-gray-five"
                  }`}
                >
                  <View className="w-8 h-8 bg-gray-primary rounded-full mb-2" />
                  <Text className="text-lg text-black text-center font-medium">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/*Bottom Buttons */}
        <View className="gap-4">
          {/*Continue Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNavigate}
            disabled={matchForm.interestIds.length < 3}
            className={`h-14 rounded-xl items-center justify-center ${
              matchForm.interestIds.length >= 3
                ? "bg-yellow-primary"
                : "bg-gray-five"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                matchForm.interestIds.length >= 3
                  ? "text-white-primary"
                  : "text-gray-primary"
              }`}
            >
              {matchForm.roomType == "" ? "Đóng" : "Tiếp tục"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
