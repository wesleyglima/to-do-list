import Button from "@/components/Button";
import Input from "@/components/Input";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { auth } from "@/firebase/firebaseConfig";
import { useUserStore } from "@/store/UserStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as yup from "yup";

type FormData = {
  email: string;
  password: string;
};

export default function Index() {
  const [isLogginIn, setIsLoggingIn] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);

  const router = useRouter();

  const { t } = useTranslation();

  const { setUser } = useUserStore();

  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .required(t("login.requiredEmailMessage"))
      .email(t("login.invalidEmailMessage")),
    password: yup
      .string()
      .trim()
      .min(6, t("login.minPasswordMessage"))
      .required(t("login.requiredPasswordMessage")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleLogin({ email, password }: FormData) {
    try {
      setIsLoggingIn(true);

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      setUser(user);

      router.replace("/(app)");
    } catch (error) {
      console.log(error);

      const errorMessage =
        //@ts-ignore
        error?.message === "Firebase: Error (auth/invalid-credential)."
          ? t("login.invalidCredentialMessage")
          : t("login.errorMessage");

      Alert.alert(t("login.alertTitle"), errorMessage);

      setIsLoggingIn(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="always"
      >
        <KeyboardAvoidingView behavior="position">
          <Image
            style={styles.image}
            source={require("@/assets/images/to-do-list.png")}
          />
          <View style={styles.form}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View>
                  <Input
                    autoCapitalize="none"
                    editable={!isLogginIn}
                    error={errors?.email?.message}
                    keyboardType="email-address"
                    onChangeText={onChange}
                    onSubmitEditing={() => passwordInputRef?.current?.focus()}
                    placeholder={t("login.emailInputPlaceholder")}
                    value={value}
                  />
                </View>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View>
                  <Input
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLogginIn}
                    error={errors?.password?.message}
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit(handleLogin)}
                    placeholder={t("login.passwordInputPlaceholder")}
                    ref={passwordInputRef}
                    secureTextEntry
                    value={value}
                  />
                </View>
              )}
            />
            <Button
              title={t("login.cta")}
              onPress={handleSubmit(handleLogin)}
              disabled={isLogginIn}
            />
            <Link href="/(auth)/register" asChild>
              <Text style={styles.text}>
                {t("login.firstLinkText")}{" "}
                <Text style={{ fontFamily: Fonts.family.bold }}>
                  {t("login.secondLinkText")}
                </Text>
              </Text>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark,
    flex: 1,
  },
  scroll: {
    minHeight: "100%",
    paddingBottom: 32,
  },
  image: {
    alignSelf: "center",
    aspectRatio: 1,
    height: undefined,
    marginTop: 32,
    width: "80%",
  },
  form: {
    gap: 24,
    paddingHorizontal: 24,
  },
  text: {
    color: Colors.primary,
    fontFamily: Fonts.family.medium,
    textAlign: "center",
  },
});
