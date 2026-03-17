import { useEffect, useState } from "react";
import { Category } from "../types";
import { getAllCategories } from "../services/categoryService";
import { useDataRefresh } from "../context/DataRefreshContext";

export const useCategories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refreshVersion } = useDataRefresh();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categories = await getAllCategories();
        setData(categories);
      } catch (err: any) {
        setError(err.message || "Error fetching categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [refreshTrigger, refreshVersion]);

  return { data, isLoading, error, refresh: () => setRefreshTrigger((t) => t + 1) };
};
