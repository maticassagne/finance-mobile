import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSummary, useTransactions, useCategories } from "../hooks";
import { useFocusEffect } from "@react-navigation/native";
import { DateRange } from "../types";
import { StatCard, Card, CardHeader, CardTitle, CardContent } from "../components";
import { addMonths, endOfMonth, format, startOfMonth, parseISO, isValid } from "date-fns";

const DashboardScreen = () => {
  const today = useMemo(() => new Date(), []);
  const startOfCurrentMonth = startOfMonth(today);

  const initialPeriod: "current" | "previous" = today.getDate() === 1 ? "previous" : "current";

  const getDateRangeForPeriod = (period: "current" | "previous"): DateRange => {
    if (period === "previous") {
      const previousMonth = addMonths(today, -1);
      return {
        from: startOfMonth(previousMonth),
        to: endOfMonth(previousMonth),
      };
    }

    return {
      from: startOfMonth(today),
      to: today,
    };
  };

  const onApplyCustomDate = () => {
    const fromDate = parseISO(customFromInput);
    const toDate = parseISO(customToInput);

    if (!isValid(fromDate) || !isValid(toDate)) {
      Alert.alert("Fecha inválida", "Ingresa fechas válidas en formato YYYY-MM-DD.");
      return;
    }

    if (fromDate > toDate) {
      Alert.alert("Rango inválido", "La fecha desde debe ser anterior o igual a la fecha hasta.");
      return;
    }

    setDateRange({ from: fromDate, to: toDate });
    setSelectedPeriod("custom");
  };

  const [selectedPeriod, setSelectedPeriod] = useState<"current" | "previous" | "custom">(initialPeriod);
  const [customFromInput, setCustomFromInput] = useState<string>(format(today, "yyyy-MM-dd"));
  const [customToInput, setCustomToInput] = useState<string>(format(today, "yyyy-MM-dd"));
  const [dateRange, setDateRange] = useState<DateRange>(() => getDateRangeForPeriod(initialPeriod));

  const { data: summary, isLoading: loadingSummary, refresh: refreshSummary } = useSummary(dateRange);
  const { data: transactions, isLoading: loadingTransactions } = useTransactions(dateRange);
  const { data: categories } = useCategories();

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

        <View style={styles.periodSwitcher}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "current" && styles.periodButtonActive]}
            onPress={() => {
              setSelectedPeriod("current");
              setDateRange(getDateRangeForPeriod("current"));
            }}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === "current" && styles.periodButtonTextActive]}>Mes Actual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "previous" && styles.periodButtonActive]}
            onPress={() => {
              setSelectedPeriod("previous");
              setDateRange(getDateRangeForPeriod("previous"));
            }}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === "previous" && styles.periodButtonTextActive]}>Mes Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "custom" && styles.periodButtonActive]}
            onPress={() => {
              setSelectedPeriod("custom");
            }}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === "custom" && styles.periodButtonTextActive]}>Fecha</Text>
          </TouchableOpacity>
        </View>

        {selectedPeriod === "custom" && (
          <View style={styles.customDateRow}>
            <TextInput style={styles.customDateInput} value={customFromInput} placeholder="Desde (YYYY-MM-DD)" onChangeText={setCustomFromInput} keyboardType="numeric" />
            <TextInput style={styles.customDateInput} value={customToInput} placeholder="Hasta (YYYY-MM-DD)" onChangeText={setCustomToInput} keyboardType="numeric" />
            <TouchableOpacity style={styles.applyButton} onPress={onApplyCustomDate}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.dateRangeText}>{dateRange.from && dateRange.to ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}` : "Todos los datos"}</Text>
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
                        <Text style={styles.transactionCategory}>{categories.find((c) => c.id === transaction.category)?.name || transaction.category}</Text>
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
  periodSwitcher: {
    flexDirection: "row",
    marginTop: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    overflow: "hidden",
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  periodButtonActive: {
    backgroundColor: "#10b981",
  },
  periodButtonText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "600",
  },
  periodButtonTextActive: {
    color: "#ffffff",
  },
  dateRangeText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6b7280",
  },
  customDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  customDateInput: {
    flex: 1,
    height: 40,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  applyButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
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
