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
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AuthContext } from "../../context/AuthContext";
import { registerAPI } from "services/authService";

export default function SignUpScreen() {
  const screenWidth = Dimensions.get("window").width;
  const { submitRegisterForm, setSubmitRegisterForm, initialRegisterForm } =
    useContext(AuthContext);

  const [signupStep, setSignupStep] = useState(1);

  const [errors, setErrors] = useState({});

  const [openSelect, setOpenSelect] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleChange = (name, value) => {
    setSubmitRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    console.log("sign up form", submitRegisterForm);

    if (signupStep === 1) {
      setSignupStep(2);
      return;
    }

    try {
      const res = await registerAPI(submitRegisterForm);
      console.log("register res", res);
      setSubmitRegisterForm(initialRegisterForm);
      router.replace("/sign-in");
    } catch (error) {
      console.log("register err", error);
      alert(error?.data?.message);
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
                Sign Up
              </Text>
            </View>

            {/*Form */}
            <View className="my-6 px-4 gap-4">
              {signupStep == 1 ? (
                <>
                  <TextInputAuth
                    label={"First Name"}
                    value={submitRegisterForm.firstname}
                    onChangeText={(text) => handleChange("firstname", text)}
                    error={errors?.firstname}
                  />
                  <TextInputAuth
                    label={"Last Name"}
                    value={submitRegisterForm.lastname}
                    onChangeText={(text) => handleChange("lastname", text)}
                    error={errors?.lastname}
                  />

                  {/*Select gender */}
                  <View>
                    <TouchableOpacity
                      onPress={() => setOpenSelect(true)}
                      activeOpacity={0.5}
                      className="relative border-purple-primary"
                    >
                      <View className="z-0 bg-beige-primary h-14 px-2 rounded-xl border border-purple-primary flex-row w-full justify-between items-center">
                        <Text>
                          {submitRegisterForm?.gender
                            ? submitRegisterForm?.gender
                                .charAt(0)
                                .toUpperCase() +
                              submitRegisterForm?.gender.slice(1)
                            : "Select Gender"}
                        </Text>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={26}
                          color="#57298D"
                        />
                      </View>
                    </TouchableOpacity>
                    {openSelect && (
                      <View className="shadow-custom absolute top-16 z-10 w-full max-h-[250px] rounded-xl border border-gray-400 overflow-hidden">
                        <ScrollView
                          className="flex-1"
                          showsVerticalScrollIndicator={false}
                        >
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              setSubmitRegisterForm((prev) => ({
                                ...prev,
                                gender: "male",
                              }));
                              setOpenSelect(false);
                            }}
                            className="bg-white p-4"
                          >
                            <Text>Male</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              setSubmitRegisterForm((prev) => ({
                                ...prev,
                                gender: "female",
                              }));
                              setOpenSelect(false);
                            }}
                            className="bg-white p-4"
                          >
                            <Text>Female</Text>
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
                      <View className="bg-beige-primary h-14 px-4 rounded-xl border border-purple-primary flex-row w-full justify-between items-center">
                        <Text>
                          {submitRegisterForm?.dob
                            ? submitRegisterForm?.dob
                            : "Select DOB"}
                        </Text>
                        <MaterialIcons
                          name="calendar-today"
                          size={22}
                          color="#57298D"
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
              ) : (
                <>
                  <TextInputAuth
                    label={"Username"}
                    value={submitRegisterForm.username}
                    onChangeText={(text) => handleChange("username", text)}
                    error={errors?.username}
                  />

                  <TextInputAuth
                    label={"Email"}
                    value={submitRegisterForm.email}
                    onChangeText={(text) => handleChange("email", text)}
                    error={errors?.email}
                  />
                  <TextInputAuth
                    label={"Password"}
                    value={submitRegisterForm.password}
                    onChangeText={(text) => handleChange("password", text)}
                    error={errors?.password}
                    secureTextEntry={true}
                  />
                  <TextInputAuth
                    label={"Confirm Password"}
                    value={submitRegisterForm.confirmPassword}
                    onChangeText={(text) =>
                      handleChange("confirmPassword", text)
                    }
                    error={errors?.confirmPassword}
                    secureTextEntry={true}
                    customLeftCSSOnblur="left-6"
                  />
                </>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSignUp}
                className="h-14 bg-purple-primary rounded-[50px] items-center justify-center mt-3"
              >
                <Text className="text-beige-primary text-xl font-medium">
                  {signupStep == 1 ? "Continue" : "Create Account"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace("/sign-in")}>
                <Text className="text-center text-purple-primary text-xl font-medium">
                  Already have an account?
                </Text>
              </TouchableOpacity>
            </View>
            {/*End form */}

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
