import Button from "@/components/Button";
import Input from "@/components/Input";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { auth } from "@/firebase/firebaseConfig";
import { useUserStore } from "@/store/UserStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

export default function Register() {
  const [isRegistering, setIsRegistering] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const router = useRouter();

  const { t } = useTranslation();

  const { setUser } = useUserStore();

  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .required(t("register.requiredEmailMessage"))
      .email(t("register.invalidEmailMessage")),
    password: yup
      .string()
      .trim()
      .min(6, t("register.minPasswordMessage"))
      .required(t("register.requiredPasswordMessage")),
    passwordConfirmation: yup
      .string()
      .trim()
      .required(t("register.requiredConfirmationPasswordMessage"))
      .oneOf([yup.ref("password")], t("register.divergentPasswordsMessage")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleRegister({ email, password }: FormData) {
    try {
      setIsRegistering(true);

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setUser(user);

      router.replace("/(dashboard)");
    } catch (error) {
      console.log(error);

      const errorMessage =
        //@ts-ignore
        error?.message === "Firebase: Error (auth/email-already-in-use)."
          ? t("register.emailAlreadyInUseMessage")
          : t("register.errorMessage");

      Alert.alert(t("register.alertTitle"), errorMessage);

      setIsRegistering(false);
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
                    editable={!isRegistering}
                    error={errors?.email?.message}
                    keyboardType="email-address"
                    onChangeText={onChange}
                    onSubmitEditing={() => passwordInputRef?.current?.focus()}
                    placeholder={t("register.emailInputPlaceholder")}
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
                    editable={!isRegistering}
                    error={errors?.password?.message}
                    onChangeText={onChange}
                    onSubmitEditing={() =>
                      passwordConfirmationInputRef?.current?.focus()
                    }
                    placeholder={t("register.passwordInputPlaceholder")}
                    ref={passwordInputRef}
                    secureTextEntry
                    value={value}
                  />
                </View>
              )}
            />
            <Controller
              name="passwordConfirmation"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View>
                  <Input
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isRegistering}
                    error={errors?.passwordConfirmation?.message}
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit(handleRegister)}
                    placeholder={t(
                      "register.confirmationPasswordInputPlaceholder",
                    )}
                    ref={passwordConfirmationInputRef}
                    secureTextEntry
                    value={value}
                  />
                </View>
              )}
            />
            <Button
              title={t("register.cta")}
              onPress={handleSubmit(handleRegister)}
              disabled={isRegistering}
            />
            <Link href="/(auth)" asChild>
              <Text style={styles.text}>
                {t("register.firstLinkText")}{" "}
                <Text style={{ fontFamily: Fonts.family.bold }}>
                  {t("register.secondLinkText")}
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
