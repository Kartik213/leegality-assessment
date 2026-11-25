import { useEffect, useState } from "react";
import { fetchData } from "../lib/products";

const cache = new Map<string, unknown>();

interface Settled<T> {
  key: string;
  data?: T[];
  error?: Error;
}

export interface FetchState<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isFetching: boolean;
  retry: () => void;
}

export function useFetchMany<T>(
  urls: string[],
  keepPrevious = false,
): FetchState<T[]> {
  const key = urls.join('\n');
  const [result, setResult] = useState<Settled<T> | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const list = key.split("\n");
    if (list.every((url) => cache.has(url))) return;

    const controller = new AbortController();

    Promise.all(
      list.map(async (url) => {
        if (cache.has(url)) return cache.get(url) as T;
        const data = await fetchData<T>(url, controller.signal);
        cache.set(url, data);
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
  const cached = urls.every((url) => cache.has(url))
    ? urls.map((url) => cache.get(url) as T)
    : undefined;
  const isFetching = cached === undefined && current === null;
  const previous = keepPrevious && isFetching ? result?.data : undefined;
  const data = cached ?? current?.data ?? previous;
  const error = data === undefined ? current?.error : undefined;

  return {
    data,
    error,
    isLoading: data === undefined && error === undefined,
    isFetching,
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
