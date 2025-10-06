import { memo, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import useFetchList from "hooks/useFetchList";
import { MatchContext } from "../../context/MatchContext";
import { getInterestListAPI } from "@services/interestService";
import { router } from "expo-router";

function SelectInterestModal({ openModal, setOpenModal }) {
  const { data: interestList, loading } = useFetchList(getInterestListAPI);
  const { matchForm, setMatchForm } = useContext(MatchContext);

  const handleAddInterestList = (item) => {
    setMatchForm((prev) => {
      const isSelected = prev.interestIds.includes(item);

      return {
        ...prev,
        interestIds: isSelected
          ? prev.interestIds.filter((id) => id !== item)
          : [...prev.interestIds, item],
      };
    });
  };

  const handleStartJoinMatch = async () => {
    console.log("match form", matchForm);
    if (matchForm.interestIds.length < 3) {
      Toast.show({
        type: "error",
        text1: "Hãy chọn ít nhất 3 điều bạn thích",
        text2: "Thử lại nhé",
      });
      return;
    }
    if (matchForm.roomType === "") {
      Toast.show({
        type: "error",
        text1: "Hãy chọn loại kết nối bạn muốn",
        text2: "Thử lại nhé",
      });
      return;
    }

    router.replace({
      pathname: "/(root)/(stack)/match/matchLoading",
      params: {
        label: "Matching in processing...",
      },
    });
  };

  const visible = !!openModal;

  const handleClose = () => {
    setOpenModal(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Overlay */}
      <Pressable
        className="flex-1 bg-white-primary opacity-30"
        onPress={handleClose} // click ra ngoài để tắt
      />

      {/* Content */}
      <View className="absolute inset-0 items-center justify-center">
        <View className="bg-white-primary p-4 rounded-2xl w-[90%] border-[0.5px] border-black rounded-xl gap-3">
          <Text className="text-beige-primary font-medium text-lg">
            Chọn ít nhất 3 sở thích
          </Text>

          {/*Interest Grid */}
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#FBD157" />
            ) : (
              interestList.map((item) => (
                <TouchableOpacity
                  key={item.interestId}
                  activeOpacity={0.8}
                  onPress={() => handleAddInterestList(item.interestId)}
                  className={`w-[30%] aspect-square rounded-xl items-center justify-center p-3 ${
                    matchForm.interestIds.includes(item.interestId)
                      ? "bg-yellow-primary"
                      : "bg-gray-five"
                  }`}
                >
                  <View className="w-8 h-8 bg-gray-primary rounded-full mb-2" />
                  <Text className="text-lg text-black text-center font-medium">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={handleStartJoinMatch}
            className="bg-yellow-primary items-center justify-center rounded-xl"
          >
            <Text className="text-lg py-2 text-white-primary">
              Bắt đầu kết nối
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default memo(SelectInterestModal);
