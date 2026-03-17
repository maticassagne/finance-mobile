import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DashboardScreen, TransactionsScreen, CategoriesScreen } from "../screens";
import CreateTransactionScreen from "../screens/CreateTransactionScreen";
import CreateCategoryScreen from "../screens/CreateCategoryScreen";
import EditTransactionScreen from "../screens/EditTransactionScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = "home";

        if (route.name === "Dashboard") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Transactions") {
          iconName = focused ? "credit-card" : "credit-card-outline";
        } else if (route.name === "Categories") {
          iconName = focused ? "tag-multiple" : "tag-multiple-outline";
        }

        return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#10b981",
      tabBarInactiveTintColor: "#9ca3af",
      tabBarStyle: {
        backgroundColor: "#ffffff",
        borderTopColor: "#e5e7eb",
        paddingBottom: 4,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: "Inicio" }} />
    <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: "Transacciones" }} />
    <Tab.Screen name="Categories" component={CategoriesScreen} options={{ tabBarLabel: "Categorías" }} />
  </Tab.Navigator>
);

const NavigationStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreateTransaction" component={CreateTransactionScreen} options={{ title: "Nueva Transacción" }} />
      <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} options={{ title: "Nueva Categoría" }} />
      <Stack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ title: "Editar Transacción" }} />
    </Stack.Navigator>
  );
};

export default NavigationStack;
