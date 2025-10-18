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
import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "@context/AuthContext";
import { pickImage, removeImage } from "utils/imagePickerUtils";
import uploadImage from "utils/uploadImage";
import Entypo from "@expo/vector-icons/Entypo";
import Toast from "react-native-toast-message";
import { createGroupAPI } from "@services/matchService";
import InputField from "@components/InputFieldCustom";
import useFetchList from "hooks/useFetchList";
import { getInterestListAPI } from "@services/interestService";

export default function CreateGroup() {
  const { userId } = useContext(AuthContext);
  const [createGroupForm, setCreateGroupForm] = useState({
    creatorId: userId,
    name: "",
    maxMembers: 3,
    interestIds: [],
  });

  const [imageUpload, setImageUpload] = useState([]);

  const { data: interestList, loading } = useFetchList(getInterestListAPI);

  const handleAddInterestList = (item) => {
    setCreateGroupForm((prev) => {
      const isSelected = prev.interestIds.includes(item);

      return {
        ...prev,
        interestIds: isSelected
          ? prev.interestIds.filter((id) => id !== item)
          : [...prev.interestIds, item],
      };
    });
  };

  const handleImagePick = async () => {
    const selectedAssets = await pickImage();
    if (selectedAssets.length > 0) {
      const formattedAssets = selectedAssets.map((asset) => ({
        uri: asset.uri,
        type: "image",
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

      const newCreateForm = {
        ...createGroupForm,
        maxMembers: Number(createGroupForm.maxMembers),
        attachmentUrls: imageUrlList,
      };
      const res = await createGroupAPI(newCreateForm);
      setCreateGroupForm({
        creatorId: userId,
        name: "",
        maxMembers: 0,
        interestIds: [],
      });
      Toast.show({
        type: "success",
        text1: "Tạo nhóm thành công",
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
            <Text className="font-semibold text-xl">Tạo nhóm</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              className={`rounded-xl items-center justify-center ${createGroupForm?.name && createGroupForm?.maxMembers ? "bg-yellow-primary" : "bg-gray-200"}`}
            >
              <Text className={` py-1 px-2 text-lg text-white-primary`}>
                Tạo
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{ paddingBottom: 100 }}
            nestedScrollEnabled
          >
            <View className="gap-6">
              <InputField
                label={"Tên nhóm"}
                placeholder={"Team trà sữa"}
                value={createGroupForm.name}
                name="name"
                setDataForm={setCreateGroupForm}
              />
              <InputField
                label={"Số lượng thành viên tối đa"}
                placeholder={"Tối thiểu 3"}
                value={createGroupForm.maxMembers}
                name="maxMembers"
                setDataForm={setCreateGroupForm}
              />

              {/*Interest */}
              <View className="gap-2">
                <Text className="text-xl">Chọn ít nhất 1 chủ đề sở thích</Text>
                <View className="flex-row flex-wrap gap-3 ">
                  {interestList?.map((item) => (
                    <TouchableOpacity
                      key={item.interestId}
                      activeOpacity={0.8}
                      onPress={() => handleAddInterestList(item.interestId)}
                      className={` rounded-full px-4 py-2  ${
                        createGroupForm.interestIds.includes(item.interestId)
                          ? "bg-yellow-primary"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Avatar
            <View className="items-center gap-4">
              <Text className="text-gray-primary font-medium text-2xl">
                Upload your avatar
              </Text>
              {imageUpload.length < 1 && (
                // add image
                <TouchableOpacity
                  className="bg-gray-200 p-2 items-center justify-center w-26 h-26"
                  onPress={handleImagePick}
                >
                  <Text style={{ color: "black" }}>Add Images</Text>
                </TouchableOpacity>
              )}

              {imageUpload.length > 0 && (
                <View>
                  <View className="w-24 h-24 overflow-hidden">
                    <Image
                      source={{ uri: imageUpload[0].uri }}
                      className="w-full h-full"
                    />

                    <Ionicons
                      name="close"
                      size={20}
                      color="black"
                      className="absolute right-0"
                      onPress={() => handleRemoveImage(0)}
                    />
                  </View>
                </View>
              )}
            </View> */}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* {createGroupForm.attachmentUrls < 10 && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleImagePick}
          className="absolute right-4 bottom-14 bg-yellow-400 w-14 h-14 rounded-full items-center justify-center shadow-md"
        >
          <Entypo name="image-inverted" size={30} color="white" />
        </TouchableOpacity>
      )} */}
    </SafeAreaView>
  );
}
