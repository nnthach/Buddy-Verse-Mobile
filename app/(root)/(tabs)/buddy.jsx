import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../context/AuthContext";
import { MatchContext } from "../../../context/MatchContext";
import { getInterestListAPI } from "services/interestService";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export default function BuddyScreen() {
  const { userId } = useContext(AuthContext);
  const { matchForm, setMatchForm, initialMatchForm } =
    useContext(MatchContext);

  const [interestList, setInterestList] = useState([]);

  useEffect(() => {
    const handleGetInterestList = async () => {
      try {
        const res = await getInterestListAPI();
        setInterestList(res.data);
      } catch (error) {
        console.log("get interest list err", error);
      }
    };

    handleGetInterestList();
  }, []);

  const handleAddInterestList = (item) => {
    console.log("item", item);

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

  const handleStartJoinMatch = async () => {
    if (matchForm.interestIds.length < 3) {
      Toast.show({
        type: "error",
        text1: "Hãy chọn ít nhất 3 điều bạn thích",
        text2: "Thử lại nhé",
      });
      return;
    }
    if (matchForm.roomType === "") {
      Toast.show({
        type: "error",
        text1: "Hãy chọn loại kết nối bạn muốn",
        text2: "Thử lại nhé",
      });
      return;
    }

    router.replace({
      pathname: "/(stack)/match/matchLoading",
      params: {
        label: "Matching in processing...",
      },
    });
  };
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
      <ScrollView
        className="flex-1 px-6 gap-6 space-y-6"
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View className="gap-6">
          {/*Header */}
          <View className="bg-white h-16 flex-row justify-between items-center">
            {/*Logo */}
            <View>
              <Text>logo</Text>
            </View>
            <FontAwesome5 name="bell" size={24} color="#57298D" />
          </View>

          {/*Select type */}
          <View className="flex-row justify-between items-center w-full gap-3">
            <TouchableOpacity
              onPress={() =>
                setMatchForm((prev) => ({
                  ...prev,
                  roomType: "individual",
                }))
              }
              className={`${matchForm.roomType == "individual" ? "bg-purple-primary" : "bg-purple-primary/50"} h-28 flex-1 rounded-xl`}
            >
              <Text>individual</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setMatchJoinDataForm((prev) => ({
                  ...prev,
                  roomType: "group",
                }))
              }
              className={`${matchForm.roomType == "group" ? "bg-purple-primary" : "bg-purple-primary/50"} h-28 flex-1 rounded-xl`}
            >
              <Text>group</Text>
            </TouchableOpacity>
          </View>

          {/*Select options */}
          <View className="bg-blue-primary border border-purple-primary">
            <Text className="text-center py-4 text-purple-primary font-semibold">
              OPTIONS
            </Text>

            <View className="p-4 border-y border-purple-primary">
              <Text className="text-purple-primary mb-4">
                What is your interest?
              </Text>
              <View className="flex-row flex-wrap gap-4 my-auto">
                {interestList.map((item) => (
                  <TouchableOpacity
                    key={item.interestId}
                    activeOpacity={0.8}
                    onPress={() => handleAddInterestList(item.interestId)}
                    className={`rounded-2xl h-9 items-center justify-center ${matchForm.interestIds.includes(item.interestId) ? "bg-purple-third" : "bg-purple-third/50"}`}
                  >
                    <Text className="text-white px-5">{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="p-4">
              <TouchableOpacity
                onPress={handleStartJoinMatch}
                className="bg-purple-third py-3 px-6 rounded-full w-full"
              >
                <Text className="text-white text-xl font-medium text-center">
                  Connect
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*Special Offers */}
          <View className="">
            {/*Header */}
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-purple-primary text-2xl font-bold">
                Special Offers
              </Text>
              <View className="flex-row items-center">
                <Text className="text-purple-primary/50 text-lg">See more</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="rgba(87,41,141,0.5)"
                />
              </View>
            </View>

            {/*Content */}
            <View className="bg-black h-[166px] rounded-3xl mt-2 overflow-hidden">
              <View className="mt-6 ml-6 w-[70%] h-[128px]">
                <Text className="text-white font-semibold text-lg ">
                  Buddy Verse Premium
                </Text>
                <Text className="text-gray-500">
                  Unlock Budddy Verse premium to unlock all features.
                </Text>

                <Text className="bg-purple-third text-white self-start p-3 px-4 rounded-2xl mt-auto">
                  Upgrade
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
