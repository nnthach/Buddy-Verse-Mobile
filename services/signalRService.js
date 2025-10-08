import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let matchConnection = null;
let chatConnection = null;

export const getMatchConnection = async () => {
  if (!matchConnection) {
    matchConnection = new HubConnectionBuilder()
      .withUrl("http://160.187.1.204:8080/matchHub")
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    await matchConnection.start();
    console.log("Connected to matchHub");
  }
  console.log("matchConnection check chekc check", matchConnection);
  return matchConnection;
};

export const getChatConnection = async () => {
  if (!chatConnection) {
    chatConnection = new HubConnectionBuilder()
      .withUrl("http://160.187.1.204:8080/chatHub")
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    await chatConnection.start();
    console.log("Connected to chatHub");
  }
  return chatConnection;
};

export const setupChatListeners = (onReceiveMessage) => {
  if (!chatConnection._hasListeners) {
    chatConnection.on("ReceiveMessage", onReceiveMessage);
    chatConnection._hasListeners = true;
  }
};

// optional cleanup
export const stopConnections = async () => {
  if (matchConnection) {
    await matchConnection.stop();
    matchConnection = null;
  }
  if (chatConnection) {
    await chatConnection.stop();
    chatConnection = null;
  }
};
