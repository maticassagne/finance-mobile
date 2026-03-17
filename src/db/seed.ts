import { getDatabase, generateId } from "../db/database";
import { subDays, format } from "date-fns";

// Flag para controlar si se cargan datos de prueba
// CAMBIAR A FALSE PARA APK LIMPIO SIN DATOS INICIALES
const LOAD_SAMPLE_DATA = false;

// Seed data para desarrollo y testing
export const seedDatabase = async (): Promise<void> => {
  const db = getDatabase();

  try {
    // Verificar si ya hay datos
    const existingTransactions = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM transactions`);

    if (existingTransactions && existingTransactions.count > 0) {
      console.log("✅ BD ya tiene datos, saltando seed");
      return;
    }

    // Si LOAD_SAMPLE_DATA es false, solo crear categorías vacías y retornar
    if (!LOAD_SAMPLE_DATA) {
      await seedEmptyDatabase();
      return;
    }

    console.log("🌱 Sembrando datos iniciales...");

    // Crear categorías de ingresos
    const incomeCategories = [
      { id: generateId(), name: "Salario", type: "income" },
      { id: generateId(), name: "Freelance", type: "income" },
      { id: generateId(), name: "Bonificación", type: "income" },
      { id: generateId(), name: "Inversiones", type: "income" },
    ];

    // Crear categorías de gastos
    const expenseCategories = [
      { id: generateId(), name: "Alimentación", type: "expense" },
      { id: generateId(), name: "Transporte", type: "expense" },
      { id: generateId(), name: "Entretenimiento", type: "expense" },
      { id: generateId(), name: "Servicios", type: "expense" },
      { id: generateId(), name: "Salud", type: "expense" },
      { id: generateId(), name: "Educación", type: "expense" },
    ];

    const allCategories = [...incomeCategories, ...expenseCategories];
    const now = new Date().toISOString();

    // Insertar categorías
    for (const category of allCategories) {
      await db.runAsync(
        `INSERT INTO categories (id, name, type, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?)`,
        [category.id, category.name, category.type, now, now],
      );
    }

    // Crear transacciones de prueba
    const transactions = [
      {
        description: "Salario Mensual",
        amount: 3000,
        type: "income",
        categoryId: incomeCategories[0].id,
        daysAgo: 0,
      },
      {
        description: "Freelance - Proyecto Web",
        amount: 500,
        type: "income",
        categoryId: incomeCategories[1].id,
        daysAgo: 3,
      },
      {
        description: "Supermercado",
        amount: 150,
        type: "expense",
        categoryId: expenseCategories[0].id,
        daysAgo: 1,
      },
      {
        description: "Gasolina",
        amount: 60,
        type: "expense",
        categoryId: expenseCategories[1].id,
        daysAgo: 2,
      },
      {
        description: "Netflix",
        amount: 15,
        type: "expense",
        categoryId: expenseCategories[2].id,
        daysAgo: 5,
      },
      {
        description: "Compras Varios",
        amount: 200,
        type: "expense",
        categoryId: expenseCategories[0].id,
        daysAgo: 4,
      },
      {
        description: "Gimnasio",
        amount: 50,
        type: "expense",
        categoryId: expenseCategories[4].id,
        daysAgo: 6,
      },
      {
        description: "Cursos Online",
        amount: 100,
        type: "expense",
        categoryId: expenseCategories[5].id,
        daysAgo: 7,
      },
      {
        description: "Bonus Febrero",
        amount: 500,
        type: "income",
        categoryId: incomeCategories[2].id,
        daysAgo: 8,
      },
      {
        description: "Cena en Restaurante",
        amount: 80,
        type: "expense",
        categoryId: expenseCategories[0].id,
        daysAgo: 2,
      },
    ];

    // Insertar transacciones
    for (const transaction of transactions) {
      const transactionId = generateId();
      const date = format(subDays(new Date(), transaction.daysAgo), "yyyy-MM-dd");

      await db.runAsync(
        `INSERT INTO transactions 
         (id, description, amount, type, category, date, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [transactionId, transaction.description, transaction.amount, transaction.type, transaction.categoryId, date, now, now],
      );
    }

    // Actualizar stats
    const totalIncome = await db.getFirstAsync<{ total: number }>(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'`);
    const totalExpense = await db.getFirstAsync<{ total: number }>(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'`);

    const income = totalIncome?.total || 0;
    const expense = totalExpense?.total || 0;
    const balance = income - expense;

    await db.runAsync(
      `INSERT INTO stats (totalIncome, totalExpense, balance, lastUpdated) 
       VALUES (?, ?, ?, ?)`,
      [income, expense, balance, now],
    );

    console.log("✅ Datos iniciales sembrados correctamente");
    console.log(`   - ${allCategories.length} categorías creadas`);
    console.log(`   - ${transactions.length} transacciones de prueba`);
  } catch (error) {
    console.error("❌ Error sembrando datos:", error);
    throw error;
  }
};

// Seed limpio - solo crea categorías sin transacciones
const seedEmptyDatabase = async (): Promise<void> => {
  const db = getDatabase();

  try {
    console.log("🌱 Creando BD limpia con categorías...");

    // Crear categorías de ingresos
    const incomeCategories = [
      { id: generateId(), name: "Salario", type: "income" },
      { id: generateId(), name: "Freelance", type: "income" },
      { id: generateId(), name: "Bonificación", type: "income" },
      { id: generateId(), name: "Inversiones", type: "income" },
    ];

    // Crear categorías de gastos
    const expenseCategories = [
      { id: generateId(), name: "Alimentación", type: "expense" },
      { id: generateId(), name: "Transporte", type: "expense" },
      { id: generateId(), name: "Entretenimiento", type: "expense" },
      { id: generateId(), name: "Servicios", type: "expense" },
      { id: generateId(), name: "Salud", type: "expense" },
      { id: generateId(), name: "Educación", type: "expense" },
    ];

    const allCategories = [...incomeCategories, ...expenseCategories];
    const now = new Date().toISOString();

    // Insertar categorías
    for (const category of allCategories) {
      await db.runAsync(
        `INSERT INTO categories (id, name, type, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?)`,
        [category.id, category.name, category.type, now, now],
      );
    }

    // Crear stats vacío
    await db.runAsync(
      `INSERT INTO stats (totalIncome, totalExpense, balance, lastUpdated) 
       VALUES (?, ?, ?, ?)`,
      [0, 0, 0, now],
    );

    console.log("✅ BD limpia creada correctamente");
    console.log(`   - ${allCategories.length} categorías creadas`);
    console.log("   - 0 transacciones (APK limpio para uso en producción)");
  } catch (error) {
    console.error("❌ Error creando BD limpia:", error);
    throw error;
  }
};
