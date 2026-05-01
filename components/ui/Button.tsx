import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "@/lib/styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: object;
  textStyle?: object;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps): JSX.Element {
  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18 },
  };

  const variantStyles = {
    primary: {
      button: { backgroundColor: COLORS.primary[500], opacity: disabled ? 0.5 : 1 },
      text: { color: COLORS.white },
    },
    secondary: {
      button: { backgroundColor: COLORS.primary[100], opacity: disabled ? 0.5 : 1 },
      text: { color: COLORS.primary[700] },
    },
    outline: {
      button: { backgroundColor: "transparent", borderWidth: 2, borderColor: COLORS.primary[500], opacity: disabled ? 0.5 : 1 },
      text: { color: COLORS.primary[600] },
    },
    ghost: {
      button: { backgroundColor: "transparent", opacity: disabled ? 0.5 : 1 },
      text: { color: COLORS.primary[600] },
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        { paddingVertical: currentSize.paddingVertical, paddingHorizontal: currentSize.paddingHorizontal },
        currentVariant.button,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "primary" ? COLORS.white : COLORS.primary[600]} 
          size="small" 
        />
      ) : (
        <Text style={[styles.text, { fontSize: currentSize.fontSize }, currentVariant.text, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
  },
});

export default Button;