import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextInputAuth from "../../components/TextInputAuth";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AuthContext } from "../../context/AuthContext";
import { registerAPI, loginGoogleAPI } from "services/authService";
import { pickImage, removeImage } from "../../utils/imagePickerUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import uploadImage from "../../utils/uploadImage";
import Toast from "react-native-toast-message";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GG_WEB_CLIENT_ID,
});

export default function SignUpScreen() {
  const {
    submitRegisterForm,
    setSubmitRegisterForm,
    initialRegisterForm,
    handleGetUserById,
    setUserId,
  } = useContext(AuthContext);

  const [signupStep, setSignupStep] = useState(1);

  const [errors, setErrors] = useState({});

  const [openSelect, setOpenSelect] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [imageUpload, setImageUpload] = useState([]);

  const [focusedField, setFocusedField] = useState(null);

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

  const handleChange = (name, value) => {
    setSubmitRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    if (signupStep === 1) {
      setSignupStep(2);
      return;
    }

    if (signupStep === 2) {
      setSignupStep(3);
      return;
    }

    try {
      const imageUrlList = [];

      for (const img of imageUpload) {
        const url = await uploadImage(img);
        imageUrlList.push(url);
      }

      console.log("register form", {
        ...submitRegisterForm,
        photoUrls: imageUrlList,
      });

      // call api
      const res = await registerAPI({
        ...submitRegisterForm,
        photoUrls: imageUrlList,
      });
      console.log("register res", res.data);

      setSubmitRegisterForm(initialRegisterForm);
      Toast.show({
        type: "success",
        text1: "Đăng ký thành công!",
        text2: "Chào mừng bạn",
      });
      router.replace("/sign-in");
    } catch (error) {
      console.log("register err", error);
      alert(error?.data?.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("start gg signin");
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log("gg sign in res", response);
      if (isSuccessResponse(response)) {
        console.log("is success");
        // CALL API LOGIN GG
        const loginGGRes = await loginGoogleAPI({
          idToken: response.data.idToken,
        });
        console.log("login gg api res", loginGGRes.data);
        const { accessToken, refreshToken, accountId } = loginGGRes.data;

        AsyncStorage.setItem("accessToken", accessToken);
        AsyncStorage.setItem("refreshToken", refreshToken);
        AsyncStorage.setItem("userId", accountId);

        setUserId(accountId);

        await handleGetUserById(accountId);

        Toast.show({
          type: "success",
          text1: "Đăng ký thành công!",
          text2: "Chào mừng bạn",
        });

        setTimeout(() => {
          router.replace("/(root)/(tabs)/home");
        }, 1500);
        // END CALL API LOGIN GG
      } else {
        console.log("ggsignin cancel res.data", response.data);
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("gg sign in err in process", error);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("gg sign in err PLAY_SERVICES_NOT_AVAILABLE", error);
            break;
          default:
            console.log("gg sign in err", error);
        }
      } else {
        console.log("gg sign in err", error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white-primary">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            className="px-6"
          >
            {/*Logo */}
            <Image
              source={require("@assets/images/applogo.png")}
              className="w-24 h-24 mx-auto rounded-xl"
            />

            {/*Title */}
            <View className="my-6">
              <Text className="text-3xl font-bold text-black text-center">
                Đăng ký vào buddyverse.
              </Text>
            </View>

            {/*Google Sign Up Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGoogleSignIn}
              className="h-14 bg-white-primary border border-gray-four rounded-xl items-center justify-center flex-row gap-3 mb-6"
            >
              <AntDesign name="google" size={20} color={"#4285F4"} />
              <Text className="text-black text-lg font-medium">
                Đăng ký với Google
              </Text>
            </TouchableOpacity>

            {/*Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-four" />
              <Text className="mx-4 text-gray-primary text-sm">
                hoặc tiếp tục với tài khoản
              </Text>
              <View className="flex-1 h-px bg-gray-four" />
            </View>

            {/*Form */}
            <View className="my-6 gap-4">
              {signupStep == 1 ? (
                <>
                  <TextInputAuth
                    name="firstname"
                    label={"Tên đầu"}
                    value={submitRegisterForm.firstname}
                    onChangeText={(text) => handleChange("firstname", text)}
                    error={errors?.firstname}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <TextInputAuth
                    name="lastname"
                    label={"Tên cuối"}
                    value={submitRegisterForm.lastname}
                    onChangeText={(text) => handleChange("lastname", text)}
                    error={errors?.lastname}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />

                  {/*Select gender */}
                  <View>
                    <TouchableOpacity
                      onPress={() => setOpenSelect(true)}
                      activeOpacity={0.5}
                      className="relative"
                    >
                      <View
                        className={`z-0 bg-white-primary h-14 px-4 rounded-xl border ${submitRegisterForm?.gender != "" ? "border-black" : "border-gray-400"} flex-row w-full justify-between items-center`}
                      >
                        <Text
                          className={` ${submitRegisterForm?.gender != "" ? "text-black" : "text-gray-400"}`}
                        >
                          {submitRegisterForm?.gender
                            ? submitRegisterForm?.gender
                                .charAt(0)
                                .toUpperCase() +
                              submitRegisterForm?.gender.slice(1)
                            : "Chọn giới tính"}
                        </Text>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={26}
                          color="#6C757D"
                        />
                      </View>
                    </TouchableOpacity>
                    {openSelect && (
                      <View className="bg-white-primary shadow-custom absolute top-16 z-10 w-full max-h-[250px] rounded-xl border border-gray-400 overflow-hidden">
                        <ScrollView
                          className="flex-1"
                          showsVerticalScrollIndicator={false}
                        >
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              setSubmitRegisterForm((prev) => ({
                                ...prev,
                                gender: "nam",
                              }));
                              setOpenSelect(false);
                            }}
                            className="bg-white p-4"
                          >
                            <Text>Nam</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              setSubmitRegisterForm((prev) => ({
                                ...prev,
                                gender: "nữ",
                              }));
                              setOpenSelect(false);
                            }}
                            className="bg-white p-4"
                          >
                            <Text>Nữ</Text>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/*Select DOB */}
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => setDatePickerVisibility(true)}
                    >
                      <View
                        className={`bg-white-primary h-14 px-4 rounded-xl border ${submitRegisterForm?.dob != "" ? "border-black" : "border-gray-400"} flex-row w-full justify-between items-center`}
                      >
                        <Text
                          className={` ${submitRegisterForm?.dob != "" ? "text-black" : "text-gray-400"}`}
                        >
                          {submitRegisterForm?.dob
                            ? submitRegisterForm?.dob
                            : "Chọn ngày sinh"}
                        </Text>
                        <MaterialIcons
                          name="calendar-today"
                          size={22}
                          color="#6C757D"
                        />
                      </View>
                    </TouchableOpacity>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={(date) => {
                        setDatePickerVisibility(false);
                        setSubmitRegisterForm((prev) => ({
                          ...prev,
                          dob: date.toISOString().split("T")[0], // yyyy-mm-dd
                        }));
                      }}
                      onCancel={() => setDatePickerVisibility(false)}
                    />
                  </View>
                </>
              ) : signupStep == 2 ? (
                <>
                  <TextInputAuth
                    name="username"
                    label={"Tên đăng nhập"}
                    value={submitRegisterForm.username}
                    onChangeText={(text) => handleChange("username", text)}
                    error={errors?.username}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />

                  <TextInputAuth
                    name="email"
                    label={"Email"}
                    value={submitRegisterForm.email}
                    onChangeText={(text) => handleChange("email", text)}
                    error={errors?.email}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <TextInputAuth
                    name="password"
                    label={"Mật khẩu"}
                    value={submitRegisterForm.password}
                    onChangeText={(text) => handleChange("password", text)}
                    error={errors?.password}
                    secureTextEntry={true}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <TextInputAuth
                    name="confirmPassword"
                    label={"Nhập lại mật khẩu"}
                    value={submitRegisterForm.confirmPassword}
                    onChangeText={(text) =>
                      handleChange("confirmPassword", text)
                    }
                    error={errors?.confirmPassword}
                    secureTextEntry={true}
                    customLeftCSSOnblur="left-6"
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                </>
              ) : (
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
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSignUp}
                className="h-14 bg-yellow-primary rounded-xl items-center justify-center mt-3"
              >
                <Text className="text-white-primary text-lg font-bold">
                  {signupStep == 1 || 2 ? "Tiếp tục" : "Tạo tài khoản"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace("/sign-in")}>
                <Text className="text-center text-gray-primary text-base">
                  Đã có tài khoản?{" "}
                  <Text className="text-black font-bold">Đăng nhập</Text>
                </Text>
              </TouchableOpacity>
            </View>
            {/*End form */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
