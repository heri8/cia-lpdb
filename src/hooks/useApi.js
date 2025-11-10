// src/hooks/useApi.js
import { useState, useEffect } from "react";
import { useApi as useApiContext } from "../contexts/ApiContext";

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { baseURL } = useApiContext();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!apiFunction) return;

      setLoading(true);
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
          setData([]);
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
  }, [apiFunction, baseURL, ...dependencies]);

  return { data, loading, error, refetch: () => setData(null) };
};
