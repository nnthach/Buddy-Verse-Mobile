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
import React, { useCallback, useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import axios from "axios";
import InputField from "@components/InputFieldCustom";

export default function EditProfileForm() {
  const ADDRESS_BASE_URL = "https://countriesnow.space/api/v0.1";
  const [countryData, setCountryData] = useState({
    country: "",
    state: "",
    city: "",
  });

  const [userProfile, setUserProfile] = useState({
    name: "John",
    username: "nnthach",
    email: "nnthach2301@gmail.com",
    password: "123456",
    country: "",
    state: "",
    city: "",
    dob: "",
    permanentAddress: "",
    presentAddress: "",
    postalCode: "",
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [isLoadingFetchCountry, setIsLoadingFetchCountry] = useState(false);

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-beige-primary">
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
                  color="#57298D"
                />
              </TouchableOpacity>
              <Text className="text-purple-primary font-semibold text-2xl">
                Manage Account
              </Text>
              <Text className="w-[34px]" />
            </View>

            {/*Avatar */}
            <View className="mt-6 justify-center items-center">
              <Image
                source={{
                  uri: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg",
                }}
                className="w-32 h-32 rounded-full"
                resizeMode="cover"
              />
              <Text className="text-lg text-purple-primary mt-1 mb-1">
                Change Avatar
              </Text>
            </View>

            {/*Form */}
            <View className="mt-8 gap-6">
              <InputField
                label={"Your Name"}
                placeholder={"Johnny Hawak"}
                value={userProfile.name}
                name="name"
                setUserProfile={setUserProfile}
              />
              <InputField
                label={"Username"}
                placeholder={"johnny_fhf"}
                value={userProfile.username}
                name="username"
                setUserProfile={setUserProfile}
              />
              <InputField
                label={"Email"}
                placeholder={"johnnyexample@gmail.com"}
                keyboardType="email-address"
                name="email"
                setUserProfile={setUserProfile}
                value={userProfile.email}
              />
              <InputField
                label={"Password"}
                placeholder={"*******"}
                secureTextEntry
                value={userProfile.password}
                name="password"
                setUserProfile={setUserProfile}
              />
              <InputField
                label={"Date of Birth"}
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
              <InputField
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
              />
            </View>

            <View className="mt-4">
              <TouchableOpacity
                onPress={() => console.log("edit form data", userProfile)}
                className="bg-purple-third py-4 px-6 rounded-full w-full"
              >
                <Text className="text-white text-xl font-medium text-center">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
