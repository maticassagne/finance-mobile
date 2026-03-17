import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Input, Select, Card } from "../components";
import { updateTransaction, getTransactionById } from "../services/transactionService";
import { useCategories } from "../hooks";
import { format } from "date-fns";
import { useDataRefresh } from "../context/DataRefreshContext";

interface EditTransactionForm {
  description: string;
  amount: string;
  type: "income" | "expense";
  category: string;
  date: string;
}

const EditTransactionScreen = ({ navigation, route }: any) => {
  const { transactionId } = route.params || {};
  const { data: categories } = useCategories();
  const { triggerRefresh } = useDataRefresh();
  const [form, setForm] = useState<EditTransactionForm>({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransaction = async () => {
      if (!transactionId) return;
      try {
        const transaction = await getTransactionById(transactionId);
        if (transaction) {
          setForm({
            description: transaction.description,
            amount: transaction.amount.toString(),
            type: transaction.type,
            category: transaction.category,
            date: transaction.date,
          });
        }
      } catch (err) {
        Alert.alert("Error", "No se pudo cargar la transacción");
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [transactionId]);

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
      await updateTransaction(transactionId, {
        description: form.description,
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
      });

      triggerRefresh();
      Alert.alert("Éxito", "Transacción actualizada correctamente");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error actualizando transacción");
    } finally {
      setLoading(false);
    }
  };

  if (loading && transactionId) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar Transacción</Text>
      </View>

      <Card style={styles.form}>
        <Input label="Descripción" placeholder="Ej: Salario, Comida..." value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} />

        <Input label="Monto" placeholder="0.00" keyboardType="numeric" value={form.amount} onChangeText={(text) => setForm({ ...form, amount: text })} />

        <Select
          label="Tipo"
          options={[
            { value: "income", label: "Ingreso" },
            { value: "expense", label: "Gasto" },
          ]}
          value={form.type}
          onValueChange={(type) => setForm({ ...form, type: type as "income" | "expense", category: "" })}
        />

        <Select label="Categoría" options={categoryOptions} value={form.category} onValueChange={(category) => setForm({ ...form, category })} placeholder="Selecciona una categoría" />

        <Input label="Fecha" value={form.date} onChangeText={(text) => setForm({ ...form, date: text })} placeholder="YYYY-MM-DD" />

        <Button onPress={handleSubmit} disabled={loading} variant="primary" style={styles.submitButton}>
          {loading ? "Actualizando..." : "Actualizar Transacción"}
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

export default EditTransactionScreen;
