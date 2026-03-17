import { useEffect, useState } from "react";
import { Transaction, DateRange } from "../types";
import { getAllTransactions, getTransactionsByDateRange } from "../services/transactionService";
import { format } from "date-fns";
import { useDataRefresh } from "../context/DataRefreshContext";

export interface TransactionFilters {
  type?: "income" | "expense";
  category?: string;
}

export const useTransactions = (dateRange: DateRange, filters: TransactionFilters = {}) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refreshVersion } = useDataRefresh();

  const itemsPerPage = 15;

  // Cargar datos iniciales
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      setPage(1);
      try {
        let transactions: Transaction[];

        if (dateRange.from && dateRange.to) {
          const from = format(dateRange.from, "yyyy-MM-dd");
          const to = format(dateRange.to, "yyyy-MM-dd");
          transactions = await getTransactionsByDateRange(from, to);
        } else {
          transactions = await getAllTransactions();
        }

        // Ordenar por fecha descendente
        const sorted = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Aplicar filtros
        let filtered = sorted;
        if (filters.type) {
          filtered = filtered.filter((t) => t.type === filters.type);
        }
        if (filters.category) {
          filtered = filtered.filter((t) => t.category === filters.category);
        }

        setAllTransactions(filtered);
        setData(filtered.slice(0, itemsPerPage));
        setHasMore(filtered.length > itemsPerPage);
      } catch (err: any) {
        setError(err.message || "Error fetching transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange.from, dateRange.to, filters.type, filters.category, refreshTrigger, refreshVersion]);

  // Cargar más transacciones
  const loadMore = async () => {
    if (isLoadingMore || !hasMore || allTransactions.length === 0) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const startIdx = (nextPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const newTransactions = allTransactions.slice(startIdx, endIdx);

      setData((prev) => [...prev, ...newTransactions]);
      setPage(nextPage);
      setHasMore(endIdx < allTransactions.length);
    } catch (err: any) {
      setError(err.message || "Error loading more transactions");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    data,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    refresh: () => setRefreshTrigger((t) => t + 1),
  };
};
