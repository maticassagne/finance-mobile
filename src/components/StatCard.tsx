import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "green" | "red" | "blue";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorStyles = {
    green: { bg: "#dcfce7", text: "#166534" },
    red: { bg: "#fee2e2", text: "#991b1b" },
    blue: { bg: "#dbeafe", text: "#082f49" },
  };

  const style = colorStyles[color];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: style.bg }]}>
          {icon}
        </View>
      </View>
      <Text style={styles.value}>${value}</Text>
      <Text style={styles.subtitle}>
        {title === "Ingresos" ? "Dinero ingresado" : title === "Gastos" ? "Dinero gastado" : "Balance actual"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#9ca3af",
  },
});

export default StatCard;
