import { useCallback, useEffect, useRef, useState } from "react";
import { getChatConnection } from "@services/signalRService";
import {
  getRoomDetailBetweenUserAPI,
  sendMessageAPI,
} from "@services/messageService";
import { getUserByIdAPI } from "@services/userService";
import { useFocusEffect } from "expo-router";

function useChatRoom(roomId, userId, accountId2) {
  const [messages, setMessages] = useState([]);
  const [userInfoTwo, setUserInfoTwo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const connectionRef = useRef(null);

  // 1. Connect signalR and listen event ReceiveMessage
  const joinRoom = useCallback(async () => {
    try {
      const conn = await getChatConnection();

      if (conn.state === "Disconnected") {
        await conn.start();
      }

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
    } catch (err) {
      console.log("join room err", err);
    }
  }, [roomId, userId]);

  // 2. Get all message
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getRoomDetailBetweenUserAPI(roomId, userId, accountId2);
      setMessages(res.data);
    } catch (err) {
      console.log("fetch message err", err);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, userId, accountId2]);

  // 3. Get user đối phương
  const fetchUserTwo = useCallback(async () => {
    try {
      const res = await getUserByIdAPI(accountId2);
      setUserInfoTwo(res.data);
    } catch (err) {
      console.log("fetch user two err", err);
    }
  }, [accountId2]);

  // 4.Send msg
  const sendMessage = useCallback(async (form) => {
    try {
      const res = await sendMessageAPI(form);
      return res.data;
    } catch (err) {
      console.log("send mess err", err);
    }
  }, []);

  // 5. Call & clean
  useEffect(() => {
    joinRoom();
    return () => {
      if (connectionRef.current) connectionRef.current.stop();
    };
  }, [roomId, userId]);

  // 6. fetch data
  useFocusEffect(
    useCallback(() => {
      fetchUserTwo();
      fetchMessages();
    }, [])
  );

  return {
    messages,
    userInfoTwo,
    isLoading,
    sendMessage,
  };
}

export default useChatRoom;
