# 💻 Ejemplos de Código - React Native Tips

## 1. Crear Nueva Pantalla

### Estructura Básica

```typescript
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Card, Button } from "../components";

interface Props {
  navigation?: any; // Si necesitas navegar
}

const MiPantalla: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Pantalla</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#10b981" size="large" />
      ) : (
        <Card>
          <Text>Contenido aquí</Text>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default MiPantalla;
```

---

## 2. Hacer Request al Backend

### Con Hook Custom

```typescript
// src/hooks/useMiDatos.ts
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface MiDato {
  id: string;
  name: string;
}

export const useMiDatos = () => {
  const [data, setData] = useState<MiDato[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/mi-endpoint");
        setData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
```

### Usar en Pantalla

```typescript
const MiPantalla = () => {
  const { data, isLoading, error } = useMiDatos();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View>
      {data.map((item) => (
        <Card key={item.id}>
          <Text>{item.name}</Text>
        </Card>
      ))}
    </View>
  );
};
```

---

## 3. Formularios con Validación

```typescript
const FormScreen = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name) newErrors.name = "Nombre requerido";
    if (!form.email) newErrors.email = "Email requerido";
    if (!form.amount || isNaN(parseFloat(form.amount))) {
      newErrors.amount = "Monto válido requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await api.post("/mi-endpoint", form);
      Alert.alert("Éxito", "Guardado correctamente");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView>
      <Input
        label="Nombre"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <Input
        label="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <Input
        label="Monto"
        value={form.amount}
        onChangeText={(text) => setForm({ ...form, amount: text })}
        keyboardType="numeric"
      />
      {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

      <Button onPress={handleSubmit}>Enviar</Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  error: { color: "#dc2626", fontSize: 12, marginTop: 4 },
});
```

---

## 4. Modal / Alert

```typescript
import { Alert, Modal, View, Text, Pressable } from "react-native";

const MiPantalla = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que deseas eliminar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete("/item/123");
              Alert.alert("Éxito", "Eliminado correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View>
      <Button onPress={() => setModalVisible(true)}>Abrir Modal</Button>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Mi Modal</Text>
          <Button onPress={() => setModalVisible(false)}>Cerrar</Button>
        </View>
      </Modal>

      <Button onPress={handleDelete} variant="danger">
        Eliminar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, padding: 16, justifyContent: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
});
```

---

## 5. FlatList vs Map

### FlatList (Mejor para listas largas)

```typescript
import { FlatList, ListRenderItem } from "react-native";

const TransactionsList = ({ transactions }: { transactions: Transaction[] }) => {
  const renderItem: ListRenderItem<Transaction> = ({ item }) => (
    <Card key={item.id}>
      <Text>{item.description}</Text>
      <Text>${item.amount}</Text>
    </Card>
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false} // Si está dentro de ScrollView
    />
  );
};
```

### Map (Para listas pequeñas)

```typescript
const TransactionsList = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <View>
      {transactions.map((item) => (
        <Card key={item.id}>
          <Text>{item.description}</Text>
        </Card>
      ))}
    </View>
  );
};
```

---

## 6. Componente Personalizado Reutilizable

```typescript
// src/components/TransactionCard.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Transaction } from "../types";

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
  onDelete,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={styles.category}>{transaction.category}</Text>
        </View>
        <Text
          style={[
            styles.amount,
            transaction.type === "income"
              ? styles.incomeAmount
              : styles.expenseAmount,
          ]}
        >
          {transaction.type === "income" ? "+" : "-"}${transaction.amount}
        </Text>
      </View>
      {onDelete && (
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <MaterialCommunityIcons name="delete" size={20} color="#dc2626" />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info: { flex: 1 },
  description: { fontSize: 16, fontWeight: "600" },
  category: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "bold" },
  incomeAmount: { color: "#16a34a" },
  expenseAmount: { color: "#dc2626" },
  deleteButton: { padding: 8 },
});

export default TransactionCard;
```

---

## 7. Usar Variables de Entorno

### Opción 1: Con app.json (Recomendado)

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.1.100:4000",
      "appName": "Finance Tracker"
    }
  }
}
```

```typescript
import * as Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

### Opción 2: Con .env (Más simple)

```bash
# .env (no guardar en git)
API_URL=http://192.168.1.100:4000
```

```typescript
// Cargar en app.json
{
  "extra": {
    "apiUrl": process.env.API_URL
  }
}
```

---

## 8. Storage Local

### Guardar Datos

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

const saveUserPreferences = async (preferences: any) => {
  try {
    await AsyncStorage.setItem("user_preferences", JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving preferences", error);
  }
};
```

### Recuperar Datos

```typescript
const getUserPreferences = async () => {
  try {
    const data = await AsyncStorage.getItem("user_preferences");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading preferences", error);
  }
};
```

### Guardar Token Seguro

```typescript
import * as SecureStore from "expo-secure-store";

const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("auth_token", token);
  } catch (error) {
    console.error("Error saving token", error);
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync("auth_token");
  } catch (error) {
    console.error("Error reading token", error);
  }
};
```

---

## 9. Manejo de Fechas con date-fns

```typescript
import { format, addDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";

// Formatear fecha
format(new Date(), "dd/MM/yyyy"); // 04/02/2026
format(new Date(), "EEEE", { locale: es }); // martes

// Calcular fechas
const tomorrow = addDays(new Date(), 1);
const lastMonth = subMonths(new Date(), 1);
const firstDay = startOfMonth(new Date());
const lastDay = endOfMonth(new Date());

// En hooks
const [dateRange, setDateRange] = useState({
  from: startOfMonth(new Date()),
  to: new Date(),
});

// Enviar al API
const from = format(dateRange.from, "yyyy-MM-dd");
const to = format(dateRange.to, "yyyy-MM-dd");
```

---

## 10. Navegar Entre Pantallas

### Con React Navigation

```typescript
// NavigationStack.tsx
import { NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Categories: undefined;
  TransactionDetail: { id: string };
};

// En un componente
interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const MiPantalla: React.FC<Props> = ({ navigation }) => {
  return (
    <Button
      onPress={() => navigation.navigate("TransactionDetail", { id: "123" })}
    >
      Ver detalles
    </Button>
  );
};

// Recibir parámetros
const DetailScreen = ({ route }: any) => {
  const { id } = route.params;
  return <Text>ID: {id}</Text>;
};
```

---

## Tips Generales

- ✅ Usa `React.FC<Props>` para mejor tipado
- ✅ Siempre agrega `key` en listas
- ✅ Usa `ActivityIndicator` para loading
- ✅ Centraliza estilos en `StyleSheet.create()`
- ✅ Reutiliza componentes
- ✅ Documenta propiedades con interfaces
- ✅ Usa `console.log()` para debug
- ✅ Manejo de errores en try/catch

---

¡Feliz coding! 🚀
