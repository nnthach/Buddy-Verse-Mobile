import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MatchContext } from "../../../../context/MatchContext";
import { AuthContext } from "../../../../context/AuthContext";

import { getMatchConnection } from "@services/signalRService";

export default function MatchLoading() {
  const { label } = useLocalSearchParams();
  const { matchForm, setMatchForm, initialMatchForm } =
    useContext(MatchContext);
  const { userId } = useContext(AuthContext);

  const connectionRef = useRef(null);

  const joinMatchQueue = async () => {
    try {
      const conn = await getMatchConnection();

      if (conn.state === "Disconnected") {
        await conn.start();
        console.log(
          "[MatchHub] Connection started matchloading:",
          conn.connectionId
        );
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

  const handleDisconnect = async () => {
    try {
      if (connectionRef.current) {
        await connectionRef.current.stop(); // Ngắt kết nối
        console.log("[MatchHub] Connection stopped manually");
        connectionRef.current = null;
      }

      setMatchForm(initialMatchForm);
      router.replace("/(tabs)/buddy"); // Điều hướng về màn hình Buddy
    } catch (error) {
      console.log("Error disconnecting MatchHub:", error);
    }
  };

  useEffect(() => {
    joinMatchQueue();

    return () => {
      // if (connectionRef.current) connectionRef.current.stop();

      if (connectionRef.current) {
        connectionRef.current.off("Matched");
        connectionRef.current.off("JoinedQueue");
      }

      setMatchForm(initialMatchForm);
    };
  }, [userId]);

  return (
    <View className="flex-1 justify-center items-center bg-white-primary">
      <View className="justify-center items-center">
        <View className="w-36 h-36 rounded-full border-4 border-yellow-primary mb-4 items-center justify-center">
          <ActivityIndicator
            size={"large"}
            color={"#FBD157"}
            className="scale-150"
          />
        </View>
        <Text className="font-bold text-yellow-primary text-2xl">
          {label || "Loading..."}
        </Text>
        <View className="flex-row items-center gap-2">
          <Image
            source={require("@assets/icons/light_bulb.png")}
            className="w-3 h-3 mt-1"
          />
          <Text className="text-yellow-primary/50 text-sm mt-2">
            Pro tip: A clear profile photo gets 3x more connections!
          </Text>
        </View>

        <TouchableOpacity onPress={handleDisconnect} className="mt-4">
          <Text>Ngừng kết nối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
