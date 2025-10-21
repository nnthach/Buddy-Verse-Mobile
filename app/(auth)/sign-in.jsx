import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import React, { useContext, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { loginAPI, loginGoogleAPI } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import TextInputAuth from "@components/TextInputAuth";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GG_WEB_CLIENT_ID,
});

export default function SignInScreen() {
  const { setUserId, handleGetUserById, handleGetUserSubscriptionById } =
    useContext(AuthContext);

  const [signinForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (name, value) => {
    setSignInForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleValidation = () => {
    let errors = {};
    let isError = false;

    // Validate email
    if (!signinForm.email) {
      errors.email = "Email is required!";
      isError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signinForm.email)) {
        errors.email = "Invalid email format";
        isError = true;
      }
    }

    // Validate password
    if (!signinForm.password) {
      errors.password = "Password is required!";
      isError = true;
    } else if (signinForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      isError = true;
    }

    setErrors(errors);

    return isError;
  };

  const handleSignIn = async () => {
    if (handleValidation()) return;

    try {
      const res = await loginAPI(signinForm);
      const { accessToken, refreshToken, accountId } = res.data;

      AsyncStorage.setItem("accessToken", accessToken);
      AsyncStorage.setItem("refreshToken", refreshToken);
      AsyncStorage.setItem("userId", accountId);

      setUserId(accountId);

      await handleGetUserById(accountId);
      await handleGetUserSubscriptionById(accountId);

      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công!",
        text2: "Chào mừng bạn",
      });

      setSignInForm({ email: "", password: "" });
      setFocusedField(null);

      setTimeout(() => {
        router.replace("/(root)/(tabs)/home");
      }, 1500);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.data?.message,
        text2: "Thử lại nhé",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        // CALL API LOGIN GG
        const loginGGRes = await loginGoogleAPI({
          idToken: response.data.idToken,
        });
        const { accessToken, refreshToken, accountId } = loginGGRes.data;

        AsyncStorage.setItem("accessToken", accessToken);
        AsyncStorage.setItem("refreshToken", refreshToken);
        AsyncStorage.setItem("userId", accountId);

        setUserId(accountId);

        await handleGetUserById(accountId);

        Toast.show({
          type: "success",
          text1: "Đăng nhập thành công!",
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
                Đăng nhập vào buddyverse.
              </Text>
            </View>

            {/*Google Sign In Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGoogleSignIn}
              className="h-14 bg-white-primary border border-gray-four rounded-xl items-center justify-center flex-row gap-3 mb-6"
            >
              <AntDesign name="google" size={20} color={"#4285F4"} />
              <Text className="text-black text-lg font-medium">
                Đăng nhập với Google
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
              <TextInputAuth
                name="email"
                label={"Email"}
                value={signinForm.email}
                onChangeText={(text) => handleChange("email", text)}
                error={errors.email}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />
              <TextInputAuth
                name="password"
                label={"Mật khẩu"}
                value={signinForm.password}
                onChangeText={(text) => handleChange("password", text)}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                error={errors.password}
                secureTextEntry={true}
              />
              <TouchableOpacity onPress={() => router.push("/forget-password")}>
                <Text>Quên mật khẩu</Text>
              </TouchableOpacity>
            </View>

            {/*Sign In Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSignIn}
              className="h-14 bg-yellow-primary rounded-xl items-center justify-center mb-8"
            >
              <Text className="text-white-primary text-lg font-bold">
                Đăng nhập
              </Text>
            </TouchableOpacity>

            {/*Sign Up Link */}
            <View className="items-center">
              <Text className="text-gray-primary text-base">
                Chưa có tài khoản?{" "}
                <Text
                  className="text-black font-bold"
                  onPress={() => router.push("/sign-up")}
                >
                  Đăng ký
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
