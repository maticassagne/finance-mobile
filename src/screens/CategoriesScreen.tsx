import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Alert } from "react-native";
import { useCategories } from "../hooks";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { deleteCategory } from "../services/categoryService";
import { useDataRefresh } from "../context/DataRefreshContext";
import { Card, Button } from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CategoriesScreen = () => {
  const { data: categories, isLoading, refresh } = useCategories();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const navigation = useNavigation();
  const { triggerRefresh } = useDataRefresh();
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );

  const groupedCategories = {
    income: categories.filter((c) => c.type === "income"),
    expense: categories.filter((c) => c.type === "expense"),
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    Alert.alert("Eliminar categoría", `¿Está seguro de que desea eliminar "${categoryName}"? Todas las transacciones de esta categoría también serán eliminadas.`, [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            const deletedTransactionCount = await deleteCategory(categoryId);
            triggerRefresh();
            Alert.alert("Éxito", `Categoría eliminada. Se eliminaron ${deletedTransactionCount} transacción(es).`);
          } catch (error: any) {
            Alert.alert("Error", error.message || "Error al eliminar categoría");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categorías</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus categorías</Text>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : (
          <>
            {/* Income Categories */}
            {groupedCategories.income.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingresos</Text>
                {groupedCategories.income.map((category) => (
                  <Card key={category.id} style={styles.categoryCard}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryInfo}>
                        <View style={styles.iconBg}>
                          <MaterialCommunityIcons name="plus-circle" size={24} color="#16a34a" />
                        </View>
                        <Text style={styles.categoryName}>{category.name}</Text>
                      </View>
                      <Pressable onPress={() => handleDelete(category.id, category.name)}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color="#dc2626" />
                      </Pressable>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {/* Expense Categories */}
            {groupedCategories.expense.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gastos</Text>
                {groupedCategories.expense.map((category) => (
                  <Card key={category.id} style={styles.categoryCard}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryInfo}>
                        <View style={styles.iconBg}>
                          <MaterialCommunityIcons name="minus-circle" size={24} color="#dc2626" />
                        </View>
                        <Text style={styles.categoryName}>{category.name}</Text>
                      </View>
                      <Pressable onPress={() => handleDelete(category.id, category.name)}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color="#dc2626" />
                      </Pressable>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {categories.length === 0 && (
              <Card style={styles.emptyCard}>
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="folder-outline" size={48} color="#d1d5db" />
                  <Text style={styles.emptyText}>Sin categorías</Text>
                  <Text style={styles.emptySubtext}>Crea tu primera categoría para empezar</Text>
                </View>
              </Card>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          try {
            console.log("FAB Categories pressed, navigation state:", (navigation as any).getState?.());
            (navigation as any).getParent?.()?.navigate("CreateCategory");
          } catch (err) {
            console.error("Error navigating to CreateCategory:", err);
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    paddingLeft: 4,
  },
  categoryCard: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBg: {
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
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

export default CategoriesScreen;
