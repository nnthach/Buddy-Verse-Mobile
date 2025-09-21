import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


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
