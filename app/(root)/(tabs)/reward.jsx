import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import ModalRewardHistory from "@components/ModalRewardHistory";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAccountQuestListAPI,
  getQuestListAPI,
  startQuestAPI,
} from "@services/questService";
import { AuthContext } from "../../../context/AuthContext";
import YourTask from "@components/RewardScreenComponents/YourTask";
import ActiveTask from "@components/RewardScreenComponents/ActiveTask";

export default function RewardScreen() {
  const [questList, setQuestList] = useState([]);
  const [yourTaskList, setYourTaskList] = useState([]);
  const [points, setPoints] = useState(8868);
  const [openModalRewardHistory, setOpenModalRewardHistory] = useState(false);
  const { userId } = useContext(AuthContext);

  const handleGetQuestList = async () => {
    try {
      const res = await getQuestListAPI();
      console.log("Get quest list res: ", res.data);
      setQuestList(res.data);
    } catch (error) {
      console.log("Get quest list error: ", error);
    }
  };

  const handleGetAccountQuestList = async () => {
    try {
      const res = await getAccountQuestListAPI(userId);
      console.log("Get account task list res: ", res.data);
      setYourTaskList(res.data);
    } catch (error) {
      console.log("Get account task list error: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetAccountQuestList();
      handleGetQuestList();
    }, [])
  );

  const handleStartQuest = async (questId) => {
    try {
      const startQuestData = {
        accountId: userId,
        questId,
      };
      const res = await startQuestAPI(startQuestData);
    } catch (error) {
      console.log("Start quest error: ", error);
    }
  };

  return (
    <>
      <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 90 }}
        >
          {/*Heading */}
          <View className=" h-16 flex-row justify-between items-center px-6">
            {/*Left */}
            <View className="flex-row items-center gap-3">
              <Image
                source={{
                  uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
                }}
                className="w-11 h-11 rounded-full"
                resizeMode="cover"
              />
              {/*Points */}
              <View className="flex-row rounded-full overflow-hidden border border-purple-third">
                <LinearGradient
                  colors={["#4B164C10", "#4B164C80"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View className="flex-row items-center gap-6 p-2">
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={require("@assets/icons/point.png")}
                        className="w-4 h-4"
                      />
                      <Text className="text-purple-primary font-bold">
                        8,868
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Add points");
                        router.push("/(root)/(stack)/reward/payment");
                      }}
                    >
                      <AntDesign name="pluscircleo" size={18} color="#F1F3E7" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>
            {/*Right */}
            <FontAwesome5 name="bell" size={24} color="#57298D" />
          </View>

          {/*Reward Progress & Leader board */}
          <TouchableOpacity
            onPress={() => setOpenModalRewardHistory(true)}
            className="flex-row justify-between items-center gap-4 px-6 py-6 border-y border-purple-primary"
          >
            {/*Reward Progress */}
            <View
              className="h-24 rounded-2xl flex-1 p-2"
              style={{ backgroundColor: "#EDF0F7" }}
            >
              {/*Top */}
              <View className="flex-row justify-between items-center">
                <Image
                  source={require("@assets/icons/reward.png")}
                  className="w-6 h-6"
                  resizeMode="cover"
                />
                <Text className="text-purple-secondary/70 text-sm">
                  {points}/10000
                </Text>
              </View>
              {/*Bottom */}

              <View className="bg-purple-primary/30 w-full h-6 my-auto rounded-full overflow-hidden">
                <View className="h-full bg-purple-four w-[calc(8686/10000*100%)] rounded-full" />
              </View>
            </View>
            {/*Leader board */}
            <TouchableOpacity
              onPress={() => router.push(`/(root)/(stack)/reward/leaderBoard`)}
              className="h-24 w-24 overflow-hidden rounded-2xl"
            >
              <Image
                source={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzz7di0LYIulQDtDANj-jYuZhNS8btD9KEOg&s.png",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {/*Daily check in */}
          <View className="px-6 py-6 border-b border-purple-primary">
            {/*Heading */}
            <View className="items-center justify-between flex-row">
              <Feather name="grid" size={24} color="#57298D" />
              <View className="items-center">
                <Text className="text-center text-purple-primary font-semibold">
                  29
                </Text>
                <View className="flex-row items-center gap-1">
                  <Image
                    source={require("@assets/icons/fire.png")}
                    className="w-5 h-5"
                    resizeMode="cover"
                  />
                  <Text className="text-md text-purple-primary">Streaks</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setOpenModalRewardHistory(true)}>
                <Feather name="clock" size={24} color="#57298D" />
              </TouchableOpacity>
            </View>

            {/*Daily */}
            <View className="flex-row flex-wrap mt-6 gap-4 justify-between">
              {[...Array(35)].map((_, index) => (
                <View
                  key={index}
                  className="w-10 h-10 bg-purple-primary/50 border border-purple-primary rounded-lg"
                ></View>
              ))}
            </View>
          </View>

          {/*Your task */}
          <YourTask yourTaskList={yourTaskList} />

          {/*Active tasks */}
          <ActiveTask questList={questList} />
        </ScrollView>
      </SafeAreaView>

      <ModalRewardHistory
        openModalRewardHistory={openModalRewardHistory}
        setOpenModalRewardHistory={setOpenModalRewardHistory}
      />
    </>
  );
}
