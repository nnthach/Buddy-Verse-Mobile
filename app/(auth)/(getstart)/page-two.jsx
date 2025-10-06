import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getInterestListAPI } from "../../../services/interestService";
import useFetchList from "hooks/useFetchList";
import { router } from "expo-router";

export default function GetStartTwoScreen() {
  const { submitRegisterForm, setSubmitRegisterForm } = useContext(AuthContext);

  const { data: interestList, loading } = useFetchList(getInterestListAPI);

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
    <SafeAreaView className="flex-1 bg-white-primary">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/*Header */}
        <View className="mt-8 mb-8">
          <Text className="text-4xl font-bold text-black">buddy verse.</Text>
        </View>

        {/*Main Content */}
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-semibold text-black text-center mb-12">
            Pick 3 or more interests
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
                    submitRegisterForm.interestIds.includes(item.interestId)
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
            onPress={() => router.push("/page-three")}
            disabled={submitRegisterForm.interestIds.length < 3}
            className={`h-14 rounded-xl items-center justify-center ${
              submitRegisterForm.interestIds.length >= 3
                ? "bg-yellow-primary"
                : "bg-gray-five"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                submitRegisterForm.interestIds.length >= 3
                  ? "text-white-primary"
                  : "text-gray-primary"
              }`}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
