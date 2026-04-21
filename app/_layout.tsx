import Colors from "@/constants/Colors";
import "@/i18next/i18next";
import {
  Raleway_500Medium,
  Raleway_500Medium_Italic,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  let [loaded, error] = useFonts({
    Raleway_500Medium,
    Raleway_500Medium_Italic,
    Raleway_700Bold,
  });

  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar backgroundColor={Colors.primary} barStyle={"light-content"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}
