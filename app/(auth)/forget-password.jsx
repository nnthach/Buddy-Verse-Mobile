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
import {
  forgotPasswordAPI,
  loginAPI,
  resetPasswordAPI,
  verifyOTPAPI,
} from "../../services/authService";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export default function ForgetPasswordScreen() {
  const screenWidth = Dimensions.get("window").width;

  const [forgetPasswordForm, setForgetPasswordForm] = useState({
    email: "",
    newPassword: "",
    otpCode: "",
    accountId: "",
  });

  const [focusedField, setFocusedField] = useState(null);

  const [stepForgetPassword, setStepForgetPassword] = useState(1);

  const handleChange = (name, value) => {
    setForgetPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // forgot step 1
    if (stepForgetPassword == 1) {
      if (!forgetPasswordForm.email) return;

      const formData = {
        email: forgetPasswordForm.email,
      };

      try {
        console.log("form data email 1", formData);
        const res = await forgotPasswordAPI(formData);

        console.log("fgpw email 1 res", res);
        setForgetPasswordForm((prev) => ({
          ...prev,
          accountId: res.data.accountId,
        }));

        setStepForgetPassword(2);
      } catch (error) {
        console.log("email fgpw 1 err", error);
      }

      // forgot step 2
    } else if (stepForgetPassword == 2) {
      if (!forgetPasswordForm.otpCode) return;

      const formData = {
        accountId: forgetPasswordForm?.accountId,
        otpCode: forgetPasswordForm?.otpCode,
      };
      try {
        console.log("form data otp 2", formData);
        const res = await verifyOTPAPI(formData);

        console.log("fgpw otp 2 res", res);

        setStepForgetPassword(3);
      } catch (error) {
        console.log("otp fgpw 2 err", error);
      }
    } else {
      const formData = {
        accountId: forgetPasswordForm?.accountId,
        newPassword: forgetPasswordForm?.newPassword,
      };

      try {
        console.log("form data pw 3", formData);
        const res = await resetPasswordAPI(formData);

        Toast.show({
          type: "success",
          text1: "Đổi mật khẩu thành công!",
          text2: "Chào mừng bạn",
        });
        router.replace("/sign-in");
      } catch (error) {
        console.log("pw fgpw 3 err", error);
      }
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
            <View className="relative bg-red-200 h-[300px] w-full overflow-hidden">
              <Image
                source={require("../../assets/images/signinbanner.jpg")}
                style={{
                  width: screenWidth,
                  height: 300,
                  position: "absolute",
                }}
                resizeMode="cover"
              />
              <Text className="absolute bottom-1 left-4 text-beige-primary font-bold text-5xl">
                Forget Password
              </Text>
            </View>

            {/*Form */}
            <View className="my-6 px-4 gap-4">
              {stepForgetPassword == 1 ? (
                <TextInputAuth
                  name="email"
                  label={"Email"}
                  value={forgetPasswordForm.email}
                  onChangeText={(text) => handleChange("email", text)}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              ) : stepForgetPassword == 2 ? (
                <TextInputAuth
                  name="otpCode"
                  label={"OTP Code"}
                  value={forgetPasswordForm.otpCode}
                  onChangeText={(text) => handleChange("otpCode", text)}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              ) : (
                <TextInputAuth
                  name="newPassword"
                  label={"New Password"}
                  value={forgetPasswordForm.newPassword}
                  onChangeText={(text) => handleChange("newPassword", text)}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit}
                className="h-14 bg-yellow-primary rounded-[50px] items-center justify-center mt-3"
              >
                <Text className="text-beige-primary text-xl font-medium">
                  {stepForgetPassword == 1
                    ? "Receive OTP"
                    : stepForgetPassword == 2
                      ? "Verify OTP"
                      : "Submit"}
                </Text>
              </TouchableOpacity>
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
