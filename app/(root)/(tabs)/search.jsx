import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");

  const filterTags = [
    "friendly",
    "exploring",
    "eating",
    "napping",
    "fetch",
    "shopping",
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Header search */}
      <View className="px-6 mt-4">
        {/* Search Input Field */}
        <View className="flex-row items-center justify-center mb-4">
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-1 flex-1 border border-gray-200">
            <Ionicons name="search" size={22} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="Search for tags and users"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              className="ml-3"
            >
              <Text className="text-gray-600 font-medium text-base">
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {filterTags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              className="bg-gray-100 rounded-full px-4 py-2 mr-3 border border-gray-200"
            >
              <Text className="text-gray-700 font-medium text-sm">{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={true}
      >
        {/* Pets you follow */}
        <View className="px-6 mb-6 mt-4">
          <Text className="text-lg font-bold text-black mb-3">
            Pets you follow
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-yellow-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={require("@assets/images/searchListImage.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Trending */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">Trending</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-yellow-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={require("@assets/images/searchListImage.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* New */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">New</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-yellow-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={require("@assets/images/searchListImage.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Suggested for you */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-black mb-3">
            Suggested for you
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className="w-44 h-32 bg-yellow-100 rounded-lg mr-3 overflow-hidden"
              >
                <Image
                  source={require("@assets/images/searchListImage.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
