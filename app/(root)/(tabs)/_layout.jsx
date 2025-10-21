import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  const TabIcon = ({ focused, iconName, size = 24 }) => {
    return (
      <View
        className={` ${focused && "bg-yellow-primary"} h-12 w-12 rounded-full justify-center items-center`}
      >
        <Ionicons
          name={iconName}
          size={size}
          color={focused ? "black" : "gray"}
        />
      </View>
    );
  };
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "white",
          overflow: "hidden",
          position: "absolute",
          borderTopWidth: 1,
          borderTopColor: "black",
          height: 76,
        },
        tabBarItemStyle: {
          height: 64,
          position: "relative",
        },
        tabBarIconStyle: {
          position: "absolute",
          top: "50%",
          transform: [{ translateY: -10 }],
        },
        tabBarShowLabel: false,
        gestureEnabled: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="search-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="buddy"
        options={{
          title: "Buddy",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="compass-outline" size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="chatbubble-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person-outline" />
          ),
        }}
      />
    </Tabs>
  );
}
