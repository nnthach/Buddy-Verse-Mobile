import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { fakePageTwoGetStart } from "../../../data/fakeData";
import FooterGetStart from "../../../components/FooterGetStart";
import { AuthContext } from "../../../context/AuthContext";
import { getInterestListAPI } from "../../../services/interestService";

export default function GetStartTwoScreen() {
  const [interestList, setInterestList] = useState([]);
  const { submitRegisterForm, setSubmitRegisterForm } = useContext(AuthContext);

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
    setSubmitRegisterForm((prev) => {
      const isSelected = prev.interestIds.includes(item);

      return {
        ...prev,
        interestIds: isSelected
          ? prev.interestIds.filter((id) => id !== item)
          : [...prev.interestIds, item],
      };
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 bg-beige-primary px-8">
        {/*Heading */}
        <View className="mt-4">
          <Text className="text-[38px] text-purple-secondary font-bold">
            Select your interests
          </Text>
          <Text className="text-xl text-purple-secondary/70">
            for better matches
          </Text>
        </View>

        {/*Content */}
        <View className="flex-row flex-wrap gap-4 my-auto">
          {interestList.map((item) => (
            <TouchableOpacity
              key={item.interestId}
              activeOpacity={0.8}
              onPress={() => handleAddInterestList(item.interestId)}
              className={`rounded-2xl h-9 items-center justify-center ${submitRegisterForm.interestIds.includes(item.interestId) ? "bg-purple-third" : "bg-purple-third/50"}`}
            >
              <Text className="text-white px-5">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/*Footer */}
        <FooterGetStart
          pageIndex={1}
          back={"/page-one"}
          next={"/page-three"}
          disabled={submitRegisterForm.interestIds.length == 0}
        />
      </View>
    </SafeAreaView>
  );
}
