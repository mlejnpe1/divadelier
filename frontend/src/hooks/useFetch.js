import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../utils/api";

export function useFetch(path, { auth = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reqIdRef = useRef(0);

  useEffect(() => {
    let canceled = false;
    const reqId = ++reqIdRef.current;

    setLoading(true);
    setError(null);

    apiFetch(path, { auth })
      .then((json) => {
        if (canceled) {
          return;
        }
        if (reqId !== reqIdRef.current) {
          return;
        }
        setData(json);
      })
      .catch((err) => {
        if (canceled) {
          return;
        }
        if (reqId !== reqIdRef.current) {
          return;
        }
        setError(err.message);
      })
      .finally(() => {
        if (canceled) {
          return;
        }
        if (reqId !== reqIdRef.current) {
          return;
        }
        setLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [path, auth]);

  return { data, loading, error };
}
