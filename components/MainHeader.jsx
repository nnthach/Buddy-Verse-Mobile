import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { NotificationContext } from "@context/NotificationContext";
import Entypo from "@expo/vector-icons/Entypo";

export default function MainHeader() {
  const { isOpenNotification, setIsOpenNotification } =
    useContext(NotificationContext);
  return (
    <View className="px-6 h-16 flex-row justify-between items-center overflow-hidden">
      {/*Logo */}
      <View className="w-[150px] overflow-hidden">
        <Image
          source={require("@assets/images/logo_text_black.png")}
          style={{ width: "100%", height: 84, resizeMode: "contain" }}
        />
      </View>
      <TouchableOpacity onPress={() => setIsOpenNotification((prev) => !prev)}>
        <Entypo name="notification" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
}
