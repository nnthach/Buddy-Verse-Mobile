import { Stack } from "expo-router";

function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="get-start" options={{ headerShown: false }} />
    </Stack>
  );
}

export default AuthLayout;
