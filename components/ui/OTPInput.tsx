import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { COLORS } from "@/lib/styles";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  error,
}: OTPInputProps): JSX.Element {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (text: string, index: number) => {
    const digit = text.slice(-1);
    const newValue = value.split("");
    newValue[index] = digit;
    const updatedValue = newValue.join("");
    onChange(updatedValue);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {Array.from({ length }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.otpBox,
              error ? styles.otpBoxError : null,
              focusedIndex === index && styles.otpBoxFocused,
              value[index] && styles.otpBoxFilled,
            ]}
          >
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={value[index] || ""}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpInput}
              selectTextOnFocus
            />
          </View>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxError: {
    borderColor: COLORS.error,
  },
  otpBoxFocused: {
    borderColor: COLORS.primary[500],
  },
  otpBoxFilled: {
    backgroundColor: COLORS.primary[50],
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});

export default OTPInput;