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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { AuthContext } from "@context/AuthContext";
import Toast from "react-native-toast-message";
import uploadImage from "utils/uploadImage";
import * as FileSystem from "expo-file-system";
import {
  updateUserAvatarAPI,
  updateUserCharacterAPI,
} from "@services/userService";
import LoadingCustom from "@components/LoadingCustom";

export default function GenerateCharacter() {
  const [prompt, setPrompt] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { userId, handleGetUserById } = useContext(AuthContext);

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

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
  const REMOVE_BG_API_KEY = process.env.EXPO_PUBLIC_REMOVEBG_KEY;

  const baseImage =
    "https://firebasestorage.googleapis.com/v0/b/buddyverse-b64d2.firebasestorage.app/o/8.png?alt=media&token=5ec3b1a6-4e4e-44a6-92ce-47e468622868";

  const handleSend = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUri(null);

    try {
      // image with gemini
      const imageRes = await fetch(baseImage);
      const blob = await imageRes.blob();

      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);

        const base64Image = reader.result.split(",")[1];

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        mimeType: "image/png",
                        data: base64Image,
                      },
                    },
                    {
                      text: `Giữ lại khuôn mặt và tỉ lệ người. Thay đổi tóc, mắt, mũi, miệng, quần áo theo mô tả: ${prompt} và chỉ lấy người, loại bỏ hoàn toàn nền, trả về ảnh PNG với nền trong suốt.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await res.json();
        console.log("Gemini response:", data);

        const imageBase64 =
          data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
          data?.candidates?.[0]?.content?.parts?.[1]?.inlineData?.data;

        console.log("image base 64", imageBase64);

        // Gửi blob thay vì base64 string
        const imageFile = await base64ToFile(imageBase64);

        const form = new FormData();
        form.append("image_file", {
          uri: imageFile.uri,
          name: imageFile.name,
          type: imageFile.type,
        });
        form.append("size", "auto");

        // image with remove background
        const removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": REMOVE_BG_API_KEY,
            "Content-Type": "multipart/form-data",
          },
          body: form,
        });
        console.log("removeBgRes", removeBgRes);

        // set image
        const blob2 = await removeBgRes.blob(); // <--- chạy được tới đây
        console.log("blob2", blob2);
        const base64AfterRemove = await blobToBase64(blob2);
        console.log("Image after remove.bg:", base64AfterRemove);

        // result img
        if (base64AfterRemove) {
          setImageUri(`data:image/png;base64,${base64AfterRemove}`);
        } else {
          Toast.show({
            type: "error",
            text1: "Chưa thể tạo ảnh ngay lúc này",
            text2: "Thử lại nhé",
          });
        }
      };

      reader.readAsDataURL(blob);
      setLoading(false);
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

  const handleSubmit = async () => {
    setLoadingEdit(true);

    const imageFile = await base64ToFile(imageUri);
    console.log("imageFile", imageFile);
    const uploadedUrl = await uploadImage(imageFile);

    try {
      const res = await updateUserCharacterAPI(userId, uploadedUrl);

      await handleGetUserById(userId);

      Toast.show({
        type: "success",
        text1: "Cập nhật hình ảnh thành công!",
        text2: "Thành công",
      });
      setImageUri(null);
      setPrompt("");
      router.replace("/(tabs)/home");
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
