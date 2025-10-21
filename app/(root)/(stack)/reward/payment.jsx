import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { fakeDataTransaction } from "data/fakeData";
import { AuthContext } from "@context/AuthContext";

export default function Payment() {
  const [transactionList, setTransactionList] = useState(fakeDataTransaction);
  const { userInfo } = useContext(AuthContext);

  const transactionItem = ({ item }) => {
    return (
      <View className="flex-row items-center gap-4">
        {/*Icon payment */}
        <View className="bg-yellow-100 w-14 h-14 rounded-2xl justify-center items-center overflow-hidden">
          <Image
            source={require("@assets/icons/payment_card.png")}
            className="w-10 h-10"
            resizeMode="cover"
          />
        </View>
        {/*Name */}
        <View className="gap-1">
          <Text className="text-black font-semibold text-lg">{item.title}</Text>
          <Text className="text-gray-400 text-sm">{item.time}</Text>
        </View>
        {/*Money & status*/}
        <View className="flex-1 items-end gap-1">
          <Text className="text-black text-lg font-bold">
            {item.total.toLocaleString("vi-VN")}đ
          </Text>
          <Text
            className={`${item.status == "Success" ? "bg-green-success text-green-800" : "bg-red-500 text-red-200"} font-semibold px-2 py-1 text-xs rounded-full`}
          >
            {item.status}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white-primary">
      {/*Heading */}
      <View className="h-16 flex-row justify-between items-center px-6">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
        </TouchableOpacity>
        <Text className="text-black font-semibold text-2xl">Thành viên</Text>
        <AntDesign name="questioncircleo" size={24} color="black" />
      </View>
      {/*Content */}
      <ScrollView
        className="flex-1 px-6 gap-6 space-y-6"
        showsVerticalScrollIndicator={false}
      >
        {/*Info user */}
        <View className=" my-4">
          <View className="bg-gray-50 rounded-2xl overflow-hidden">
            {/*Top */}
            <View className=" flex-row items-center justify-between p-2">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("@assets/icons/point.png")}
                  className="w-5 h-5"
                />
                <Text className="font-semibold text-xl text-black">
                  6,868 điểm
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text className="text-black/50 text-md">Lịch sử</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="rgba(0,0,0,0.5)"
                />
              </View>
            </View>
            {/*Content */}
            <View className="bg-yellow-primary p-4">
              {/*Avatar */}
              <View className="mt-6 justify-center items-center">
                <Image
                  source={{
                    uri: userInfo?.avatarUrl,
                  }}
                  className="w-32 h-32 rounded-full bg-gray-100"
                  resizeMode="cover"
                />
                <Text className="text-xl text-white-primary font-semibold mt-3 mb-1">
                  {userInfo?.lastname} {userInfo?.firstname}
                </Text>
              </View>
              {/*Membership */}
              <View className="bg-white/70 flex-row items-center justify-between p-2 px-4 my-3 rounded-full">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require("@assets/icons/crown_membership.png")}
                    className="w-6 h-6"
                    resizeMode="cover"
                  />
                  <Text className="text-white-primary font-medium">
                    Thành viên cao cấp
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() =>
                      router.push(
                        "/(root)/(stack)/membershipPayment/membership"
                      )
                    }
                  >
                    <Text className="text-black/50 text-md">Lợi ích</Text>
                  </TouchableOpacity>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={20}
                    color="rgba(0,0,0,0.5)"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/*Recent transactions*/}
        <View className="bg-gray-50 rounded-2xl p-4 mb-10">
          <Text className="text-xl text-black font-semibold">
            Thanh toán gần đây
          </Text>
          <View className="mt-4">
            <FlatList
              data={transactionList.slice(0, 5)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={transactionItem}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className="h-4" />}
            />
          </View>
          <Text className="text-center border border-black self-center p-2 rounded-full text-black font-medium mt-4">
            Xem thêm
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
