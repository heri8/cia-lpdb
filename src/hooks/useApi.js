// src/hooks/useApi.js
import { useState, useEffect } from "react";
import { useApi as useApiContext } from "../contexts/ApiContext";

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  const { baseURL } = useApiContext();
  const refetch = () => setRefetchIndex((prev) => prev + 1);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!apiFunction) return;

      if (data === null || data.length === 0 || refetchIndex > 0) {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await apiFunction();
        if (mounted) {
          const finalData = Array.isArray(result)
            ? result
            : result === null || result === undefined
            ? []
            : result;

          setData(finalData);
        }
      } catch (err) {
        if (mounted) {
          // setData([]);
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [apiFunction, ...dependencies, refetchIndex]);

  return { data, loading, error, refetch };
};
