import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";

export default function CharacterCartoon() {
  const [selectType, setSelectType] = useState("tee");
  const selectTypeList = [
    {
      label: "tee",
      icon: require("@assets/icons/clothes_tee.png"),
    },
    {
      label: "pant",
      icon: require("@assets/icons/clothes_pant.png"),
    },
    {
      label: "suit",
      icon: require("@assets/icons/clothes_full.png"),
    },
    {
      label: "hat",
      icon: require("@assets/icons/clothes_hat.png"),
    },
  ];

  const productList = {
    tee: [
      {
        name: "sp1",
        image: require("@assets/images/character/pink_suit_female.png"),
      },
      {
        name: "sp2",
        image: require("@assets/images/character/purple_suit_female.png"),
      },
      {
        name: "sp3",
        image: require("@assets/images/character/brown_suit_male.png"),
      },
      {
        name: "sp4",
        image: require("@assets/images/character/redtee_brownpant_male.png"),
      },
      {
        name: "sp5",
        image: require("@assets/images/character/yellow_suit_male.png"),
      },
      {
        name: "sp5",
        image: require("@assets/images/character/yellow_suit_male.png"),
      },
      {
        name: "sp5",
        image: require("@assets/images/character/yellow_suit_male.png"),
      },
      {
        name: "sp5",
        image: require("@assets/images/character/yellow_suit_male.png"),
      },
      {
        name: "sp5",
        image: require("@assets/images/character/yellow_suit_male.png"),
      },
      {
        name: "sp5",
        image: require("@assets/images/character/yellow_suit_male.png"),
      },
      {
        name: "sp5",
        image: require("@assets/images/character/yellow_suit_male.png"),
      },
    ],
    pant: [
      {
        name: "sp1",
        image: require("@assets/images/character/pink_suit_female.png"),
      },
      {
        name: "sp2",
        image: require("@assets/images/character/purple_suit_female.png"),
      },
      {
        name: "sp3",
        image: require("@assets/images/character/brown_suit_male.png"),
      },
    ],
    suit: [],
    hat: [],
  };

  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="px-6">
        {/*Heading */}
        <View className="h-16 flex-row justify-between items-center ">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={34}
              color="#57298D"
            />
          </TouchableOpacity>

          <Text className="w-[34px]" />
        </View>

        {/*Name*/}
        <View className=" justify-center items-center">
          {/*Name */}
          <View className="border border-purple-primary p-3 px-5 rounded-2xl flex-row gap-3 items-center">
            <Text className="text-purple-primary text-2xl">Khoa</Text>
            <FontAwesome5 name="award" size={20} color="#57298D" />
          </View>
        </View>

        {/*Character */}
        <View className="bg-red-200 w-full h-[300px] mt-4">
          <Image
            source={require("@assets/images/character/white_body.png")}
            className="w-full h-full bg-blue-200"
          />
        </View>
      </View>

      {/*Choose clothes */}
      <View className="w-full h-[390px] mt-2">
        {/*Select type */}
        <View className="flex-row justify-between items-center border-b border-gray-300 px-6 py-3">
          {selectTypeList.map((item) => (
            <TouchableOpacity key={item.label}>
              <Image source={item.icon} className="w-9 h-9" />
            </TouchableOpacity>
          ))}
        </View>

        {/*Product list */}
        <ScrollView className="p-6">
          <View className="flex-row flex-wrap gap-2">
            {productList[selectType].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white w-32 h-32 rounded-xl p-2 border border-gray-300"
              >
                <Image source={item.image} className="w-full h-full" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
