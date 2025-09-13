import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  const TabIcon = ({ focused, iconName }) => {
    return (
      <View
        className={` ${focused && "bg-beige-primary"} h-12 w-12 rounded-full justify-center items-center`}
      >
        <Ionicons
          name={iconName}
          size={24}
          color={focused ? "#57298D" : "gray"}
        />
      </View>
    );
  };
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#CCB3F2",
          borderRadius: 50,
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 20,
          height: 64,
          position: "absolute",
          borderTopWidth: 0,
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
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "User",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="people-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transaction",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="chatbubble-outline" />
          ),
        }}
      />
    </Tabs>
  );
}
