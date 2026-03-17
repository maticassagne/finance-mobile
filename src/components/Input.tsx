import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  label?: string;
  style?: any;
  editable?: boolean;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  label,
  style,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, !editable && styles.disabled, style]}
        placeholder={placeholder}
        placeholderTextColor="#d1d5db"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  disabled: {
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
  },
});

export default Input;
