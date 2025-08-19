import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SignUpScreen() {
  const screenWidth = Dimensions.get("window").width;

  const [signupForm, setSignUpForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (name, value) => {
    setSignUpForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = () => {
    console.log("sign up form", signupForm);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-beige-primary">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-beige-primary">
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
                Sign Up
              </Text>
            </View>

            {/*Form */}
            <View className="my-6 px-4 gap-4">
              <TextInput
                placeholder="Username"
                className="border border-purple-primary pb-1 h-14 px-4 rounded-xl text-xl text-purple-primary"
                value={signupForm.username}
                onChangeText={(text) => handleChange("username", text)}
                textAlignVertical="center"
              />
              <TextInput
                placeholder="Password"
                className="border border-purple-primary pb-1 h-14 px-4 rounded-xl text-xl text-purple-primary"
                value={signupForm.password}
                onChangeText={(text) => handleChange("password", text)}
                textAlignVertical="center"
                secureTextEntry
              />
              <TextInput
                placeholder="Confirm Password"
                className="border border-purple-primary pb-1 h-14 px-4 rounded-xl text-xl text-purple-primary"
                value={signupForm.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                textAlignVertical="center"
                secureTextEntry
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSignUp}
                className="h-14 bg-purple-primary rounded-[50px] items-center justify-center mt-3"
              >
                <Text className="text-beige-primary text-xl font-medium">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/*Other way to login */}
            <View className="items-center justify-center flex-row gap-3 mt-auto mb-10">
              <AntDesign name="twitter" size={32} color={"#361F5C"} />
              <AntDesign name="google" size={32} color={"#361F5C"} />
              <AntDesign name="facebook-square" size={32} color={"#361F5C"} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
