import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { fakePageThreeGetStart } from "../../../data/fakeData";
import FooterGetStart from "../../../components/FooterGetStart";

export default function GetStartThreeScreen() {
  const screenWidth = Dimensions.get("window").width;
  const scrollX = useSharedValue(0);

  const SliderItem = ({ index, title, scrollX }) => {
    // animation
    const cardAnimation = useAnimatedStyle(() => {
      const translateX = interpolate(
        scrollX.value,
        [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ],
        [-screenWidth * 0.25, 0, screenWidth * 0.25],
        Extrapolation.CLAMP
      );

      const scale = interpolate(
        scrollX.value,
        [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ],
        [0.9, 1, 0.9],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateX }, { scale }],
      };
    });

    // bgcolor
    const cardColor = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        scrollX.value,
        [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ],
        ["#361F5C", "rgba(87, 41, 141, 0.5)", "#361F5C"]
      );

      return { backgroundColor };
    });
    return (
      <Animated.View
        className="items-center justify-center"
        style={[{ width: screenWidth, height: 380 }, cardAnimation]}
      >
        <Animated.View
          className="bg-purple-primary/40 w-[75%] h-full rounded-3xl items-center justify-center"
          style={cardColor}
        >
          <Text className="text-2xl text-beige-primary font-bold">{title}</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-beige-primary">
      <View className="flex-1 bg-beige-primary ">
        {/*Heading */}
        <View className="mt-4 px-8">
          <Text className="text-[38px] text-purple-secondary font-bold">
            How would you like to use Buddy Verse?
          </Text>
          <Text className="text-xl text-purple-secondary/70">healthy</Text>
        </View>

        {/*Content */}
        <View className="my-auto pb-8">
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScrollHandler}
          >
            {fakePageThreeGetStart.map((item, index) => (
              <SliderItem
                key={item.id}
                title={item.title}
                scrollX={scrollX}
                index={index}
              />
            ))}
          </Animated.ScrollView>
        </View>

        {/*Footer */}
        <View className="px-8">
          <FooterGetStart
            pageIndex={2}
            back={"/page-two"}
            next={"/page-four"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

{
  /* <View className="mt-auto mb-6 px-8 flex-row justify-between items-center">
  <View className=" flex-row gap-3">
    {[...Array(3)].map((_, index) => (
      <View
        key={index}
        className={`w-[16px] h-[16px] rounded-full border border-purple-primary ${index == 2 && "bg-purple-primary"}`}
      />
    ))}
  </View>

  <View className="flex-row gap-3">
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.back("/page-two")}
      className="rounded-full w-14 h-14 bg-purple-primary/50 items-center justify-center"
    >
      <MaterialIcons name="keyboard-arrow-left" size={36} color="#F1F3E7" />
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push("/page-four")}
      className="rounded-full w-14 h-14 bg-purple-primary items-center justify-center"
    >
      <MaterialIcons name="keyboard-arrow-right" size={36} color="#F1F3E7" />
    </TouchableOpacity>
  </View>
</View>; */
}
