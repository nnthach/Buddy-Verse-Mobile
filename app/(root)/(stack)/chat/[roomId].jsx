import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "../../../../context/AuthContext";
import {
  getRoomDetailBetweenUserAPI,
  sendMessageAPI,
} from "@services/messageService";
import LoadingCustom from "@components/LoadingCustom";
import { getUserByIdAPI } from "@services/userService";
import ReportCustomModal from "@components/ReportCustomModal";
import ModalReportMessage from "@components/ReportComponent/ModalReportMessage";
import { createReportMessageAPI } from "@services/reportService";
import Feather from "@expo/vector-icons/Feather";
import { getChatConnection } from "@services/signalRService";

export default function ChatRoom() {
  const { roomId, accountId2 } = useLocalSearchParams();

  const [userInfoTwo, setUserTwoInfo] = useState();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useContext(AuthContext);

  const [isOpenReport, setIsOpenReport] = useState(false);

  const [activeMessageId, setActiveMessageId] = useState(null);

  const [messageReportId, setMessageReportId] = useState(null);

  const [reportMessageForm, setReportMessageForm] = useState({
    reporterId: userId,
    reportedAccountId: accountId2,
    reportedMessageId: null,
    reportedRoomId: roomId,
    reason: "",
  });

  const scrollViewRef = useRef(null);

  // signalr connect
  const connectionRef = useRef(null);

  const joinRoom = async () => {
    try {
      // 1. Connect
      const conn = await getChatConnection();

      if (conn.state === "Disconnected") {
        await conn.start();
      }

      // lắng nghe tin nhắn từ server
      conn.on("ReceiveMessage", (msg) => {
        setMessages((prev) =>
          prev.some((m) => m.messageId === msg.messageId)
            ? prev
            : [...prev, msg]
        );
      });

      await conn.invoke("JoinRoom", userId, roomId);

      connectionRef.current = conn;
    } catch (error) {
      console.log("join room err", error);
    }
  };

  useEffect(() => {
    joinRoom();

    return () => {
      if (connectionRef.current) connectionRef.current.stop();
    };
  }, [roomId, userId]);
  // end signalr connect

  const handleGetUserById = async (id) => {
    try {
      const res = await getUserByIdAPI(id);
      setUserTwoInfo(res.data);
    } catch (error) {
      console.log("get user by id err", error);
    }
  };

  const handleGetMessageRoom = async () => {
    setIsLoading(true);
    try {
      const res = await getRoomDetailBetweenUserAPI(roomId, userId, accountId2);
      setMessages(res.data);
    } catch (error) {
      console.log("get mess room between err", error);
    } finally {
      setIsLoading(false);
    }
  };
  // get all message
  useFocusEffect(
    useCallback(() => {
      handleGetUserById(accountId2);
      handleGetMessageRoom();
    }, [])
  );
  const [sendMessageForm, setSendMessageForm] = useState({
    roomId,
    senderId: userId,
    content: "",
    replyTo: null,
  });

  const handleSendMessage = async () => {
    try {
      const res = await sendMessageAPI(sendMessageForm);
      setSendMessageForm({ ...sendMessageForm, content: "" });
    } catch (error) {
      console.log("send mess err", error);
    }
  };

  const handleSubmitReport = useCallback(async () => {
    try {
      const payload = {
        ...reportMessageForm,
        reportedMessageId: messageReportId,
      };

      const res = await createReportMessageAPI(payload);

      setReportMessageForm((prev) => ({
        ...prev,
        reportedMessageId: null,
        reason: "",
      }));

      setMessageReportId(null);
    } catch (error) {
      console.log("submit report err", error);
    }
  }, [reportMessageForm]);

  const handleLongPress = (messageId) => {
    setActiveMessageId(messageId);

    // Auto close sau 5s
    setTimeout(() => {
      setActiveMessageId(null);
    }, 5000);
  };

  // auto scroll down when have new message
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (isLoading) {
    return <LoadingCustom label="Đang tải tin nhắn..." />;
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-white-primary">
        {/*Heading */}
        <View className="h-16 flex-row justify-between items-center px-4 border-b border-gray-50">
          {/*Left */}
          <View className="flex-row items-center gap-4 w-[80%]">
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/chat");
                }
              }}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={34}
                color="black"
              />
            </TouchableOpacity>
            <View className="flex-row gap-2 items-center">
              <View className="w-12 h-12 rounded-full bg-gray-400">
                <Image
                  source={{
                    uri: userInfoTwo?.photos[0],
                  }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              </View>
              {/*Name & active */}
              <TouchableOpacity
                onPress={() => {
                  router.push(`/profile/${accountId2}`);
                }}
                className="flex-1"
              >
                <Text className="font-semibold text-xl">
                  {userInfoTwo?.lastname} {userInfoTwo?.firstname}
                </Text>
                <Text className="text-gray-500">Online</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/*Right */}
          <TouchableOpacity onPress={() => setIsOpenReport(true)}>
            <MaterialIcons name="error-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>

        {/*Content */}
        <ScrollView
          ref={scrollViewRef}
          className="pt-4 px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.length > 0 &&
            messages?.map((item) => (
              // line wrap all message
              <View
                key={item?.messageId}
                className={`flex-row gap-2 items-start mb-3`}
              >
                {/*Avatar */}
                {item?.senderId !== userId && (
                  <View className="w-11 h-11 bg-gray-400 rounded-full overflow-hidden items-center justify-center">
                    <Image
                      source={{
                        uri: userInfoTwo?.photos[0],
                      }}
                      className="w-11 h-11 rounded-full"
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* only message no ava*/}
                <View
                  className={`${item?.senderId === userId ? "items-end" : "items-start"} gap-1 w-full `}
                >
                  {/*message wrap */}
                  <View>
                    <TouchableOpacity
                      onLongPress={() => handleLongPress(item?.messageId)}
                      activeOpacity={0.7}
                      className={`${item?.senderId === userId ? "bg-yellow-primary/60" : "bg-purple-200/70"} rounded-3xl p-3 px-4 max-w-[70%]`}
                    >
                      <Text
                        className={`${item?.senderId === userId ? "text-white" : "text-black"}`}
                      >
                        {item?.content}
                      </Text>
                    </TouchableOpacity>

                    {activeMessageId === item?.messageId && (
                      <TouchableOpacity
                        onPress={() => {
                          setMessageReportId(item?.messageId);
                        }}
                        className="absolute right-[-30px] top-[50%] translate-y-[-50%] flex-row"
                      >
                        <MaterialIcons
                          name="error-outline"
                          size={24}
                          color="red"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text className="text-gray-400 text-xs">
                    {new Date(item?.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            ))}
        </ScrollView>

        {/*Input */}
        <View className="flex-row px-4 items-center gap-4 ">
          <View className="rounded-xl h-12 flex-1 items-center flex-row px-3 bg-black/5">
            <TextInput
              className="flex-1 h-full px-3 pb-2 text-xl text-black"
              onChangeText={(text) =>
                setSendMessageForm((prev) => ({
                  ...prev,
                  content: text,
                }))
              }
              value={sendMessageForm.content}
              textAlignVertical="center"
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#00000050"
            />
            {sendMessageForm.content != "" && (
              <TouchableOpacity onPress={handleSendMessage}>
                <Ionicons name="send" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <Feather name="mic" size={22} color="black" />
          <Feather name="smile" size={22} color="black" />
          <Feather name="camera" size={24} color="black" />
        </View>
      </SafeAreaView>

      {isOpenReport && <ReportCustomModal setIsOpenReport={setIsOpenReport} />}
      {messageReportId && (
        <ModalReportMessage
          messageReportId={messageReportId}
          setMessageReportId={setMessageReportId}
          reportMessageForm={reportMessageForm}
          setReportMessageForm={setReportMessageForm}
          handleSubmitReport={handleSubmitReport}
        />
      )}
    </>
  );
}
