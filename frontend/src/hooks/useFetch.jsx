import { useEffect } from "react";
import { useState } from "react";
import { apiFetch } from "../utils/api";

export function useFetch(path, { auth = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);

    apiFetch(path, { auth })
      .then((json) => {
        if (!canceled) setData(json);
      })
      .catch((err) => {
        if (!canceled) setError(err.message);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => (canceled = true);
  }, [path, auth]);

  return { data, loading, error };
}
