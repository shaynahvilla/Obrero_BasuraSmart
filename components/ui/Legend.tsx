import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/lib/styles";

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps): JSX.Element {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.colorBox, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function Legend(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Legend</Text>
      <View style={styles.legendRow}>
        <LegendItem color={COLORS.primary[500]} label="Biodegradable" />
        <LegendItem color={COLORS.gray[500]} label="Non Biodegradable" />
        <LegendItem color={COLORS.blue[500]} label="Recyclables" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
  },
});

export default Legend;