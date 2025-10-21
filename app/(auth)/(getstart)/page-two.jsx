import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getInterestListAPI } from "../../../services/interestService";
import useFetchList from "hooks/useFetchList";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <View className="flex-1 px-6">
        {/*Header */}
        <View className="h-16 justify-center items-start">
          <View className="w-[150px] overflow-hidden">
            <Image
              source={require("@assets/images/logo_text_black.png")}
              style={{ width: "100%", height: 84, resizeMode: "contain" }}
            />
          </View>
        </View>

        {/*Main Content */}
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-semibold text-black text-center mb-12">
            Hãy chọn 3 sở thích của bạn
          </Text>

          {/*Interest Grid */}
          <ScrollView
            className="max-h-[70%] overflow-auto"
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#FBD157" />
            ) : (
              interestList.map((item) => (
                <TouchableOpacity
                  key={item.interestId}
                  activeOpacity={0.8}
                  onPress={() => handleAddInterestList(item.interestId)}
                  className={`w-[30%] aspect-square rounded-xl items-center justify-center p-3 mb-4 ${
                    submitRegisterForm.interestIds.includes(item.interestId)
                      ? "bg-yellow-primary"
                      : "bg-gray-five"
                  }`}
                >
                  <View className="w-16 h-16 bg-white-primary rounded-full mb-2">
                    <Image
                      source={{
                        uri: item.image,
                      }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <Text className="text-lg text-black text-center font-medium">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

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
    </SafeAreaView>
  );
}
