import React, { ReactNode } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/lib/styles";

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined" | "primary";
  padding?: "none" | "sm" | "md" | "lg";
  style?: object;
}

export function Card({
  children,
  onPress,
  variant = "default",
  padding = "md",
  style,
}: CardProps): JSX.Element {
  const paddingValues = { none: 0, sm: 12, md: 16, lg: 24 };
  const paddingSize = paddingValues[padding];

  const variantStyles = {
    default: { backgroundColor: COLORS.white },
    elevated: { backgroundColor: COLORS.white, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    outlined: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.gray[200] },
    primary: { backgroundColor: COLORS.primary[500] },
  };

  const cardContent = (
    <View style={[styles.card, { padding: paddingSize }, variantStyles[variant], style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
  },
});

export default Card;