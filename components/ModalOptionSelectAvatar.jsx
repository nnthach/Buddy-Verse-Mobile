import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { router } from "expo-router";

export default function ModalOptionSelectAvatar({
  modalVisible,
  setModalVisible,
}) {
  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-white-primary/50">
          <View className="bg-white-primary border-[1px] border-gray-400 p-6 rounded-2xl w-80">
            <Text className="text-lg font-semibold mb-4 text-center">
              Chọn nguồn ảnh
            </Text>

            <View className="flex-row items-center gap-3">
              {/* Chọn từ thư viện */}
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  router.push("/(root)/(stack)/profile/editAvatarFromLib");
                }}
                className="py-3 bg-gray-200 rounded-xl mb-3 w-[50%]"
              >
                <Text className="text-center text-black text-base">
                  Từ thư viện
                </Text>
              </Pressable>

              {/* Chọn AI */}
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  router.push("/(root)/(stack)/gemini/generateImage");
                }}
                className="py-3 bg-yellow-primary rounded-xl mb-3 w-[50%]"
              >
                <Text className="text-center text-white text-base">
                  Tạo bằng AI
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
