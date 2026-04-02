import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Alert, TextInput } from "react-native";
import { useTransactions, useCategories, TransactionFilters } from "../hooks";
import { DateRange } from "../types";
import { Card, Button } from "../components";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, isValid } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { deleteTransaction } from "../services/transactionService";
import { useDataRefresh } from "../context/DataRefreshContext";

const TransactionsScreen = () => {
  const today = new Date();
  const startOfCurrentMonth = startOfMonth(today);

  const [selectedDateOption, setSelectedDateOption] = useState<"all" | "current" | "previous" | "custom">("all");
  const [customDateFrom, setCustomDateFrom] = useState<string>(format(today, "yyyy-MM-dd"));
  const [customDateTo, setCustomDateTo] = useState<string>(format(today, "yyyy-MM-dd"));
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  const [filters, setFilters] = useState<TransactionFilters>({});
  const { data: categories } = useCategories();

  const getDateRangeForOption = (option: "all" | "current" | "previous" | "custom"): DateRange => {
    if (option === "current") {
      return { from: startOfMonth(today), to: today };
    }
    if (option === "previous") {
      const previous = addMonths(today, -1);
      return { from: startOfMonth(previous), to: endOfMonth(previous) };
    }
    if (option === "custom") {
      const from = parseISO(customDateFrom);
      const to = parseISO(customDateTo);
      return { from: isValid(from) ? from : null, to: isValid(to) ? to : null };
    }
    return { from: null, to: null };
  };

  const applyDateOption = (option: "all" | "current" | "previous" | "custom") => {
    setSelectedDateOption(option);
    setDateRange(getDateRangeForOption(option));
  };

  const applyCustomDateRange = () => {
    const from = parseISO(customDateFrom);
    const to = parseISO(customDateTo);

    if (!isValid(from) || !isValid(to)) {
      Alert.alert("Fecha inválida", "Ingresa fechas válidas en formato YYYY-MM-DD.");
      return;
    }
    if (from > to) {
      Alert.alert("Rango inválido", "La fecha desde debe ser anterior o igual a la fecha hasta.");
      return;
    }

    setSelectedDateOption("custom");
    setDateRange({ from, to });
  };

  const { data: transactions, isLoading, refresh } = useTransactions(dateRange, filters);
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
        {/* Date range selector */}
        <Card style={styles.filtersCard}>
          <Text style={styles.filtersTitle}>Rango de Fecha</Text>
          <View style={styles.filtersRow}>
            <View style={styles.filterButtons}>
              <Pressable style={[styles.filterButton, selectedDateOption === "all" && styles.filterButtonActive]} onPress={() => applyDateOption("all")}>
                <Text style={[styles.filterButtonText, selectedDateOption === "all" && styles.filterButtonTextActive]}>Todos</Text>
              </Pressable>
              <Pressable style={[styles.filterButton, selectedDateOption === "current" && styles.filterButtonActive]} onPress={() => applyDateOption("current")}>
                <Text style={[styles.filterButtonText, selectedDateOption === "current" && styles.filterButtonTextActive]}>Mes Actual</Text>
              </Pressable>
              <Pressable style={[styles.filterButton, selectedDateOption === "previous" && styles.filterButtonActive]} onPress={() => applyDateOption("previous")}>
                <Text style={[styles.filterButtonText, selectedDateOption === "previous" && styles.filterButtonTextActive]}>Mes Anterior</Text>
              </Pressable>
              <Pressable style={[styles.filterButton, selectedDateOption === "custom" && styles.filterButtonActive]} onPress={() => setSelectedDateOption("custom")}>
                <Text style={[styles.filterButtonText, selectedDateOption === "custom" && styles.filterButtonTextActive]}>Rango</Text>
              </Pressable>
            </View>
          </View>
          {selectedDateOption === "custom" && (
            <View style={styles.customDateRow}>
              <TextInput style={styles.customDateInput} value={customDateFrom} placeholder="Desde YYYY-MM-DD" onChangeText={setCustomDateFrom} keyboardType="numeric" />
              <TextInput style={styles.customDateInput} value={customDateTo} placeholder="Hasta YYYY-MM-DD" onChangeText={setCustomDateTo} keyboardType="numeric" />
              <Pressable style={styles.applyButton} onPress={applyCustomDateRange}>
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </Pressable>
            </View>
          )}
          <Text style={styles.dateRangeText}>{dateRange.from && dateRange.to ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}` : "Todos los datos"}</Text>
        </Card>

        {/* Filters */}
        <Card style={styles.filtersCard}>
          <Text style={styles.filtersTitle}>Filtros</Text>
          <View style={styles.filtersRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Tipo</Text>
              <View style={styles.filterButtons}>
                <Pressable style={[styles.filterButton, !filters.type && styles.filterButtonActive]} onPress={() => setFilters({ ...filters, type: undefined })}>
                  <Text style={[styles.filterButtonText, !filters.type && styles.filterButtonTextActive]}>Todos</Text>
                </Pressable>
                <Pressable style={[styles.filterButton, filters.type === "income" && styles.filterButtonActive]} onPress={() => setFilters({ ...filters, type: "income" })}>
                  <Text style={[styles.filterButtonText, filters.type === "income" && styles.filterButtonTextActive]}>Ingresos</Text>
                </Pressable>
                <Pressable style={[styles.filterButton, filters.type === "expense" && styles.filterButtonActive]} onPress={() => setFilters({ ...filters, type: "expense" })}>
                  <Text style={[styles.filterButtonText, filters.type === "expense" && styles.filterButtonTextActive]}>Gastos</Text>
                </Pressable>
                <Pressable style={styles.clearFiltersButton} onPress={() => setFilters({})}>
                  <Text style={styles.clearFiltersText}>Limpiar</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.filtersRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilterScroll}>
                <Pressable style={[styles.categoryFilterButton, !filters.category && styles.filterButtonActive]} onPress={() => setFilters({ ...filters, category: undefined })}>
                  <Text style={[styles.filterButtonText, !filters.category && styles.filterButtonTextActive]}>Todas</Text>
                </Pressable>
                <Pressable style={styles.clearFiltersButton} onPress={() => setFilters({})}>
                  <Text style={styles.clearFiltersText}>Limpiar</Text>
                </Pressable>
                {categories.map((category) => (
                  <Pressable key={category.id} style={[styles.categoryFilterButton, filters.category === category.id && styles.filterButtonActive]} onPress={() => setFilters({ ...filters, category: category.id })}>
                    <Text style={[styles.filterButtonText, filters.category === category.id && styles.filterButtonTextActive]}>{category.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Card>

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
                    <Text style={styles.category}>{categories.find((c) => c.id === transaction.category)?.name || transaction.category}</Text>
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
  filtersCard: {
    marginBottom: 16,
    padding: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  filtersRow: {
    marginBottom: 12,
  },
  filterGroup: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  filterButtonActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#6b7280",
  },
  clearFiltersButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f8fafc",
    marginLeft: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#ffffff",
  },
  categoryFilterScroll: {
    flexDirection: "row",
  },
  categoryFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    marginRight: 8,
  },
  dateRangeText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6b7280",
  },
});

export default TransactionsScreen;
