import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportCustomModal({ setIsOpenReport }) {
  return (
    <SafeAreaView className="absolute top-0 left-0 right-0 bottom-0 flex-1 bg-beige-primary z-10">
      <View className="flex-1 bg-beige-primary">
        {/*Heading */}
        <View className="w-full h-[50px] bg-red-400 flex-row items-center justify-center">
          <Text className="text-purple-primary text-2xl font-semibold">
            Tố cáo
          </Text>
          <TouchableOpacity
            onPress={() => setIsOpenReport(false)}
            className="absolute right-3"
          >
            <AntDesign name="close" size={20} color="purple" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
