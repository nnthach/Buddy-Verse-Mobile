import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { matchJoinAPI } from "@services/matchService";
import { MatchContext } from "../../../../context/MatchContext";
import { AuthContext } from "../../../../context/AuthContext";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default function MatchLoading() {
  const { label } = useLocalSearchParams();
  const { matchForm } = useContext(MatchContext);
  const { userId } = useContext(AuthContext);

  const connectionRef = useRef(null);

  const joinMatchQueue = async () => {
    try {
      // 1. Connect
      const conn = new HubConnectionBuilder()
        .withUrl("http://10.0.2.2:5116/matchHub")
        .configureLogging(LogLevel.Information)
        .build();

      // lắng nghe tin nhắn từ server
      conn.on("Matched", (roomId, members) => {
        console.log("matched roomid", roomId);
        console.log("matched members", members);
      });

      conn.on("JoinedQueue", () => {
        console.log("joined queue alo alo");
      });

      // start connect
      await conn.start();
      console.log("🔗 Connection started!");

      // join
      await conn.invoke(
        "JoinMatchQueue",
        userId,
        matchForm.roomType,
        matchForm.interestIds
      );
      console.log("📩 Đã gửi yêu cầu join match queue");

      connectionRef.current = conn;
    } catch (error) {
      console.log("match queue err", error);
    }
  };

  useEffect(() => {
    joinMatchQueue();

    return () => {
      if (connectionRef.current) connectionRef.current.stop();
    };
  }, [userId]);

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

        <TouchableOpacity onPress={() => router.replace("/(tabs)/buddy")}>
          <Text>Ngừng kết nối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
