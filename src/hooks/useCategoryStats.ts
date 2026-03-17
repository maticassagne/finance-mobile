import { useEffect, useState } from "react";
import { CategoryStat, DateRange } from "../types";
import { getStatsByCategory } from "../services/statsService";
import { format } from "date-fns";
import { useDataRefresh } from "../context/DataRefreshContext";

export const useCategoryStats = (dateRange: DateRange) => {
  const [data, setData] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refreshVersion } = useDataRefresh();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
        const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;
        const stats = await getStatsByCategory(from, to);
        setData(stats);
      } catch (err: any) {
        setError(err.message || "Error fetching category stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [dateRange.from, dateRange.to, refreshTrigger, refreshVersion]);

  return { data, isLoading, error, refresh: () => setRefreshTrigger((t) => t + 1) };
};
