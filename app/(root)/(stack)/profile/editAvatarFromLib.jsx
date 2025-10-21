import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { AuthContext } from "@context/AuthContext";
import Toast from "react-native-toast-message";
import uploadImage from "utils/uploadImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { updateUserAvatarAPI } from "@services/userService";
import LoadingCustom from "@components/LoadingCustom";
import { pickImage } from "utils/imagePickerUtils";

export default function GenerateImage() {
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { userId, handleGetUserById } = useContext(AuthContext);

  const [imageUpload, setImageUpload] = useState(null);

  const handleImagePick = async () => {
    const selectedAssets = await pickImage("image");
    if (selectedAssets.length > 0) {
      setImageUpload({ uri: selectedAssets[0].uri, type: "image" });
    }
  };

  const handleRemoveImage = () => {
    setImageUpload(null);
  };

  const handleSubmit = async () => {
    setLoadingEdit(true);

    try {
      const url = await uploadImage(imageUpload);

      const res = await updateUserAvatarAPI(userId, url);

      await handleGetUserById(userId);

      Toast.show({
        type: "success",
        text1: "Cập nhật hình ảnh thành công!",
        text2: "Thành công",
      });
      setImageUpload(null);
      router.replace("/(tabs)/profile");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Cập nhật hình ảnh thất bại!",
        text2: "Thử lại nhé",
      });
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-white-primary">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            {/* Header */}
            <View className="h-16 px-6 flex-row items-center justify-between border-b border-gray-200">
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={34}
                  color="black"
                />
              </TouchableOpacity>
              <Text className="font-semibold text-xl">Thêm ảnh đại diện</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Nội dung chính */}
            <View className="flex-1 items-center gap-4 mt-10">
              <Text className="text-black font-medium text-xl">
                Hãy chọn 1 tấm hình thật xinh
              </Text>
              {!imageUpload && (
                // add image
                <TouchableOpacity
                  className="bg-gray-200 p-2 items-center justify-center w-64 h-64"
                  onPress={() => handleImagePick()}
                >
                  <Text style={{ color: "black" }}>Thêm ảnh</Text>
                </TouchableOpacity>
              )}

              {imageUpload && (
                <View>
                  <View className="w-64 h-64 overflow-hidden">
                    <Image
                      source={{ uri: imageUpload?.uri }}
                      className="w-full h-full"
                    />

                    <Ionicons
                      name="close"
                      size={20}
                      color="black"
                      className="absolute right-0"
                      onPress={() => handleRemoveImage()}
                    />
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-yellow-primary w-64 rounded-full items-center"
              >
                <Text className="text-lg py-2 text-white-primary font-medium">
                  Dùng ảnh này
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
      {loadingEdit && <LoadingCustom label={"Đang cập nhật"} />}
    </>
  );
}
