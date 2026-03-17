import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: any;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

interface CardHeaderProps {
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return <View style={styles.header}>{children}</View>;
};

interface CardTitleProps {
  children: React.ReactNode;
  style?: any;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

interface CardContentProps {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return <View style={styles.content}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  content: {
    paddingTop: 8,
  },
});

export { Card, CardHeader, CardTitle, CardContent };
