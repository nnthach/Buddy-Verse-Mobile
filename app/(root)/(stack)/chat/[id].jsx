import { View, Text, Image, ScrollView, TextInput } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fakeDataChatting } from "data/fakeData";

export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      {/*Heading */}
      <View className="h-16 flex-row justify-between items-center px-4 border-b border-yellow-50">
        {/*Left */}
        <View className="flex-row items-center gap-4 w-[80%]">
          <MaterialIcons name="keyboard-arrow-left" size={34} color="#57298D" />
          <View className="flex-row gap-2 items-center">
            <Image
              source={{
                uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
              }}
              className="w-12 h-12 rounded-full"
              resizeMode="cover"
            />
            {/*Name & active */}
            <View className="flex-1">
              <Text className="font-semibold text-xl">Hai Anh</Text>
              <Text className="text-gray-500">Online</Text>
            </View>
          </View>
        </View>
        {/*Right */}
        <FontAwesome5 name="bell" size={24} color="#57298D" />
      </View>

      <ScrollView className="pt-4 px-4">
        {fakeDataChatting.map((item) => (
          <View key={item.id} className={`flex-row gap-2 items-start mb-3`}>
            {item.senderId == "fen" && (
              <Image
                source={{
                  uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
                }}
                className="w-11 h-11 rounded-full"
                resizeMode="cover"
              />
            )}

            <View
              className={`${item.senderId === "me" ? "items-end" : "items-start"} gap-1 w-full`}
            >
              <View
                className={`${item.senderId === "me" ? "bg-purple-500" : "bg-gray-300"} rounded-full p-3 px-4 max-w-[70%]`}
              >
                <Text
                  className={`${item.senderId === "me" ? "text-white" : "text-black"}`}
                >
                  {item.content}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs">
                {new Date(item.timestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/*Input */}
      <View className="flex-row px-4 items-center gap-4 ">
        <View className="rounded-full h-14 flex-1 items-center flex-row px-3 bg-black/5">
          <View className="w-11 h-11 bg-purple-primary rounded-full overflow-hidden items-center justify-center">
            <Ionicons name="image" size={24} color="white" />
          </View>
          <TextInput
            className="flex-1 h-full px-3 pb-1 text-xl text-purple-primary"
            onChangeText={(text) => setMessage(text)}
            textAlignVertical="center"
            placeholder="Message..."
            placeholderTextColor="#00000050"
          />
        </View>

        <Ionicons name="send" size={24} color="#57298D" />
      </View>
    </SafeAreaView>
  );
}
