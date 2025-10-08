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

export default function EditProfileForm() {
  const ADDRESS_BASE_URL = "https://countriesnow.space/api/v0.1";
  const [countryData, setCountryData] = useState({
    country: "",
    state: "",
    city: "",
  });

  const { userId, userInfo, handleGetUserById } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState({
    firstname: userInfo?.firstname,
    lastname: userInfo?.lastname,
    username: userInfo?.username,
    gender: userInfo?.gender,
    dob: userInfo?.dob,
    interestIds: userInfo?.interests || [],
    photoUrls: userInfo?.photos || [],
    // phone: userInfo?.phone,
    // country: "",
    // state: "",
    // city: "",
    // permanentAddress: "",
    // presentAddress: "",
    // postalCode: "",
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [isLoadingFetchCountry, setIsLoadingFetchCountry] = useState(false);
  const genderData = [
    {
      label: "nam",
    },
    {
      label: "nữ",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [imageUpload, setImageUpload] = useState([]);

  const handleImagePick = async () => {
    const selectedAssets = await pickImage();
    if (selectedAssets.length > 0) {
      const formattedAssets = selectedAssets.map((asset) => ({
        uri: asset.uri,
        type: "image",
      }));
      console.log("format assets", formattedAssets);
      setImageUpload((prev) => [...prev, ...formattedAssets]);
      const newFormatToRender = selectedAssets.map((asset) => asset.uri);
      setUserProfile((prev) => ({
        ...prev,
        photoUrls: [newFormatToRender[0], ...(prev.photoUrls.slice(1) || [])],
      }));
    }
  };

  const [openSelect, setOpenSelect] = useState({
    dob: false,
    city: false,
    country: false,
  });

  // fetch country
  useEffect(() => {
    const handleGetAllCountry = async () => {
      setIsLoadingFetchCountry(true);
      try {
        const res = await axios.get(`${ADDRESS_BASE_URL}/countries/iso`);
        setCountries(
          res.data.data.map((c) => ({
            value: c.name,
            label: c.name,
          }))
        );
        setIsLoadingFetchCountry(false);
        console.log("countries after fetch", countries);
      } catch (error) {
        console.log("get country err", error);
        setIsLoadingFetchCountry(false);
      }
    };
    handleGetAllCountry();
  }, []);

  // fetch state
  useEffect(() => {
    console.log("start fetch sate");

    if (!userProfile.country) return;

    const handleGetAllState = async () => {
      try {
        const res = await axios.post(`${ADDRESS_BASE_URL}/countries/states`, {
          country: userProfile.country,
        });
        console.log("res state list", res);
        setStates(
          res.data.data.states.map((s) => ({
            value: s.name,
            label: s.name,
          }))
        );
      } catch (error) {
        console.log("get states err", error);
      }
    };
    handleGetAllState();
  }, [userProfile.country]);

  // fetch city
  useEffect(() => {
    if (!userProfile.state) return;

    console.log("start fetch city");
    const handleGetAllCity = async () => {
      try {
        const res = await axios.post(
          `${ADDRESS_BASE_URL}/countries/state/cities`,
          {
            country: userProfile.country,
            state: userProfile.state,
          }
        );
        console.log("city after fetch", res);
        setCities(
          res.data.data.map((c) => ({
            value: c,
            label: c,
          }))
        );
      } catch (error) {
        console.log("get city err", error);
      }
    };

    handleGetAllCity();
  }, [userProfile.state]);

  const handleSubmit = async () => {
    console.log("edit form data", userProfile);
    setIsLoading(true);
    try {
      const imageUrlList = [];

      for (const img of imageUpload) {
        const url = await uploadImage(img);
        imageUrlList.push(url);
      }

      const newUserProfileEditData = {
        ...userProfile,
        photoUrls: [
          imageUrlList[0],
          ...(userProfile.photoUrls?.slice(1) || []),
        ],
      };

      console.log("edit newUserProfileEditData data", newUserProfileEditData);

      const res = await updateUserProfileAPI(userId, userProfile);

      await handleGetUserById(userId);

      setTimeout(async () => {
        setIsLoading(false);
      }, 1500);

      Toast.show({
        type: "success",
        text1: "Cập nhật thông tin thành công!",
        text2: "Thành công",
      });
    } catch (error) {
      console.log("update profile err", error);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      Toast.show({
        type: "error",
        text1: "Cập nhật thông tin thất bại!",
        text2: "Thử lại nhé",
      });
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
                    userProfile?.photoUrls?.[0]
                      ? { uri: userProfile.photoUrls[0] }
                      : require("@assets/images/avatar.png")
                  }
                  className="w-32 h-32 rounded-full"
                  resizeMode="cover"
                />
                <TouchableOpacity onPress={handleImagePick}>
                  <Text className="text-lg text-black mt-1 mb-1">
                    Thay đổi hình ảnh
                  </Text>
                </TouchableOpacity>
              </View>

              {/*Form */}
              <View className="mt-8 gap-6">
                <InputField
                  label={"Tên đầu"}
                  placeholder={"Johnny"}
                  value={userProfile.firstname}
                  name="firstname"
                  setUserProfile={setUserProfile}
                />
                <InputField
                  label={"Tên cuối"}
                  placeholder={"Johnny"}
                  value={userProfile.lastname}
                  name="lastname"
                  setUserProfile={setUserProfile}
                />
                <InputField
                  label={"Tên đăng nhập"}
                  placeholder={"johnny_fhf"}
                  value={userProfile.username}
                  name="username"
                  setUserProfile={setUserProfile}
                />
                <InputField
                  label={"Giới tính"}
                  placeholder={userProfile?.gender || "Chọn giới tính"}
                  type="select"
                  openSelect={openSelect === "gender"}
                  isLoading={isLoadingFetchCountry}
                  setOpenSelect={() =>
                    setOpenSelect(openSelect === "gender" ? null : "gender")
                  }
                  data={genderData}
                  setUserProfile={setUserProfile}
                  name="gender"
                  value={userProfile.gender}
                />
                <InputField
                  label={"Ngày sinh"}
                  placeholder={"Date/Month/Year"}
                  type="date"
                  openSelect={openSelect === "dob"}
                  name="dob"
                  setUserProfile={setUserProfile}
                  setOpenSelect={() =>
                    setOpenSelect(openSelect === "dob" ? null : "dob")
                  }
                  value={userProfile.dob}
                />
                {/* <InputField
                  label={"Country"}
                  placeholder={"Country"}
                  type="select"
                  openSelect={openSelect === "country"}
                  isLoading={isLoadingFetchCountry}
                  setOpenSelect={() =>
                    setOpenSelect(openSelect === "country" ? null : "country")
                  }
                  data={countries}
                  setUserProfile={setUserProfile}
                  name="country"
                  value={userProfile.country}
                />
                <InputField
                  label={"State"}
                  placeholder={"State"}
                  type="select"
                  openSelect={openSelect === "state"}
                  isLoading={isLoadingFetchCountry}
                  setOpenSelect={() =>
                    setOpenSelect(openSelect === "state" ? null : "state")
                  }
                  data={states}
                  setUserProfile={setUserProfile}
                  name="state"
                  value={userProfile.state}
                />
                <InputField
                  label={"City"}
                  placeholder={"City"}
                  type="select"
                  openSelect={openSelect === "city"}
                  setOpenSelect={() =>
                    setOpenSelect(openSelect === "city" ? null : "city")
                  }
                  data={cities}
                  setUserProfile={setUserProfile}
                  name="city"
                  value={userProfile.city}
                />
                <InputField
                  label={"Present Address"}
                  placeholder={"Nguyen Thi Thap, District 8, HCMC"}
                  value={userProfile.presentAddress}
                  name="presentAddress"
                  setUserProfile={setUserProfile}
                />
                <InputField
                  label={"Permanent Address"}
                  placeholder={"Nguyen Thi Thap, District 8, HCMC"}
                  value={userProfile.permanentAddress}
                  name="permanentAddress"
                  setUserProfile={setUserProfile}
                />
                <InputField
                  label={"Postal Code"}
                  placeholder={"56789"}
                  value={userProfile.postalCode}
                  name="postalCode"
                  setUserProfile={setUserProfile}
                /> */}
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
