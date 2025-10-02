import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../../context/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { getUserByIdAPI } from "@services/userService";
import ModalReportAccount from "@components/ReportComponent/ModalReportAccount";
import { createReportMessageAPI } from "@services/reportService";

export default function ProfileByIdScreen() {
  const { profileId } = useLocalSearchParams();
  const screenWidth = Dimensions.get("window").width;

  const [profileInfo, setProfileInfo] = useState(null);

  const [openReportAccount, setOpenReportAccount] = useState(false);

  const { userInfo } = useContext(AuthContext);

  const [stats, setStats] = useState([
    {
      number: 29,
      label: "Chuỗi",
      icon: require("@assets/icons/fire.png"),
    },
    {
      number: 45,
      label: "Độ uy tín",
      icon: require("@assets/icons/trustscore.png"),
    },
    {
      number: userInfo?.point || 1900,
      label: "Điểm",
      icon: require("@assets/icons/point.png"),
    },
  ]);

  const [reportAccountForm, setReportAccountForm] = useState({
    reporterId: userInfo.accountId,
    reportedAccountId: profileId,
    reportedMessageId: null,
    reportedRoomId: null,
    reason: "",
  });

  useEffect(() => {
    const handleGetUserById = async () => {
      try {
        const res = await getUserByIdAPI(profileId);
        console.log("get profile detail", res.data);
        setProfileInfo(res.data);
      } catch (error) {
        console.log("get user by id err", error);
      }
    };
    handleGetUserById();
  }, [profileId]);

  const handleSubmitReport = useCallback(async () => {
    try {
      console.log("report account data", reportAccountForm);
      const res = await createReportMessageAPI(reportAccountForm);
      console.log("reportMessageForm res", res.data);

      setReportAccountForm((prev) => ({
        ...prev,
        reason: "",
      }));

      setOpenReportAccount(false);
    } catch (error) {
      console.log("submit report err", error);
    }
  }, [reportAccountForm]);

  const imgList = [
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
    require("@assets/images/applogo.png"),
  ];

  return (
    <>
      <SafeAreaView edges={["top"]} className="flex-1 bg-beige-primary">
        <ScrollView
          className="flex-1  gap-6 space-y-6"
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/*Header */}
          <View className="px-6 h-16 flex-row justify-between items-center overflow-hidden">
            {/*Logo */}
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={34}
                color="#57298D"
              />
            </TouchableOpacity>
          </View>

          <View className="mb-2">
            <Image
              source={require("@assets/images/bannerMain.png")}
              style={{ height: 100, width: "100%" }}
            />
          </View>
          {/*Info */}
          <View className="mb-6 px-6 gap-4">
            {/*User ava && points */}
            <View className=" flex-row justify-between items-center gap-4">
              {/*Avatar */}
              <Image
                source={
                  profileInfo?.photos?.[0]
                    ? { uri: profileInfo.photos[0] }
                    : require("@assets/images/avatar.png")
                }
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
              {/*state */}
              <View className=" flex-1 flex-row justify-around items-center py-2">
                {stats.map((item, index) => (
                  <View key={index} className="items-center">
                    <Text className="font-bold text-2xl text-purple-primary">
                      {item.number}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Image
                        source={item.icon}
                        className="w-5 h-5"
                        resizeMode="cover"
                      />
                      <Text className="text-md text-purple-primary">
                        {item.label}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/*bio */}
            <View className="">
              <Text className="text-purple-third text-2xl font-semibold">
                {profileInfo?.lastname} {profileInfo?.firstname}
              </Text>
              <Text>{profileInfo?.gender}</Text>
            </View>

            {/*Feature */}
            <View className="flex-row gap-2 justify-between items-center">
              <TouchableOpacity className="bg-white rounded-2xl w-[42%] p-2 items-center justify-center">
                <Text className="text-purple-primary font-semibold text-lg">
                  Kết bạn
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white rounded-2xl w-[42%] p-2 items-center justify-center">
                <Text className="text-purple-primary font-semibold text-lg">
                  Nhắn tin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setOpenReportAccount(true)}>
                <MaterialIcons name="error-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>

          {/*Picture */}
          <View className="flex-row gap-[2.5px] flex-wrap">
            {imgList.map((item, index) => (
              <Image
                key={index}
                source={item}
                style={{
                  width: screenWidth / 3.04,
                  height: screenWidth / 3.04,
                }}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {openReportAccount && (
        <ModalReportAccount
          openReportAccount={openReportAccount}
          setOpenReportAccount={setOpenReportAccount}
          reportAccountForm={reportAccountForm}
          setReportAccountForm={setReportAccountForm}
          handleSubmitReport={handleSubmitReport}
        />
      )}
    </>
  );
}
