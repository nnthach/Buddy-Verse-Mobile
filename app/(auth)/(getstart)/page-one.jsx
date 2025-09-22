import {
  View,
  Text,
  SafeAreaView,
  Image,
} from "react-native";
import React from "react";
import FooterGetStart from "../../../components/FooterGetStart";

export default function GetStartOneScreen() {
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 bg-beige-primary px-8">
        {/*Heading */}
        <View className="mt-4">
          <Text className="text-[38px] text-purple-secondary font-bold">
            Where did you find us?
          </Text>
          <Text className="text-xl text-purple-secondary/70">
            feel free to let we know
          </Text>
        </View>

        {/*Content */}
        <View>
          <Image
            source={require("../../../assets/images/facebook_getstart_banner.png")}
            className="w-full h-[300px]"
            resizeMode="cover"
          />
        </View>

        {/*Footer */}
        <FooterGetStart pageIndex={0} next={"/page-two"} />
      </View>
    </SafeAreaView>
  );
}
