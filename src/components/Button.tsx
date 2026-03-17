import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = "primary",
  disabled = false,
  style,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#10b981",
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    backgroundColor: "#e5e7eb",
  },
  secondaryText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  danger: {
    backgroundColor: "#ef4444",
  },
  dangerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#9ca3af",
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: "600",
  },
});

export default Button;
