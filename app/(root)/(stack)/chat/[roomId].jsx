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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "../../../../context/AuthContext";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import {
  getRoomDetailBetweenUserAPI,
  getRoomIdByUserIdAPI,
  sendMessageAPI,
} from "@services/messageService";
import LoadingCustom from "@components/LoadingCustom";

export default function ChatRoom() {
  const { roomId, accountId2 } = useLocalSearchParams();

  const { userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef(null);

  // signalr connect
  const connectionRef = useRef(null);

  const joinRoom = async () => {
    try {
      // 1. Connect
      const conn = new HubConnectionBuilder()
        .withUrl("http://10.0.2.2:5116/chatHub")
        .configureLogging(LogLevel.Information)
        .build();

      // lắng nghe tin nhắn từ server
      conn.on("ReceiveMessage", (msg) => {
        console.log("receive mess", msg);
        setMessages((prev) =>
          prev.some((m) => m.messageId === msg.messageId)
            ? prev
            : [...prev, msg]
        );
      });

      await conn.start();
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

  // get all message
  useFocusEffect(
    useCallback(() => {
      const handleGetMessageRoom = async () => {
        setIsLoading(true);
        try {
          const res = await getRoomDetailBetweenUserAPI(
            roomId,
            userId,
            accountId2
          );
          console.log("get mess room between res", res.data);
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
      console.log("send mess form", sendMessageForm);
      const res = await sendMessageAPI(sendMessageForm);
      console.log("send mess res", res.data);
      setSendMessageForm({ ...sendMessageForm, content: "" });
    } catch (error) {
      console.log("send mess err", error);
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
    <SafeAreaView className="flex-1 bg-beige-primary">
      {/*Heading */}
      <View className="h-16 flex-row justify-between items-center px-4 border-b border-yellow-50">
        {/*Left */}
        <View className="flex-row items-center gap-4 w-[80%]">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={34}
              color="#57298D"
            />
          </TouchableOpacity>
          <View className="flex-row gap-2 items-center">
            <Image
              source={{
                uri: "gẻg",
              }}
              className="w-12 h-12 rounded-full"
              resizeMode="cover"
            />
            {/*Name & active */}
            <View className="flex-1">
              <Text className="font-semibold text-xl">Hai Anh</Text>
              <Text className="text-gray-500">Online</Text>
            </View>
          </View>
        </View>
        {/*Right */}
        <FontAwesome5 name="bell" size={24} color="#57298D" />
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
              {item?.senderId !== userId && (
                <View className="w-11 h-11 bg-gray-400 rounded-full overflow-hidden items-center justify-center">
                  <Image
                    source={{
                      uri: item?.senderPhotos[0],
                    }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                </View>
              )}

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
  );
}
