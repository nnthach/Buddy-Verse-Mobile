import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../../../context/AuthContext";
import { ChatGroupContext } from "@context/ChatGroupContext";
import { getMatchConnection } from "@services/signalRService";
import { matchGroupByInterestAPI } from "@services/matchService";

export default function MatchGroupLoading() {
  const { label } = useLocalSearchParams();
  const { setMatchGroupForm, matchGroupForm, initialMatchGroupForm } =
    useContext(ChatGroupContext);
  const { userId } = useContext(AuthContext);

  const handleMatchGroup = async () => {
    try {
      const newMatchGroupData = {
        ...matchGroupForm,
        accountId: userId,
      };
      console.log("match group form in loading", newMatchGroupData);
      const res = await matchGroupByInterestAPI(newMatchGroupData);
      console.log("match gr res", res.data);
      router.replace("/(tabs)/chat");
    } catch (error) {
      console.log("match group err", error);
    }
  };
  useEffect(() => {
    handleMatchGroup();

    return () => {
      setMatchGroupForm(initialMatchGroupForm);
    };
  }, [userId]);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <View className="justify-center items-center">
        <View className="w-36 h-36 rounded-full border-4 border-white-primary mb-4 items-center justify-center">
          <ActivityIndicator
            size={"large"}
            color={"white"}
            className="scale-150"
          />
        </View>
        <Text className="font-bold text-white-primary text-2xl">
          {label || "Loading..."}
        </Text>
        <View className="flex-row items-center gap-2">
          <Image
            source={require("@assets/icons/light_bulb.png")}
            className="w-3 h-3 mt-1"
          />
          <Text className="text-white-primary/50 text-sm mt-2">
            Pro tip: A clear profile photo gets 3x more connections!
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-white-primary">Ngừng kết nối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
