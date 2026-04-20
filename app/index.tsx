import Colors from "@/constants/Colors";
import { auth } from "@/firebase/firebaseConfig";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const { setUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.replace("/(dashboard)");
      } else router.replace("/(auth)");
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("@/assets/images/to-do-list.png")}
      />
      <ActivityIndicator color={Colors.primary} size={38} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.dark,
    flex: 1,
  },
  image: {
    aspectRatio: 1,
    height: undefined,
    marginTop: 24,
    width: "80%",
  },
});
