import { getDatabase } from "../db/database";
import { Summary, CategoryStat } from "../types";
import { format, parse } from "date-fns";

// Obtener resumen financiero
export const getSummary = async (from?: string, to?: string): Promise<Summary> => {
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense
      FROM transactions
    `;
    const params: any[] = [];

    if (from && to) {
      query += ` WHERE date >= ? AND date <= ?`;
      params.push(from, to);
    }

    const result = await db.getFirstAsync<{
      totalIncome: number;
      totalExpense: number;
    }>(query, params);

    const totalIncome = result?.totalIncome || 0;
    const totalExpense = result?.totalExpense || 0;
    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
    };
  } catch (error) {
    console.error("Error obteniendo resumen:", error);
    throw error;
  }
};

// Obtener estadísticas por categoría
export const getStatsByCategory = async (from?: string, to?: string): Promise<CategoryStat[]> => {
  const db = getDatabase();

  try {
    let query = `
      SELECT 
        category,
        type,
        COALESCE(SUM(amount), 0) as total
      FROM transactions
    `;
    const params: any[] = [];

    if (from && to) {
      query += ` WHERE date >= ? AND date <= ?`;
      params.push(from, to);
    }

    query += ` GROUP BY category, type ORDER BY type, total DESC`;

    const result = await db.getAllAsync<CategoryStat>(query, params);

    return result;
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    throw error;
  }
};

// Obtener transacciones por mes (para gráficos)
export const getMonthlyStats = async (year: number, month: number) => {
  const db = getDatabase();
  const monthStr = String(month).padStart(2, "0");
  const yearStr = String(year);

  try {
    const query = `
      SELECT 
        DATE(date) as date,
        type,
        COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE strftime('%Y-%m', date) = ?
      GROUP BY DATE(date), type
      ORDER BY date
    `;

    const result = await db.getAllAsync<{
      date: string;
      type: "income" | "expense";
      total: number;
    }>(query, [`${yearStr}-${monthStr}`]);

    return result;
  } catch (error) {
    console.error("Error obteniendo stats mensuales:", error);
    throw error;
  }
};

// Obtener total de transacciones
export const getTotalTransactions = async (): Promise<number> => {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM transactions`);
    return result?.count || 0;
  } catch (error) {
    console.error("Error obteniendo total:", error);
    throw error;
  }
};

// Obtener promedio de transacciones
export const getAverageTransaction = async (type?: "income" | "expense"): Promise<number> => {
  const db = getDatabase();

  try {
    let query = `SELECT AVG(amount) as average FROM transactions`;
    const params: any[] = [];

    if (type) {
      query += ` WHERE type = ?`;
      params.push(type);
    }

    const result = await db.getFirstAsync<{ average: number }>(query, params);
    return result?.average || 0;
  } catch (error) {
    console.error("Error obteniendo promedio:", error);
    throw error;
  }
};
