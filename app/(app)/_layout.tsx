import { CustomDrawer } from "@/components/CustomDrawer";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { FontAwesome6 } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: Colors.dark_light,
          drawerActiveTintColor: Colors.light,
          drawerItemStyle: styles.drawerItemStyle,
          drawerLabelStyle: styles.drawerLabelStyle,
          drawerStyle: styles.drawerStyle,
          drawerType: "slide",
          headerStyle: styles.headerStyle,
          headerTintColor: Colors.light,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: t("myTasks.headerTitle"),
            drawerIcon: ({ color, size }) => (
              <FontAwesome6 name="list-check" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark,
    flex: 1,
  },
  drawerItemStyle: {
    borderRadius: 8,
  },
  drawerLabelStyle: {
    fontFamily: Fonts.family.medium,
  },
  drawerStyle: {
    width: "75%",
  },
  headerStyle: {
    backgroundColor: Colors.dark,
    elevation: 0,
  },
  headerTitleStyle: {
    fontFamily: Fonts.family.bold,
  },
});
