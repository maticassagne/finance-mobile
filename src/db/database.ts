import * as SQLite from "expo-sqlite";
import { Transaction, Category } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

// Inicializar la base de datos
export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    db = await SQLite.openDatabaseAsync("finance-tracker.db");

    // Crear tablas si no existen
    await db.execAsync(`
      -- Tabla de categorías
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      -- Tabla de transacciones
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY(category) REFERENCES categories(id)
      );

      -- Tabla de estadísticas (para caché)
      CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY,
        totalIncome REAL NOT NULL DEFAULT 0,
        totalExpense REAL NOT NULL DEFAULT 0,
        balance REAL NOT NULL DEFAULT 0,
        lastUpdated TEXT NOT NULL
      );

      -- Índices para mejor performance
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
    `);

    console.log("✅ Base de datos inicializada correctamente");
    return db;
  } catch (error) {
    console.error("❌ Error inicializando BD:", error);
    throw error;
  }
};

// Obtener instancia de BD
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error("Base de datos no inicializada. Llamar primero a initializeDatabase()");
  }
  return db;
};

// Generar ID único
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
