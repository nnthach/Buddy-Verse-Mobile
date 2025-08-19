import { Stack } from "expo-router";

function GetStartLayout() {
  return (
    <Stack>
      <Stack.Screen name="page-one" options={{ headerShown: false }} />
      <Stack.Screen name="page-two" options={{ headerShown: false }} />
      <Stack.Screen name="page-three" options={{ headerShown: false }} />
      <Stack.Screen name="page-four" options={{ headerShown: false }} />
    </Stack>
  );
}

export default GetStartLayout;
