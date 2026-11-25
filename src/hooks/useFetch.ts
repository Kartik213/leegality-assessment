import { useEffect, useState } from "react";
import { fetchData } from "../lib/products";

interface Settled<T> {
  key: string;
  data?: T[];
  error?: Error;
}

export interface FetchState<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  retry: () => void;
}

export function useFetchMany<T>(urls: string[]): FetchState<T[]> {
  const key = urls.join('/n');
  const [result, setResult] = useState<Settled<T> | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all(
      urls.map(async (url) => {
        const data = await fetchData<T>(url, controller.signal);
        return data;
      }),
    )
      .then((data) => setResult({ key, data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const error =
          err instanceof Error ? err : new Error("Something went wrong");
        setResult({ key, error });
      });

    return () => controller.abort();
  }, [key, attempt]);

  const current = result?.key === key ? result : null;
  const data = current?.data;
  const error = data === undefined ? current?.error : undefined;

  return {
    data,
    error,
    isLoading: data === undefined && error === undefined,
    retry: () => {
      setResult(null);
      setAttempt((value) => value + 1);
    },
  };
}

export function useFetch<T>(url: string): FetchState<T> {
  const state = useFetchMany<T>([url]);
  return { ...state, data: state.data?.[0] };
}
