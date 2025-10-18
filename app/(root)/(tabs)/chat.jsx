import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AuthContext } from "../../../context/AuthContext";
import MainHeader from "@components/MainHeader";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PrivateChat from "@components/ChatComponents/PrivateChat";
import GroupChat from "@components/ChatComponents/GroupChat";

export default function ChatScreen() {
  const { userId } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Private");

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Heading */}
      <MainHeader />

      {/*type of chat */}
      <View className="flex-row items-center justify-between px-6 gap-3 my-3">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveTab("Private")}
          className={`px-4 py-2 rounded-lg border w-[50%] ${
            activeTab === "Private" ? "bg-black" : "bg-white-primary"
          }`}
        >
          <Text
            className={`font-semibold text-center ${
              activeTab === "Private" ? "text-white-primary" : "text-gray-700"
            }`}
          >
            Private
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveTab("Group")}
          className={`px-4 py-2 rounded-lg border  w-[50%] ${
            activeTab === "Group" ? "bg-black" : "bg-white-primary"
          }`}
        >
          <Text
            className={`font-semibold text-center ${
              activeTab === "Group" ? "text-white-primary" : "text-gray-700"
            }`}
          >
            Group
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Private" ? (
        <PrivateChat userId={userId} />
      ) : (
        <GroupChat userId={userId} />
      )}

      {/*floating button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/(root)/(stack)/chat/createGroup")}
        className="absolute right-4 bottom-24 bg-yellow-400 w-16 h-16 rounded-full items-center justify-center shadow-md"
      >
        <MaterialIcons name="group-add" size={20} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
