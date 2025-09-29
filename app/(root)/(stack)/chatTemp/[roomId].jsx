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
import { matchDeleteAPI } from "@services/matchService";
import ModalChatTemp from "@components/StackChatTempComponent/ModalChatTemp";
import {
  getChatConnection,
  getMatchConnection,
} from "@services/signalRService";

export default function ChatTempRoom() {
  const { roomId, accountId2, accountId1 } = useLocalSearchParams();

  const { userId } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [countdown, setCountdown] = useState(90);

  const scrollViewRef = useRef(null);
  const connectRoomRef = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    // bắt đầu đếm ngược
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOpenModal(true); // hết giờ thì mở modal
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const leaveRoom = async () => {
    try {
      const conn = await getMatchConnection();
      if (conn.state === "Disconnected") {
        await conn.start();
      }

      conn.on("UserWantsContinue", async (accountId, roomId) => {
        console.log("Nhận sự kiện UserWantsContinue:", accountId, roomId);
      });

      conn.on("RoomPermanent", async (roomId) => {
        console.log("Nhận sự kiện RoomPermanent:", roomId);
      });

      conn.on("ChatEnded", async (roomId) => {
        console.log("Nhận sự kiện ChatEnded:", roomId);
        setMessages([]);
        router.replace("/(tabs)/home");
      });
      connectRoomRef.current = conn;
    } catch (error) {
      console.log("end chat room err", error);
    }
  };

  // signalr connect room
  const joinRoom = async () => {
    try {
      // 1. Connect
      const conn = await getChatConnection();

      if (conn.state === "Disconnected") {
        await conn.start();
      }

      // lắng nghe tin nhắn từ server
      conn.on("ReceiveMessage", (msg) => {
        console.log("receive mess", msg);
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
    leaveRoom();
    joinRoom();

    return () => {
      if (connectionRef.current) connectionRef.current.stop();
      if (connectRoomRef.current) connectRoomRef.current.stop();
    };
  }, [roomId, userId]);
  // end signalr connect

  // get all message
  useFocusEffect(
    useCallback(() => {
      const handleGetMessageRoom = async () => {
        setIsLoading(true);
        try {
          const res = await getRoomDetailBetweenUserAPI(
            roomId,
            accountId1,
            accountId2
          );
          setMessages(res.data);
        } catch (error) {
          console.log("get mess room between err", error);
        } finally {
          setIsLoading(false);
        }
      };
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
      await sendMessageAPI(sendMessageForm);
      setSendMessageForm({ ...sendMessageForm, content: "" });
    } catch (error) {
      console.log("send mess err", error);
    }
  };

  const handleEndChat = async () => {
    try {
      const res = await matchDeleteAPI(roomId);
      console.log("Delete match chat res", res);
    } catch (err) {
      console.log("Delete match chat API error:", err);
    }
  };

  // auto scroll down when have new message
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (isLoading) {
    return <LoadingCustom label="Loading messages..." />;
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-beige-primary">
        {/*Heading */}
        <View className="h-16 flex-row justify-between items-center px-4 border-b border-yellow-50">
          {/*Left */}
          <View className="flex-row items-center gap-4 w-[80%]">
            <View className="flex-row gap-2 items-center">
              {/*Name & active */}
              <View className="flex-1">
                <Text className="font-medium text-lg">
                  Còn lại {countdown} giây để tìm hiểu nhau
                </Text>
              </View>
            </View>
          </View>
          {/*Right */}
          <View className="flex-row gap-4">
            <MaterialIcons name="error-outline" size={24} color="red" />
            <TouchableOpacity onPress={() => handleEndChat(roomId)}>
              <MaterialIcons name="logout" size={24} color="purple" />
            </TouchableOpacity>
          </View>
        </View>

        {/*Content */}
        <ScrollView
          ref={scrollViewRef}
          className="pt-4 px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.length > 0 &&
            messages.map((item) => (
              <View
                key={item?.messageId}
                className={`flex-row gap-2 items-start mb-3`}
              >
                <View
                  className={`${item?.senderId === userId ? "items-end" : "items-start"} gap-1 w-full`}
                >
                  <View
                    className={`${item?.senderId === userId ? "bg-purple-500" : "bg-gray-300"} rounded-full p-3 px-4 max-w-[70%]`}
                  >
                    <Text
                      className={`${item?.senderId === userId ? "text-white" : "text-black"}`}
                    >
                      {item?.content}
                    </Text>
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
          <View className="rounded-full h-14 flex-1 items-center flex-row px-3 bg-black/5">
            <View className="w-11 h-11 bg-purple-primary rounded-full overflow-hidden items-center justify-center">
              <Ionicons name="image" size={24} color="white" />
            </View>
            <TextInput
              className="flex-1 h-full px-3 pb-1 text-xl text-purple-primary"
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
          </View>

          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="#57298D" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {openModal && (
        <ModalChatTemp
          roomId={roomId}
          setOpenModal={setOpenModal}
          openModal={openModal}
        />
      )}
    </>
  );
}
