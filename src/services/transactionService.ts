import { getDatabase, generateId } from "../db/database";
import { Transaction, CreateTransactionDTO } from "../types";
import { format } from "date-fns";

// Crear transacción
export const createTransaction = async (data: CreateTransactionDTO): Promise<Transaction> => {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT INTO transactions 
       (id, description, amount, type, category, date, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.description, data.amount, data.type, data.category, data.date, now, now],
    );

    // Actualizar stats en caché
    await updateStatsCache();

    return {
      id,
      description: data.description,
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: data.date,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error("Error creando transacción:", error);
    throw error;
  }
};

// Obtener todas las transacciones
export const getAllTransactions = async (): Promise<Transaction[]> => {
  const db = getDatabase();

  try {
    const result = await db.getAllAsync<Transaction>(`SELECT * FROM transactions ORDER BY date DESC`);
    return result;
  } catch (error) {
    console.error("Error obteniendo transacciones:", error);
    throw error;
  }
};

// Obtener transacciones por rango de fechas
export const getTransactionsByDateRange = async (from: string, to: string): Promise<Transaction[]> => {
  const db = getDatabase();

  try {
    const result = await db.getAllAsync<Transaction>(
      `SELECT * FROM transactions 
       WHERE date >= ? AND date <= ? 
       ORDER BY date DESC`,
      [from, to],
    );
    return result;
  } catch (error) {
    console.error("Error obteniendo transacciones por fecha:", error);
    throw error;
  }
};

// Obtener transacción por ID
export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<Transaction>(`SELECT * FROM transactions WHERE id = ?`, [id]);
    return result || null;
  } catch (error) {
    console.error("Error obteniendo transacción:", error);
    throw error;
  }
};

// Actualizar transacción
export const updateTransaction = async (id: string, data: Partial<CreateTransactionDTO>): Promise<Transaction> => {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description);
    }
    if (data.amount !== undefined) {
      updates.push("amount = ?");
      values.push(data.amount);
    }
    if (data.type !== undefined) {
      updates.push("type = ?");
      values.push(data.type);
    }
    if (data.category !== undefined) {
      updates.push("category = ?");
      values.push(data.category);
    }
    if (data.date !== undefined) {
      updates.push("date = ?");
      values.push(data.date);
    }

    updates.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(`UPDATE transactions SET ${updates.join(", ")} WHERE id = ?`, values);

    // Actualizar stats en caché
    await updateStatsCache();

    const updated = await getTransactionById(id);
    if (!updated) throw new Error("Transacción no encontrada después de actualizar");

    return updated;
  } catch (error) {
    console.error("Error actualizando transacción:", error);
    throw error;
  }
};

// Eliminar transacción
export const deleteTransaction = async (id: string): Promise<void> => {
  const db = getDatabase();

  try {
    await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);

    // Actualizar stats en caché
    await updateStatsCache();
  } catch (error) {
    console.error("Error eliminando transacción:", error);
    throw error;
  }
};

// Actualizar caché de stats
export const updateStatsCache = async (): Promise<void> => {
  const db = getDatabase();

  try {
    const totalIncome = await db.getFirstAsync<{ total: number }>(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'`);
    const totalExpense = await db.getFirstAsync<{ total: number }>(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'`);

    const income = totalIncome?.total || 0;
    const expense = totalExpense?.total || 0;
    const balance = income - expense;
    const now = new Date().toISOString();

    // Limpiar tabla de stats y insertar nuevo
    await db.runAsync(`DELETE FROM stats`);
    await db.runAsync(
      `INSERT INTO stats (totalIncome, totalExpense, balance, lastUpdated) 
       VALUES (?, ?, ?, ?)`,
      [income, expense, balance, now],
    );
  } catch (error) {
    console.error("Error actualizando stats:", error);
  }
};
