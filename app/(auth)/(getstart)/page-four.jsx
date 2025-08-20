import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";

export default function GetStartFourScreen() {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 bg-beige-primary px-8">
        {/*Heading */}
        <View className="mt-8">
          <Text className="text-[38px] text-purple-secondary font-bold text-center">
            Terms &{"\n"}Conditions
          </Text>
        </View>

        {/*Content */}
        <View className="bg-white rounded-2xl p-6 border border-black mt-6">
          <Text className="font-bold text-[16px]">
            Est fugiat assumenda aut reprehenderit{"\n"}
          </Text>
          <Text className="">
            Lorem ipsum dolor sit amet. Et odio officia aut voluptate internos
            est omnis vitae ut architecto sunt non tenetur fuga ut provident
            vero. Quo aspernatur facere et consectetur ipsum et facere corrupti
            est asperiores facere. Est fugiat assumenda aut reprehenderit
            voluptatem sed.{"\n"}
            {"\n"}
            1. Ea voluptates omnis aut sequi sequi. {"\n"}2. Est dolore quae in
            aliquid ducimus et autem repellendus. {"\n"}3. Aut ipsum Quis qui
            porro quasi aut minus placeat! {"\n"}4. Sit consequatur neque ab
            vitae facere.
            {"\n"}
            {"\n"}
            Aut quidem accusantium nam alias autem eum officiis placeat et omnis
            autem id officiis perspiciatis qui corrupti officia eum aliquam
            provident. Eum voluptas error et optio dolorum cum molestiae nobis
            et odit molestiae quo magnam impedit sed fugiat nihil non nihil
            vitae.
          </Text>

          {/*Company */}
          <View className="mt-4 flex-row items-start">
            <Image
              source={require("../../../assets/images/robotmascot.png")}
              className="w-16 h-16"
              resizeMode="cover"
            />
            <View className="gap-1">
              <Text className="text-purple-primary font-bold">
                Buddy Verse Policy
              </Text>
              <Text className="text-purple-primary ">20/10/2025</Text>
            </View>
          </View>
        </View>

        {/*Accept checkbox */}
        <View className="flex-row items-center mt-4">
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            color={"#57298D"}
          />
          <Text className="text-purple-primary ml-2">
            I accept all the terms and conditions
          </Text>
        </View>

        {/*Accept BTN */}
        <TouchableOpacity
          disabled={!isChecked}
          onPress={() => router.replace("/sign-up")}
          className={`bg-purple-primary py-3 rounded-xl items-center mt-8 ${
            isChecked ? "" : "opacity-50"
          }`}
        >
          <Text className="text-white text-lg">Accept</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
