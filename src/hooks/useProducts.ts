import { useEffect, useState } from "react";
import { getProduct, getProducts } from "@/api/products";
import type { Product } from "@/types/product";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useProducts() {
  const [state, setState] = useState<State<Product[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let alive = true;
    getProducts()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch(
        (error) =>
          alive && setState({ data: null, loading: false, error: error as Error })
      );
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

export function useProduct(id: string) {
  const [state, setState] = useState<State<Product>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let alive = true;
    setState({ data: null, loading: true, error: null });
    getProduct(id)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch(
        (error) =>
          alive && setState({ data: null, loading: false, error: error as Error })
      );
    return () => {
      alive = false;
    };
  }, [id]);

  return state;
}
