import { View, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

function FooterGetStart({ pageIndex, back = "", next, disabled = false }) {
  return (
    <View className="mt-auto mb-6 flex-row justify-between items-center">
      <View className=" flex-row gap-3">
        {[...Array(3)].map((_, index) => (
          <View
            key={index}
            className={`w-[16px] h-[16px] rounded-full border border-yellow-primary ${index == pageIndex && "bg-yellow-primary"}`}
          />
        ))}
      </View>

      {/*Arrow */}
      <View className="flex-row gap-3">
        {back && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back(back)}
            className="rounded-full w-14 h-14 bg-yellow-primary/50 items-center justify-center"
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={36}
              color="#F1F3E7"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.8}
          onPress={() => router.push(next)}
          className={`rounded-full w-14 h-14 items-center justify-center ${disabled ? "bg-gray-500" : "bg-yellow-primary"}`}
        >
          <MaterialIcons
            name="keyboard-arrow-right"
            size={36}
            color="#F1F3E7"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FooterGetStart;
