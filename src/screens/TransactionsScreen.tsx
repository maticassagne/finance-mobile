import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Alert } from "react-native";
import { useTransactions } from "../hooks";
import { DateRange } from "../types";
import { Card, Button } from "../components";
import { startOfMonth } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { deleteTransaction } from "../services/transactionService";
import { useDataRefresh } from "../context/DataRefreshContext";

const TransactionsScreen = () => {
  const today = new Date();
  const startOfCurrentMonth = startOfMonth(today);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfCurrentMonth,
    to: today,
  });

  const { data: transactions, isLoading, refresh } = useTransactions(dateRange);
  const navigation = useNavigation();
  const { triggerRefresh } = useDataRefresh();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );

  const handleDeleteTransaction = (transactionId: string, description: string) => {
    Alert.alert("Eliminar transacción", `¿Estás seguro de que deseas eliminar la transacción "${description}"?`, [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteTransaction(transactionId);
            triggerRefresh();
            Alert.alert("Éxito", "Transacción eliminada correctamente");
          } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", "No se pudo eliminar la transacción");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transacciones</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus transacciones</Text>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : transactions && transactions.length > 0 ? (
          <View>
            {transactions.map((transaction) => (
              <Card key={transaction.id} style={styles.card}>
                <View style={styles.transactionRow}>
                  <View style={[styles.iconContainer, transaction.type === "income" ? styles.incomeIcon : styles.expenseIcon]}>
                    <MaterialCommunityIcons name={transaction.type === "income" ? "arrow-bottom-left" : "arrow-top-right"} size={20} color={transaction.type === "income" ? "#16a34a" : "#dc2626"} />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.description}>{transaction.description}</Text>
                    <Text style={styles.category}>{transaction.category}</Text>
                    <Text style={styles.date}>{new Date(transaction.date).toLocaleDateString()}</Text>
                  </View>
                  <Text style={[styles.amount, transaction.type === "income" ? styles.incomeAmount : styles.expenseAmount]}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </Text>
                  <View style={styles.actionButtons}>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => {
                        try {
                          (navigation as any).getParent?.()?.navigate("EditTransaction", { transactionId: transaction.id });
                        } catch (err) {
                          console.error("Error navigating to EditTransaction:", err);
                        }
                      }}
                    >
                      <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={() => handleDeleteTransaction(transaction.id, transaction.description)}>
                      <MaterialCommunityIcons name="trash-can-outline" size={18} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="inbox-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Sin transacciones</Text>
              <Text style={styles.emptySubtext}>Crea tu primera transacción para empezar</Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          try {
            console.log("FAB Transactions pressed, navigation state:", (navigation as any).getState?.());
            (navigation as any).getParent?.()?.navigate("CreateTransaction");
          } catch (err) {
            console.error("Error navigating to CreateTransaction:", err);
          }
        }}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    marginBottom: 12,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButtons: {
    flexDirection: "row",
    marginLeft: 8,
    gap: 4,
  },
  actionButton: {
    padding: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: "#dcfce7",
  },
  expenseIcon: {
    backgroundColor: "#fee2e2",
  },
  transactionDetails: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  category: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  incomeAmount: {
    color: "#16a34a",
  },
  expenseAmount: {
    color: "#dc2626",
  },
  emptyCard: {
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9ca3af",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#d1d5db",
    marginTop: 6,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TransactionsScreen;
