import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/lib/styles";

interface HeaderProps {
  title: string;
  onMenuPress?: () => void;
  showMenu?: boolean;
  rightComponent?: React.ReactNode;
}

export function Header({
  title,
  onMenuPress,
  showMenu = false,
  rightComponent,
}: HeaderProps): JSX.Element {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showMenu && onMenuPress && (
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightComponent && <View>{rightComponent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    marginVertical: 2,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Header;