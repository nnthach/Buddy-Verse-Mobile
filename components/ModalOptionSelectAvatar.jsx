import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function ModalOptionSelectAvatar({
  modalVisible,
  setModalVisible,
  handleImagePick,
}) {
  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-white-primary/50">
        <View className="bg-white-primary p-6 rounded-2xl w-80">
          <Text className="text-lg font-semibold mb-4 text-center">
            Chọn nguồn ảnh
          </Text>

          <View className="flex-row items-center gap-3">
            {/* Chọn từ thư viện */}
            <Pressable
              onPress={() => {
                handleImagePick();
                setModalVisible(false);
              }}
              className="py-3 bg-gray-200 rounded-xl mb-3"
            >
              <Text className="text-center text-black text-base">
                Từ thư viện
              </Text>
            </Pressable>

            {/* Chọn AI */}
            <Pressable
              onPress={() => {
                setModalVisible(false);
                router.push("/(root)/(stack)/gemini/generateImage"); // ← chuyển trang khác
              }}
              className="py-3 bg-blue-500 rounded-xl mb-3"
            >
              <Text className="text-center text-white text-base">
                Tạo bằng AI
              </Text>
            </Pressable>
          </View>
          {/* <Pressable onPress={() => setModalVisible(false)}>
            <Text className="text-center text-red-500 mt-2">Hủy</Text>
          </Pressable> */}
        </View>
      </View>
    </Modal>
  );
}
