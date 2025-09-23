import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useContext, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { matchJoinAPI } from "@services/matchService";
import { MatchContext } from "../../../../context/MatchContext";
import { AuthContext } from "../../../../context/AuthContext";
import { startSignalR, stopSignalR } from "../../../../config/signalr";

export default function MatchLoading() {
  const { label } = useLocalSearchParams();
  const { matchForm } = useContext(MatchContext);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const joinMatch = async () => {
      try {
        // Gọi API để đăng ký join match
        const res = await matchJoinAPI({
          accountId: userId,
          roomType: matchForm.roomType,
          interestIds: matchForm.interestIds,
        });

        console.log("match join res", res.data);

        // Kết nối SignalR để chờ kết quả
        await startSignalR(userId, (data) => {
          if (data?.roomId) {
            router.replace(`/chat/${data.roomId}`);
          }
        });
      } catch (error) {
        console.error("Join match error:", error);
      }
    };

    joinMatch();

    return () => {
      stopSignalR();
    };
  }, []);

  // const handleMatchJoinInProcess = async () => {
  //   const joinMatchForm = {
  //     accountId: userId,
  //     roomType: matchForm.roomType,
  //     interestIds: matchForm.interestIds,
  //   };

  //   console.log("join match form", joinMatchForm);
  //   try {
  //     const res = await matchJoinAPI(joinMatchForm);
  //     console.log("match join res", res);
  //     console.log("match join res data", res.data);
  //     if (res.data.isMatched) {
  //       router.replace(`/chat/${res.data.roomId}`);
  //     }
  //   } catch (error) {
  //     console.log("join match err", error);
  //   }
  // };

  // useEffect(() => {
  //   handleMatchJoinInProcess();
  // }, []);

  return (
    <View className="flex-1 justify-center items-center bg-beige-primary">
      <View className="justify-center items-center">
        <View className="w-36 h-36 rounded-full border-4 border-purple-primary mb-4 items-center justify-center">
          <ActivityIndicator
            size={"large"}
            color={"#57298D"}
            className="scale-150"
          />
        </View>
        <Text className="font-bold text-purple-primary text-2xl">
          {label || "Loading..."}
        </Text>
        <View className="flex-row items-center gap-2">
          <Image
            source={require("@assets/icons/light_bulb.png")}
            className="w-3 h-3 mt-1"
          />
          <Text className="text-purple-primary/50 text-sm mt-2">
            Pro tip: A clear profile photo gets 3x more connections!
          </Text>
        </View>
      </View>
    </View>
  );
}
