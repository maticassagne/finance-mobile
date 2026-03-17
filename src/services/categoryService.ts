import { getDatabase, generateId } from "../db/database";
import { Category, CreateCategoryDTO } from "../types";

// Crear categoría
export const createCategory = async (data: CreateCategoryDTO): Promise<Category> => {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  try {
    // Validar que no exista una categoría con el mismo nombre y tipo
    const existing = await db.getFirstAsync<Category>(`SELECT * FROM categories WHERE LOWER(name) = LOWER(?) AND type = ?`, [data.name, data.type]);

    if (existing) {
      throw new Error(`Ya existe una categoría llamada "${data.name}" de tipo ${data.type === "income" ? "ingreso" : "gasto"}`);
    }

    await db.runAsync(
      `INSERT INTO categories (id, name, type, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.type, now, now],
    );

    return {
      id,
      name: data.name,
      type: data.type,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error("Error creando categoría:", error);
    throw error;
  }
};

// Obtener todas las categorías
export const getAllCategories = async (): Promise<Category[]> => {
  const db = getDatabase();

  try {
    const result = await db.getAllAsync<Category>(`SELECT * FROM categories ORDER BY type, name`);
    return result;
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    throw error;
  }
};

// Obtener categorías por tipo
export const getCategoriesByType = async (type: "income" | "expense"): Promise<Category[]> => {
  const db = getDatabase();

  try {
    const result = await db.getAllAsync<Category>(`SELECT * FROM categories WHERE type = ? ORDER BY name`, [type]);
    return result;
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    throw error;
  }
};

// Obtener categoría por ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<Category>(`SELECT * FROM categories WHERE id = ?`, [id]);
    return result || null;
  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    throw error;
  }
};

// Actualizar categoría
export const updateCategory = async (id: string, data: Partial<CreateCategoryDTO>): Promise<Category> => {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.type !== undefined) {
      updates.push("type = ?");
      values.push(data.type);
    }

    updates.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(`UPDATE categories SET ${updates.join(", ")} WHERE id = ?`, values);

    const updated = await getCategoryById(id);
    if (!updated) throw new Error("Categoría no encontrada después de actualizar");

    return updated;
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    throw error;
  }
};

// Eliminar categoría (cascada: borra transacciones asociadas)
export const deleteCategory = async (id: string): Promise<number> => {
  const db = getDatabase();

  try {
    // Contar transacciones a eliminar
    const count = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM transactions WHERE category = ?`, [id]);
    const transactionCount = count?.count || 0;

    // Eliminar transacciones primero
    if (transactionCount > 0) {
      await db.runAsync(`DELETE FROM transactions WHERE category = ?`, [id]);
    }

    // Luego eliminar la categoría
    await db.runAsync(`DELETE FROM categories WHERE id = ?`, [id]);

    return transactionCount;
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    throw error;
  }
};
