import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { auth } from "@/firebase/firebaseConfig";
import { useUserStore } from "@/store/UserStore";
import { FontAwesome } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, View } from "react-native";

export function CustomDrawer(props: DrawerContentComponentProps) {
  const router = useRouter();

  const { t } = useTranslation();

  const { user, setUser } = useUserStore();

  async function logout() {
    try {
      await signOut(auth);

      setUser(user);

      router.replace("/(auth)");
    } catch (error) {
      console.log(error);

      Alert.alert(
        t("customDrawer.logoutErrorTitle"),
        t("customDrawer.logoutErrorMessage"),
      );
    }
  }

  function handleLogout() {
    Alert.alert(
      t("customDrawer.logoutAlertTitle"),
      t("customDrawer.logoutAlertMessage"),
      [
        {
          text: t("customDrawer.logoutAlertCancelCta"),
          style: "cancel",
        },
        {
          text: t("customDrawer.logoutAlertConfirmCta"),
          style: "destructive",
          onPress: async () => await logout(),
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.nameInitialLetter}>
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
          <Text style={styles.text} numberOfLines={1}>
            {user?.email ?? null}
          </Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          onPress={handleLogout}
          icon={({ size }) => (
            <FontAwesome name="sign-out" color={Colors.danger} size={size} />
          )}
          label={t("customDrawer.logoutCta")}
          labelStyle={styles.drawerItemLabelStyle}
        />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark,
    flex: 1,
  },
  header: {
    gap: 12,
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  avatar: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.primary,
    borderRadius: 128,
    height: 196,
    justifyContent: "center",
    width: 196,
  },
  nameInitialLetter: {
    color: Colors.light,
    fontFamily: Fonts.family.bold,
    fontSize: 96,
  },
  text: {
    color: Colors.light,
    fontFamily: Fonts.family.medium_italic,
    fontSize: Fonts.size.sm,
  },
  drawerItemLabelStyle: {
    color: Colors.danger,
    fontFamily: Fonts.family.medium,
  },
});
