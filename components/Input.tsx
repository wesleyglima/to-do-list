import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type Props = TextInputProps & {
  error?: string;
  searchable?: boolean;
  secureTextEntry?: boolean;
};

const Input = forwardRef<TextInput, Props>(
  ({ error, searchable, secureTextEntry, ...rest }, ref) => {
    const [passwordHidden, setPasswordHidden] = useState(secureTextEntry);

    return (
      <>
        <View style={styles.input}>
          {searchable && (
            <FontAwesome name="search" size={24} color={Colors.gray} />
          )}
          <TextInput
            style={styles.field}
            placeholderTextColor="gray"
            secureTextEntry={passwordHidden}
            ref={ref}
            {...rest}
          />
          {secureTextEntry && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPasswordHidden(!passwordHidden)}
            >
              <Ionicons
                name={passwordHidden ? "eye-off-sharp" : "eye-sharp"}
                size={24}
                color={Colors.gray}
              />
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    alignItems: "center",
    backgroundColor: Colors.dark_light,
    borderRadius: 8,
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  field: {
    color: Colors.light,
    flex: 1,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.normal,
  },
  errorMessage: {
    color: Colors.danger,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.sm,
    marginLeft: 8,
  },
});

export default Input;
