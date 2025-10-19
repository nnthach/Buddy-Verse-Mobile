import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { AuthContext } from "@context/AuthContext";
import Toast from "react-native-toast-message";
import uploadImage from "utils/uploadImage";
import * as FileSystem from "expo-file-system";
import { updateUserProfileAPI } from "@services/userService";
import LoadingCustom from "@components/LoadingCustom";

export default function GenerateImage() {
  const [prompt, setPrompt] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { userId, userInfo, handleGetUserById } = useContext(AuthContext);
  const userProfile = {
    // firstname: userInfo?.firstname,
    // lastname: userInfo?.lastname,
    // username: userInfo?.username,
    // bio: userInfo?.bio,
    // gender: userInfo?.gender,
    // dob: userInfo?.dob,
    // interestIds: userInfo?.interests || [],
    photoUrls: userInfo?.photos || [],
  };

  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

  const baseCharacter = require("@assets/images/character/white_body.png");
  const baseImage =
    "https://firebasestorage.googleapis.com/v0/b/buddyverse-b64d2.firebasestorage.app/o/8.png?alt=media&token=5ec3b1a6-4e4e-44a6-92ce-47e468622868";

  const handleSend = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUri(null);

    try {
      const systemPrompt = `
      Bạn là một mô hình tạo hình ảnh.
      Nhiệm vụ của bạn: tạo ra 1 hình ảnh nhân vật dựa trên hình gốc được cung cấp.
      Hãy giữ lại khuôn người, khuôn mặt và tỉ lệ nhân vật trong ảnh gốc chỉ thêm tóc mắt mũi miệng,
      và thay đổi quần áo, màu sắc, và phông nền dựa trên mô tả người dùng.

      Hình gốc: ${baseImage}

      Mô tả người dùng: ${prompt}
    `;

      console.log("system prompt", systemPrompt);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const imageBase64 =
        data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
        data?.candidates?.[0]?.content?.parts?.[1]?.inlineData?.data;

      if (imageBase64) {
        setImageUri(`data:image/png;base64,${imageBase64}`);
      } else {
        Toast.show({
          type: "error",
          text1: "Chưa thể tạo ảnh ngay lúc này",
          text2: "Thử lại nhé",
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Chưa thể tạo ảnh ngay lúc này",
        text2: "Thử lại nhé",
      });
    } finally {
      setLoading(false);
    }
  };

  const base64ToFile = async (base64String) => {
    // Bỏ phần đầu "data:image/png;base64," nếu có
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    const fileUri = `${FileSystem.cacheDirectory}ai_image.png`;

    // Ghi file tạm từ base64
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return {
      uri: fileUri,
      type: "image/png",
      name: "ai_image.png",
    };
  };

  const handleSubmit = async () => {
    setLoadingEdit(true);
    const imageFile = await base64ToFile(imageUri);
    const uploadedUrl = await uploadImage(imageFile);

    try {
      const updatedData = {
        ...userProfile,
        photoUrls: [uploadedUrl, ...(userProfile?.photoUrls?.slice(1) || [])],
      };

      const res = await updateUserProfileAPI(userId, updatedData);

      await handleGetUserById(userId);

      Toast.show({
        type: "success",
        text1: "Cập nhật hình ảnh thành công!",
        text2: "Thành công",
      });
      setImageUri(null);
      setPrompt("");
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.log("update profile err", error);

      Toast.show({
        type: "error",
        text1: "Cập nhật thông tin thất bại!",
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
              <Text className="font-semibold text-xl">Tạo ảnh bằng AI</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Nội dung chính */}
            <ScrollView
              className="flex-1 px-6"
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {/* Input mô tả */}
              <View className="mt-6">
                <Text className="text-lg font-semibold mb-2">
                  Nhập mô tả ảnh bạn muốn tạo 🎨
                </Text>
                <Text className="text-sm text-gray-400 mb-2">
                  Ví dụ: Giới tính nam, mặc áo CR7, nền sân bóng đá, tóc nâu
                </Text>
                <TextInput
                  placeholder="Nhập ở đây"
                  placeholderTextColor="#999"
                  multiline
                  className="border border-gray-300 rounded-2xl p-4 text-base text-black"
                  value={prompt}
                  onChangeText={setPrompt}
                />
              </View>

              {/* Nút tạo ảnh */}
              <TouchableOpacity
                onPress={handleSend}
                disabled={loading || !prompt.trim()}
                activeOpacity={0.8}
                className={`mt-6 rounded-2xl py-4 ${
                  prompt.trim() ? "bg-yellow-primary" : "bg-gray-300"
                }`}
              >
                <Text className="text-white-primary text-center text-lg font-semibold">
                  {loading ? "Đang tạo ảnh..." : "Tạo ảnh"}
                </Text>
              </TouchableOpacity>

              {/* Ảnh hiển thị */}
              {imageUri && (
                <View className="mt-8 items-center">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-[350px] h-[350px] rounded-2xl bg-gray-200"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="mt-4 bg-yellow-primary px-6 py-3 rounded-2xl w-full"
                  >
                    <Text className="text-white-primary text-center text-lg font-semibold">
                      Dùng ảnh này
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
      {loading && <LoadingCustom label={"Đang tạo ảnh"} />}
      {loadingEdit && <LoadingCustom label={"Đang cập nhật"} />}
    </>
  );
}
