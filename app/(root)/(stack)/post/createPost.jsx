import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useEvent } from "expo"; // hook theo dõi event của player
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "@context/AuthContext";
import { pickImage, removeImage } from "utils/imagePickerUtils";
import uploadImage from "utils/uploadImage";
import Entypo from "@expo/vector-icons/Entypo";
import { createPostAPI } from "@services/postService";
import Toast from "react-native-toast-message";

function PostMediaItem({ item, index, onRemove, screenWidth }) {
  const mediaWidth = screenWidth - 42;
  const [aspectRatio, setAspectRatio] = useState(1); // mặc định vuông

  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;
    player.play();
  });

  // Lấy tỉ lệ ảnh (width/height)
  useEffect(() => {
    if (item.type === "image") {
      Image.getSize(item.uri, (width, height) => {
        setAspectRatio(width / height);
      });
    }
  }, [item.uri]);

  return (
    <View
      style={{
        width: mediaWidth,
        height: mediaWidth,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
      }}
    >
      {item.type === "video" ? (
        <VideoView
          player={player}
          style={{
            width: "100%",
            backgroundColor: "black",
            aspectRatio,
            borderRadius: 12,
          }}
          allowsFullscreen
          allowsPictureInPicture
          resizeMode="cover"
        />
      ) : (
        <Image
          source={{ uri: item.uri }}
          style={{
            width: "100%",
            resizeMode: "cover",
            aspectRatio,
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => onRemove(index)}
        className="absolute top-3 right-4 bg-black/40 p-2 rounded-full"
      >
        <MaterialIcons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default function CreatePost() {
  const screenWidth = Dimensions.get("window").width;
  const { userInfo, userId } = useContext(AuthContext);
  const [createPostForm, setCreatePostForm] = useState({
    authorId: userId,
    content: "",
    attachmentUrls: [],
  });

  const [imageUpload, setImageUpload] = useState([]);

  const handleImagePick = async () => {
    const selectedAssets = await pickImage();
    if (selectedAssets.length > 0) {
      const formattedAssets = selectedAssets.map((asset) => ({
        uri: asset.uri,
        type: asset.type,
      }));
      setImageUpload((prev) => [...prev, ...formattedAssets]);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUpload((prev) => removeImage(prev, index));
  };

  const handleSubmit = async () => {
    try {
      const imageUrlList = [];

      for (const img of imageUpload) {
        const url = await uploadImage(img);
        imageUrlList.push(url);
      }

      const res = await createPostAPI({
        ...createPostForm,
        attachmentUrls: imageUrlList,
      });
      setCreatePostForm({
        authorId: userId,
        content: "",
        attachmentUrls: [],
      });
      Toast.show({
        type: "success",
        text1: "Tạo bài thành công",
        text2: "Cám ơn ban",
      });
      router.back();
    } catch (error) {
      console.log("create post error", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white-primary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          {/*Header */}
          <View className="h-16 px-6 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={34}
                color="black"
              />
            </TouchableOpacity>
            <Text className="font-semibold text-xl">Tạo bài viết</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              className={`rounded-xl items-center justify-center ${createPostForm.content ? "bg-yellow-primary" : "bg-gray-200"}`}
            >
              <Text className={` py-1 px-2 text-lg text-white-primary`}>
                Đăng
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{ paddingBottom: 100 }}
            nestedScrollEnabled
          >
            {/*User */}
            <View className="flex-row items-center gap-3">
              <Image
                source={
                  userInfo?.photos[0]
                    ? { uri: userInfo.photos[0] }
                    : require("@assets/images/applogo.png")
                }
                className="w-12 h-12 rounded-full bg-gray-200"
              />
              <Text className="text-base font-semibold mr-1">
                {userInfo?.lastname} {userInfo?.firstname}
              </Text>
            </View>

            <TextInput
              name="content"
              className="text-lg"
              placeholderTextColor="gray"
              placeholder="Nhập tại đây"
              value={createPostForm.content}
              onChangeText={(text) =>
                setCreatePostForm((prev) => ({
                  ...prev,
                  content: text,
                }))
              }
              multiline
            />
            {/*Image/Video list */}
            <View className="rounded-2xl overflow-hidden">
              <FlatList
                data={imageUpload}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={screenWidth - 48}
                snapToAlignment="center"
                renderItem={({ item, index }) => {
                  return (
                    <PostMediaItem
                      item={item}
                      index={index}
                      onRemove={handleRemoveImage}
                      screenWidth={screenWidth}
                    />
                  );
                }}
                decelerationRate="fast"
              />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {createPostForm.attachmentUrls < 10 && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleImagePick}
          className="absolute right-4 bottom-14 bg-yellow-400 w-14 h-14 rounded-full items-center justify-center shadow-md"
        >
          <Entypo name="image-inverted" size={30} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
