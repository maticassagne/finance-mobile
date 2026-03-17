import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Pressable } from "react-native";
import { useCategories } from "../hooks";
import { Button, Input, Select, Card } from "../components";
import { createTransaction } from "../services/transactionService";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDataRefresh } from "../context/DataRefreshContext";

interface CreateTransactionForm {
  description: string;
  amount: string;
  type: "income" | "expense";
  category: string;
  date: string;
}

const CreateTransactionScreen = ({ navigation, route }: any) => {
  const { data: categories } = useCategories();
  const { triggerRefresh } = useDataRefresh();
  const [form, setForm] = useState<CreateTransactionForm>({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [loading, setLoading] = useState(false);

  const categoryOptions = categories
    .filter((c) => c.type === form.type)
    .map((c) => ({
      value: c.id,
      label: c.name,
    }));

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.category) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await createTransaction({
        description: form.description,
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
      });

      // Trigger global refresh so Dashboard and other screens update
      triggerRefresh();

      Alert.alert("Éxito", "Transacción creada correctamente");
      navigation.goBack();

      // Reset form
      setForm({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error creando transacción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nueva Transacción</Text>
      </View>

      <Card style={styles.form}>
        {/* Descripción */}
        <Input label="Descripción" placeholder="Ej: Salario, Comida..." value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} />

        {/* Monto */}
        <Input label="Monto" placeholder="0.00" keyboardType="numeric" value={form.amount} onChangeText={(text) => setForm({ ...form, amount: text })} />

        {/* Tipo */}
        <Select
          label="Tipo"
          options={[
            { value: "income", label: "Ingreso" },
            { value: "expense", label: "Gasto" },
          ]}
          value={form.type}
          onValueChange={(type) => setForm({ ...form, type: type as "income" | "expense", category: "" })}
        />

        {/* Categoría */}
        <Select label="Categoría" options={categoryOptions} value={form.category} onValueChange={(category) => setForm({ ...form, category })} placeholder="Selecciona una categoría" />

        {/* Fecha */}
        <Input label="Fecha" value={form.date} onChangeText={(text) => setForm({ ...form, date: text })} placeholder="YYYY-MM-DD" />

        {/* Botón Crear */}
        <Button onPress={handleSubmit} disabled={loading} variant="primary" style={styles.submitButton}>
          {loading ? "Creando..." : "Crear Transacción"}
        </Button>
      </Card>
    </ScrollView>
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
  form: {
    margin: 16,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default CreateTransactionScreen;
