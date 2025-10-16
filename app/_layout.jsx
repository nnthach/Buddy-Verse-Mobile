import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import "./global.css";
import { AuthProvider } from "../context/AuthContext";
import { MatchProvider } from "../context/MatchContext";
import Toast from "react-native-toast-message";
import toastConfig from "@components/CustomToast";
import Notification from "@components/Notification";
import { NotificationProvider } from "@context/NotificationContext";
import { ChatGroupProvider } from "@context/ChatGroupContext";
import JoinGroupModal from "@components/JoinGroupModal";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    PoppinsBlack: require("@assets/fonts/Poppins-Black.ttf"),
    PoppinsBold: require("@assets/fonts/Poppins-Bold.ttf"),
    PoppinsSemiBold: require("@assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsMedium: require("@assets/fonts/Poppins-Medium.ttf"),
    PoppinsRegular: require("@assets/fonts/Poppins-Regular.ttf"),
    PoppinsLight: require("@assets/fonts/Poppins-Light.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <MatchProvider>
        <NotificationProvider>
          <ChatGroupProvider>
            <RootLayoutNav />
            <Toast config={toastConfig} />
            <Notification />
            <JoinGroupModal />
          </ChatGroupProvider>
        </NotificationProvider>
      </MatchProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splashscreen" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
