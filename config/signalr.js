import * as signalR from "@microsoft/signalr";

let connection = null;

export const startSignalR = async (userId, onMatched) => {
  const url = process.env.EXPO_PUBLIC_SIGNALR_URL;
  console.log("🔗 SignalR URL:", url);

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.EXPO_PUBLIC_SIGNALR_URL}/matchHub`, {
      accessTokenFactory: () => userId, // nếu backend cần token
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  // Lắng nghe event khi backend push match thành công
  connection.on("Matched", (data) => {
    console.log("Matched event:", data);
    if (onMatched) onMatched(data);
  });

  try {
    await connection.start();
    console.log("SignalR Connected to matchHub");
  } catch (err) {
    console.error("SignalR Error:", err);
  }

  return connection;
};

export const stopSignalR = async () => {
  if (connection) {
    await connection.stop();
    console.log("SignalR Disconnected");
  }
};
