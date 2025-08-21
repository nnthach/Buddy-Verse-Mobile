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
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextInputAuth from "../../components/TextInputAuth";

export default function SignInScreen() {
  const screenWidth = Dimensions.get("window").width;

  const [signinForm, setSignInForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setSignInForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidation = () => {
    let errors = {};

    // Validate username
    if (!signinForm.username) {
      errors.username = "Username is required!";
    } else if (
      signinForm.username.length < 6 ||
      signinForm.username.length > 15
    ) {
      errors.username = "Username is require in range 6-15 characters.";
    }

    // Validate password
    if (!signinForm.password) {
      errors.password = "Password is required!";
    } else if (signinForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSignIn = () => {
    if (!handleValidation()) return;

    console.log("sign in form", signinForm);
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
                Sign In
              </Text>
            </View>

            {/*Form */}
            <View className="my-6 px-4 gap-4">
              <TextInputAuth
                label={"Username"}
                value={signinForm.username}
                onChangeText={(text) => handleChange("username", text)}
                error={errors.username}
              />
              <TextInputAuth
                label={"Password"}
                value={signinForm.password}
                onChangeText={(text) => handleChange("password", text)}
                error={errors.password}
                secureTextEntry={true}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSignIn}
                className="h-14 bg-purple-primary rounded-[50px] items-center justify-center mt-3"
              >
                <Text className="text-beige-primary text-xl font-medium">
                  Sign In
                </Text>
              </TouchableOpacity>

              <Text className="text-center text-purple-primary text-xl font-medium">
                Forgot Password
              </Text>
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
