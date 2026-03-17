import { useEffect, useState } from "react";
import { Summary, DateRange } from "../types";
import { getSummary } from "../services/statsService";
import { format } from "date-fns";
import { useDataRefresh } from "../context/DataRefreshContext";

export const useSummary = (dateRange: DateRange) => {
  const [data, setData] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refreshVersion } = useDataRefresh();

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
        const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;
        const summary = await getSummary(from, to);
        setData(summary);
      } catch (err: any) {
        setError(err.message || "Error fetching summary");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [dateRange.from, dateRange.to, refreshTrigger, refreshVersion]);

  return { data, isLoading, error, refresh: () => setRefreshTrigger((t) => t + 1) };
};
