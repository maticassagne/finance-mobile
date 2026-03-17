import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, Input, Card } from "../components";
import { createCategory } from "../services/categoryService";
import { useDataRefresh } from "../context/DataRefreshContext";

const CreateCategoryScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [loading, setLoading] = useState(false);
  const { triggerRefresh } = useDataRefresh();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre es requerido");
      return;
    }

    setLoading(true);
    try {
      await createCategory({ name: name.trim(), type });
      triggerRefresh();
      Alert.alert("Éxito", "Categoría creada");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nueva Categoría</Text>
      </View>

      <Card style={styles.form}>
        <Input label="Nombre" placeholder="Ej: Transporte" value={name} onChangeText={setName} />
        <View style={{ height: 12 }} />
        <Button onPress={() => setType(type === "income" ? "expense" : "income")} variant="secondary">
          Tipo: {type === "income" ? "Ingreso" : "Gasto"} (tocar para cambiar)
        </Button>

        <View style={{ height: 12 }} />
        <Button onPress={handleSubmit} disabled={loading} variant="primary">
          {loading ? "Creando..." : "Crear Categoría"}
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  form: { margin: 16 },
});

export default CreateCategoryScreen;
