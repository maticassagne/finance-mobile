import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, TextInput, Alert } from "react-native";
import { useCategoryStats, useCategories } from "../hooks";
import { DateRange } from "../types";
import { Card } from "../components";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { addMonths, endOfMonth, startOfMonth, format, parseISO, isValid } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const ChartsScreen = () => {
  const today = useMemo(() => new Date(), []);
  const [selectedPeriod, setSelectedPeriod] = useState<"current" | "previous" | "all" | "custom">("current");
  const [customFrom, setCustomFrom] = useState<string>(format(today, "yyyy-MM-dd"));
  const [customTo, setCustomTo] = useState<string>(format(today, "yyyy-MM-dd"));

  const getDateRange = (period: "current" | "previous" | "all" | "custom"): DateRange => {
    if (period === "current") {
      return { from: startOfMonth(today), to: today };
    }
    if (period === "previous") {
      const previous = addMonths(today, -1);
      return { from: startOfMonth(previous), to: endOfMonth(previous) };
    }
    if (period === "custom") {
      const from = parseISO(customFrom);
      const to = parseISO(customTo);
      if (!isValid(from) || !isValid(to) || from > to) {
        return { from: null, to: null };
      }
      return { from, to };
    }
    return { from: null, to: null };
  };

  const dateRange = getDateRange(selectedPeriod);
  console.log("ChartsScreen: dateRange", dateRange);
  const { data: categoryStats, isLoading } = useCategoryStats(dateRange);
  const { data: categories } = useCategories();
  console.log("ChartsScreen: categoryStats", categoryStats, "isLoading", isLoading, "categories", categories);

  const chartData = categoryStats
    .filter((stat) => stat.total > 0)
    .map((stat, index) => {
      const categoryName = categories.find((c) => c.id === stat.category)?.name || stat.category;
      return {
        name: categoryName,
        population: stat.total,
        total: stat.total,
        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      };
    });

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gráficos</Text>
        <Text style={styles.headerSubtitle}>Visualiza tus gastos por categoría</Text>
      </View>

      <Card style={styles.periodCard}>
        <Text style={styles.periodTitle}>Periodo</Text>
        <View style={styles.periodButtons}>
          <Pressable style={[styles.periodButton, selectedPeriod === "current" && styles.periodButtonActive]} onPress={() => setSelectedPeriod("current")}>
            <Text style={[styles.periodButtonText, selectedPeriod === "current" && styles.periodButtonTextActive]}>Mes Actual</Text>
          </Pressable>
          <Pressable style={[styles.periodButton, selectedPeriod === "previous" && styles.periodButtonActive]} onPress={() => setSelectedPeriod("previous")}>
            <Text style={[styles.periodButtonText, selectedPeriod === "previous" && styles.periodButtonTextActive]}>Mes Anterior</Text>
          </Pressable>
          <Pressable style={[styles.periodButton, selectedPeriod === "all" && styles.periodButtonActive]} onPress={() => setSelectedPeriod("all")}>
            <Text style={[styles.periodButtonText, selectedPeriod === "all" && styles.periodButtonTextActive]}>Todo</Text>
          </Pressable>
          <Pressable style={[styles.periodButton, selectedPeriod === "custom" && styles.periodButtonActive]} onPress={() => setSelectedPeriod("custom")}>
            <Text style={[styles.periodButtonText, selectedPeriod === "custom" && styles.periodButtonTextActive]}>Rango</Text>
          </Pressable>
        </View>
        {selectedPeriod === "custom" && (
          <View style={styles.customDateRow}>
            <TextInput style={styles.customDateInput} value={customFrom} placeholder="Desde YYYY-MM-DD" onChangeText={setCustomFrom} keyboardType="numeric" />
            <TextInput style={styles.customDateInput} value={customTo} placeholder="Hasta YYYY-MM-DD" onChangeText={setCustomTo} keyboardType="numeric" />
            <Pressable
              style={styles.applyButton}
              onPress={() => {
                const from = parseISO(customFrom);
                const to = parseISO(customTo);
                if (!isValid(from) || !isValid(to)) {
                  Alert.alert("Fecha inválida", "Ingresa fechas válidas en formato YYYY-MM-DD");
                  return;
                }
                if (from > to) {
                  Alert.alert("Rango inválido", "La fecha desde debe ser anterior o igual a la fecha hasta");
                  return;
                }
                setSelectedPeriod("custom");
              }}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </Pressable>
          </View>
        )}
        <Text style={styles.dateRangeText}>{dateRange.from && dateRange.to ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}` : "Todos los datos"}</Text>
      </Card>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : chartData.length > 0 ? (
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Distribución por Categoría</Text>
          {(() => {
            try {
              const total = chartData.reduce((sum, current) => sum + current.population, 0);
              return (
                <>
                  <PieChart data={chartData} width={screenWidth - 40} height={220} chartConfig={chartConfig} accessor={"population"} backgroundColor={"transparent"} paddingLeft={"15"} center={[10, 10]} absolute />
                  <View style={styles.legendContainer}>
                    {chartData.map((item, index) => {
                      const percent = total > 0 ? (item.population / total) * 100 : 0;
                      return (
                        <View key={`${item.name}-${index}`} style={styles.legendItem}>
                          <View style={[styles.legendBullet, { backgroundColor: item.color }]} />
                          <Text style={styles.legendText}>{item.name}</Text>
                          <Text style={styles.legendValue}>
                            {item.population.toFixed(2)} ({percent.toFixed(1)}%)
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </>
              );
            } catch (error) {
              console.error("Error rendering PieChart:", error);
              return <Text>Error al renderizar gráfico</Text>;
            }
          })()}
        </Card>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No hay datos para mostrar</Text>
        </Card>
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
  periodCard: {
    margin: 16,
    padding: 16,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  periodButtonActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  periodButtonText: {
    fontSize: 14,
    color: "#6b7280",
  },
  periodButtonTextActive: {
    color: "#ffffff",
  },
  dateRangeText: {
    fontSize: 13,
    color: "#6b7280",
  },
  customDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  customDateInput: {
    flex: 1,
    height: 40,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  chartCard: {
    margin: 16,
    padding: 16,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  legendContainer: {
    width: "100%",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  legendBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginRight: 8,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  emptyCard: {
    margin: 16,
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
  },
});

export default ChartsScreen;
