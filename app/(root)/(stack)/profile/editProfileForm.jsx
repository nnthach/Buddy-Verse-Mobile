import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import axios from "axios";
import InputField from "@components/InputFieldCustom";
import LoadingCustom from "@components/LoadingCustom";
import { AuthContext } from "../../../../context/AuthContext";
import { updateUserProfileAPI } from "@services/userService";
import Toast from "react-native-toast-message";
import { pickImage } from "utils/imagePickerUtils";
import uploadImage from "utils/uploadImage";
import ModalOptionSelectAvatar from "@components/ModalOptionSelectAvatar";

export default function EditProfileForm() {
  const [modalVisible, setModalVisible] = useState(false);

  const { userId, userInfo, handleGetUserById } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState({
    firstname: userInfo?.firstname,
    lastname: userInfo?.lastname,
    username: userInfo?.username,
    bio: userInfo?.bio,
    gender: userInfo?.gender,
    dob: userInfo?.dob,
    photoUrls: userInfo?.photos || [],
  });

  const genderData = [
    {
      label: "Nam",
    },
    {
      label: "Nữ",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [openSelect, setOpenSelect] = useState({
    dob: false,
    city: false,
    country: false,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await updateUserProfileAPI(userId, userProfile);

      await handleGetUserById(userId);

      Toast.show({
        type: "success",
        text1: "Cập nhật thông tin thành công!",
        text2: "Thành công",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Cập nhật thông tin thất bại!",
        text2: "Thử lại nhé",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView className="flex-1 bg-white-primary">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
            className="flex-1"
          >
            <ScrollView className="flex-1 px-6">
              {/*Heading */}
              <View className="h-16 flex-row justify-between items-center ">
                <TouchableOpacity onPress={() => router.back()}>
                  <MaterialIcons
                    name="keyboard-arrow-left"
                    size={34}
                    color="black"
                  />
                </TouchableOpacity>
                <Text className="text-black font-semibold text-2xl">
                  Thông tin cá nhân
                </Text>
                <Text className="w-[34px]" />
              </View>

              {/*Avatar */}
              <View className="mt-6 justify-center items-center">
                <Image
                  source={
                    userInfo?.avatarUrl
                      ? { uri: userInfo?.avatarUrl }
                      : require("@assets/images/avatar.png")
                  }
                  className="w-32 h-32 rounded-full"
                  resizeMode="cover"
                />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text className="text-lg text-black mt-1 mb-1">
                    Thay đổi hình ảnh
                  </Text>
                </TouchableOpacity>

                {/*Modal */}
                <ModalOptionSelectAvatar
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                />
              </View>

              {/*Form */}
              <View className="mt-8 gap-6">
                <InputField
                  label={"Tên đầu"}
                  placeholder={"Johnny"}
                  value={userProfile.firstname}
                  name="firstname"
                  setDataForm={setUserProfile}
                />
                <InputField
                  label={"Tên cuối"}
                  placeholder={"Johnny"}
                  value={userProfile.lastname}
                  name="lastname"
                  setDataForm={setUserProfile}
                />
                <InputField
                  label={"Tên đăng nhập"}
                  placeholder={"johnny_fhf"}
                  value={userProfile.username}
                  name="username"
                  setDataForm={setUserProfile}
                />
                <InputField
                  label={"Tiểu sử"}
                  value={userProfile.bio}
                  name="bio"
                  setDataForm={setUserProfile}
                  multiline
                />
                <InputField
                  label={"Giới tính"}
                  placeholder={userProfile?.gender || "Chọn giới tính"}
                  type="select"
                  openSelect={openSelect === "gender"}
                  setOpenSelect={() =>
                    setOpenSelect(openSelect === "gender" ? null : "gender")
                  }
                  data={genderData}
                  setDataForm={setUserProfile}
                  name="gender"
                  value={userProfile.gender}
                />
                <InputField
                  label={"Ngày sinh"}
                  placeholder={"Date/Month/Year"}
                  type="date"
                  openSelect={openSelect === "dob"}
                  name="dob"
                  setDataForm={setUserProfile}
                  setOpenSelect={() =>
                    setOpenSelect(openSelect === "dob" ? null : "dob")
                  }
                  value={userProfile.dob}
                />
              </View>

              <View className="mt-6">
                <TouchableOpacity
                  onPress={handleSubmit}
                  className="bg-yellow-primary py-3 px-6 rounded-full w-full"
                >
                  <Text className="text-white-primary text-lg font-medium text-center">
                    Cập nhật thông tin
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      {isLoading && <LoadingCustom label={"Đang cập nhật"} />}
    </>
  );
}
