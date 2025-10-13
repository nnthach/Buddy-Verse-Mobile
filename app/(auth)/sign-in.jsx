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
import { loginAPI } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import TextInputAuth from "@components/TextInputAuth";

export default function SignInScreen() {
  const { setUserId, handleGetUserById } = useContext(AuthContext);

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
      console.log("login err", error);
      Toast.show({
        type: "error",
        text1: error?.data?.message,
        text2: "Thử lại nhé",
      });
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
                secureTextEntry={true}
              />
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password}
                </Text>
              )}
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
