import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Selecciona una opción",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={styles.button}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.buttonText}>
          {selectedLabel || placeholder}
        </Text>
      </Pressable>

      {isOpen && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                option.value === value && styles.optionSelected,
              ]}
              onPress={() => {
                onValueChange?.(option.value);
                setIsOpen(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  option.value === value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
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
  button: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
  },
  buttonText: {
    fontSize: 16,
    color: "#111827",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    zIndex: 1000,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  optionSelected: {
    backgroundColor: "#dbeafe",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  optionTextSelected: {
    color: "#0369a1",
    fontWeight: "600",
  },
});

export default Select;
