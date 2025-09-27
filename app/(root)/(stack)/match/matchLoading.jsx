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

import { getMatchConnection } from "@services/signalRService";

export default function MatchLoading() {
  const { label } = useLocalSearchParams();
  const { matchForm } = useContext(MatchContext);
  const { userId } = useContext(AuthContext);

  const connectionRef = useRef(null);

  const joinMatchQueue = async () => {
    try {
      const conn = await getMatchConnection();

      if (conn.state === "Disconnected") {
        await conn.start();
      }

      conn.on("Matched", (roomId, members) => {
        if (roomId && members) {
          router.replace({
            pathname: `/(stack)/chatTemp/${roomId}`,
            params: {
              accountId1: members[0],
              accountId2: members[1],
            },
          });
        }
      });

      conn.on("JoinedQueue", () => {
        console.log("joined queue alo alo");
      });

      await conn.invoke(
        "JoinMatchQueue",
        userId,
        matchForm.roomType,
        matchForm.interestIds
      );

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

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/buddy")}
          className="mt-4"
        >
          <Text>Ngừng kết nối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
