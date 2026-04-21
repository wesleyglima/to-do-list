import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: "outline";
  disabled?: boolean;
};

export default function Button({
  title,
  variant,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor:
            variant === "outline" ? "transparent" : Colors.primary,
        },
      ]}
      activeOpacity={0.7}
      {...rest}
    >
      {disabled ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : Colors.light}
        />
      ) : (
        <Text
          style={[
            styles.title,
            {
              color: variant === "outline" ? Colors.primary : Colors.light,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: Colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  title: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.normal,
    textAlign: "center",
  },
});
