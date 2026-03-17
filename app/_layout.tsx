import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { NavigationStack } from "../src/navigation";
import { initializeDatabase } from "../src/db/database";
import { seedDatabase } from "../src/db/seed";
import { DataRefreshProvider } from "../src/context/DataRefreshContext";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeDatabase();
        await seedDatabase();
        setIsReady(true);
      } catch (err) {
        console.error("Failed to initialize app:", err);
        setIsReady(true); // Show app anyway
      }
    };

    initApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DataRefreshProvider>
      <NavigationStack />
      <StatusBar style="auto" />
    </DataRefreshProvider>
  );
}
