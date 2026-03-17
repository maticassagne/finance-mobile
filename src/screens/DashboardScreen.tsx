import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSummary, useTransactions } from "../hooks";
import { useFocusEffect } from "@react-navigation/native";
import { DateRange } from "../types";
import { StatCard, Card, CardHeader, CardTitle, CardContent } from "../components";
import { addMonths, startOfMonth } from "date-fns";

const DashboardScreen = () => {
  const today = new Date();
  const startOfCurrentMonth = startOfMonth(today);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfCurrentMonth,
    to: today,
  });

  const { data: summary, isLoading: loadingSummary, refresh: refreshSummary } = useSummary(dateRange);
  const { data: transactions, isLoading: loadingTransactions } = useTransactions(dateRange);

  const isLoading = loadingSummary || loadingTransactions;

  useFocusEffect(
    useCallback(() => {
      refreshSummary();
    }, []),
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Resumen de tus finanzas</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <>
          {/* Summary Cards */}
          {summary && (
            <View style={styles.statsContainer}>
              <StatCard title="Ingresos" value={summary.totalIncome.toFixed(2)} icon={<MaterialIcons name="trending-up" size={24} color="#16a34a" />} color="green" />
              <StatCard title="Gastos" value={summary.totalExpense.toFixed(2)} icon={<MaterialIcons name="trending-down" size={24} color="#dc2626" />} color="red" />
              <StatCard title="Balance" value={summary.balance.toFixed(2)} icon={<MaterialCommunityIcons name="wallet" size={24} color="#0369a1" />} color="blue" />
            </View>
          )}

          {/* Recent Transactions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
            {transactions && transactions.length > 0 ? (
              <View>
                {transactions.slice(0, 5).map((transaction) => (
                  <Card key={transaction.id}>
                    <View style={styles.transactionItem}>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionDescription}>{transaction.description}</Text>
                        <Text style={styles.transactionCategory}>{transaction.category}</Text>
                      </View>
                      <Text style={[styles.transactionAmount, transaction.type === "income" ? styles.incomeText : styles.expenseText]}>
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <Card>
                <CardContent>
                  <Text style={styles.noTransactions}>Sin transacciones para mostrar</Text>
                </CardContent>
              </Card>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingBottom: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  transactionCategory: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  incomeText: {
    color: "#16a34a",
  },
  expenseText: {
    color: "#dc2626",
  },
  noTransactions: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});

export default DashboardScreen;
