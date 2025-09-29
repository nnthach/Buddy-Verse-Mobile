import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
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
import { loginAPI } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function SignInScreen() {
  const screenWidth = Dimensions.get("window").width;
  const { setUserId, handleGetUserById } = useContext(AuthContext);

  const [focusedField, setFocusedField] = useState(null);

  const [signinForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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
      <SafeAreaView className="flex-1 bg-beige-primary">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/*Banner */}
            <View className="relative bg-gray-200 h-[300px] w-full overflow-hidden">
              <Image
                source={require("../../assets/images/signinbanner.jpg")}
                style={{
                  width: screenWidth,
                  height: 300,
                  position: "absolute",
                }}
                resizeMode="cover"
              />
              <Text className="absolute bottom-[12px] left-4 text-beige-primary font-bold text-4xl">
                Đăng nhập
              </Text>
            </View>

            {/*Form */}
            <View className="my-6 px-4 gap-4">
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
                error={errors.password}
                secureTextEntry={true}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSignIn}
                className="h-14 bg-purple-primary rounded-[50px] items-center justify-center mt-3"
              >
                <Text className="text-beige-primary text-xl font-medium">
                  Đăng nhập
                </Text>
              </TouchableOpacity>

              <View className=" gap-4 ">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log("fotget pw");
                    router.push("/forget-password");
                  }}
                >
                  <Text className="text-center text-purple-primary text-xl font-medium">
                    Quên mật khẩu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    router.push("/(getstart)");
                  }}
                >
                  <Text className="text-center text-purple-primary text-xl font-medium">
                    Bắt đầu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/*Other way to login */}
            <View className="items-center justify-center flex-row gap-3 mt-auto mb-10">
              <AntDesign name="twitter" size={32} color={"#361F5C"} />
              <AntDesign name="google" size={32} color={"#361F5C"} />
              <AntDesign name="facebook-square" size={32} color={"#361F5C"} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
