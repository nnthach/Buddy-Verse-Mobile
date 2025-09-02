import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function ProfileScreen() {
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          onPress={() => router.push("/(root)/(stack)/profile/settingProfile")}
        >
          <Text>ProfileScreen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
