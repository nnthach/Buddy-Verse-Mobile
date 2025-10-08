import {
  View,
  Text,
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
import { matchContinueAPI, matchDeleteAPI } from "@services/matchService";
import {
  getChatConnection,
  getMatchConnection,
} from "@services/signalRService";
import Feather from "@expo/vector-icons/Feather";
import Toast from "react-native-toast-message";

export default function ChatTempRoom() {
  const { roomId, accountId2, accountId1 } = useLocalSearchParams();
  const [userWantContinue, setUserWantContinue] = useState("");

  const { userId } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [countdown, setCountdown] = useState(120);

  const scrollViewRef = useRef(null);
  const connectRoomRef = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    // bắt đầu đếm ngược
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
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
        console.log(
          "[MatchHub] Connection started chat temp:",
          conn.connectionId
        );
      }

      // gỡ hết handler cũ tránh attach trùng khi re-render
      conn.off("UserWantsContinue");
      conn.off("RoomPermanent");
      conn.off("ChatEnded");

      // UserWantsContinue --------------------------------------------------------------------------
      conn.on("UserWantsContinue", async (accountId, roomId) => {
        try {
          console.log(
            "Nhận UserWantsContinue:",
            accountId,
            roomId,
            "ConnId:",
            conn.connectionId
          );

          if (accountId != userId) {
            Toast.show({
              type: "success",
              text1: "Bạn kia muốn tiếp tục trò chuyện!",
              text2: "Hãy bấm vào trái tim để tiếp tục nhé?",
            });

            setUserWantContinue("Đối phương muốn tiếp tục");
          }
        } catch (err) {
          console.error("Error in UserWantsContinue handler:", err);
        }
      });

      //  RoomPermanent -------------------------------------------------------------------------------------
      conn.on("RoomPermanent", async (roomId) => {
        try {
          console.log(
            "Nhận RoomPermanent:",
            roomId,
            "ConnId:",
            conn.connectionId
          );
          if (roomId) {
            router.replace(`/(stack)/chat/${roomId}`);
          }
        } catch (err) {
          console.error("Error in RoomPermanent handler:", err);
        }
      });

      // ChatEnded ---------------------------------------------------------------------------------------------
      conn.on("ChatEnded", async (roomId) => {
        try {
          console.log("Nhận ChatEnded:", roomId, "ConnId:", conn.connectionId);
          setMessages([]);
          Toast.show({
            type: "success",
            text1: "Một trong hai bạn đã rời phòng!",
            text2: "Hãy tiếp tục tìm kiếm nhé",
          });
          router.replace("/(tabs)/home");
        } catch (err) {
          console.error("Error in ChatEnded handler:", err);
        }
      });

      connectRoomRef.current = conn;
    } catch (error) {
      console.log("end chat room err", error);
    }
  };

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
    } catch (err) {
      console.log("Delete match chat API error:", err);
    }
  };

  const handleContinueChat = async () => {
    try {
      const res = await matchContinueAPI({ accountId: userId, roomId });
      console.log("continue chat res", res);
    } catch (err) {
      console.log("continue chat API error:", err);
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
    <SafeAreaView className="flex-1 bg-white-primary">
      {/*Heading */}
      <View className="h-16 flex-row items-center justify-between px-4 border-b border-gray-200 bg-white">
        {/* Left */}
        <View className="flex-row items-center gap-3">
          {/* Countdown */}
          <View className="bg-yellow-400 px-4 py-2 rounded-md">
            <Text className="font-bold text-black text-base">
              {String(Math.floor(countdown / 60)).padStart(2, "0")}:
              {String(countdown % 60).padStart(2, "0")}
            </Text>
          </View>

          {/* userWantContinue */}
          {userWantContinue !== "" && (
            <Text className="text-gray-700 font-medium" numberOfLines={1}>
              {userWantContinue}
            </Text>
          )}
        </View>

        {/* Right */}
        <View className="flex-row items-center gap-4">
          <MaterialIcons name="error-outline" size={24} color="red" />
          <TouchableOpacity onPress={() => handleEndChat(roomId)}>
            <MaterialIcons name="logout" size={24} color="black" />
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
                  className={`${item?.senderId === userId ? "bg-yellow-primary/60" : "bg-purple-200/70"} rounded-full p-3 px-4 max-w-[70%]`}
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
        <View className="rounded-full h-12 flex-1 items-center flex-row px-3 bg-black/5">
          <TextInput
            className="flex-1 h-full px-3 pb-1 text-xl text-black"
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

        {sendMessageForm.content != "" && (
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="black" />
          </TouchableOpacity>
        )}
        <Feather name="mic" size={22} color="black" />
        <Feather name="smile" size={22} color="black" />
        <Feather name="camera" size={24} color="black" />
      </View>

      {/* Floating continue button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleContinueChat}
        className="absolute right-4 bottom-20 bg-yellow-400 w-12 h-12 rounded-full items-center justify-center shadow-md"
      >
        <MaterialIcons name="favorite" size={22} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
