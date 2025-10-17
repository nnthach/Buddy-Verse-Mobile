import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function PaymentQR() {
  const { url } = useLocalSearchParams();
  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      {/*Heading */}
      <View className="px-6 h-16 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        </TouchableOpacity>
        <Text className="text-black font-semibold text-2xl">Thanh toán</Text>
        <MaterialIcons name="keyboard-arrow-left" size={34} color="white" />
      </View>
      {/*Content */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {url ? (
          <WebView source={{ uri: url }} className="flex-1" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-base">
              Không có URL thanh toán hợp lệ
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
