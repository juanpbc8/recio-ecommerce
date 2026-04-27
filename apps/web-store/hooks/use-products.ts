'use client';

import { useEffect, useState } from 'react';

import { MOCK_PRODUCTS, type ProductWithRelations } from '@/mocks/products';

type AsyncState<T> = {
  data: T;
  isLoading: boolean;
  error: Error | null;
};

type ServiceOptions = {
  minDelayMs?: number;
  maxDelayMs?: number;
};

type ProductsService = {
  getProducts: () => Promise<ProductWithRelations[]>;
};

type ProductsState = {
  data: ProductWithRelations[];
  error: Error | null;
  resolvedKey: string | null;
};

type ProductState = {
  data: ProductWithRelations | undefined;
  error: Error | null;
  resolvedKey: string | null;
};

const DEFAULT_OPTIONS: Required<ServiceOptions> = {
  minDelayMs: 500,
  maxDelayMs: 800,
};

function getLatency(minDelayMs: number, maxDelayMs: number): number {
  return Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;
}

function withSimulatedLatency<T>(producer: () => T, options?: ServiceOptions): Promise<T> {
  const { minDelayMs, maxDelayMs } = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(producer());
      },
      getLatency(minDelayMs, maxDelayMs),
    );
  });
}

// Service function ready to be replaced with a real fetch() in next milestone.
export function fetchProducts(options?: ServiceOptions): Promise<ProductWithRelations[]> {
  return withSimulatedLatency(() => MOCK_PRODUCTS, options);
}

// Service function ready to be replaced with a real fetch() in next milestone.
export function fetchProductBySlug(
  slug: string,
  options?: ServiceOptions,
): Promise<ProductWithRelations | undefined> {
  return withSimulatedLatency(
    () => MOCK_PRODUCTS.find((product) => product.slug === slug),
    options,
  );
}

export function useProducts(options?: ServiceOptions): ProductsService {
  const minDelayMs = options?.minDelayMs ?? DEFAULT_OPTIONS.minDelayMs;
  const maxDelayMs = options?.maxDelayMs ?? DEFAULT_OPTIONS.maxDelayMs;

  return {
    getProducts: () => fetchProducts({ minDelayMs, maxDelayMs }),
  };
}

export function useProduct(
  slug: string,
  options?: ServiceOptions,
): AsyncState<ProductWithRelations | undefined> {
  const [state, setState] = useState<ProductState>({
    data: undefined,
    error: null,
    resolvedKey: null,
  });

  const minDelayMs = options?.minDelayMs ?? DEFAULT_OPTIONS.minDelayMs;
  const maxDelayMs = options?.maxDelayMs ?? DEFAULT_OPTIONS.maxDelayMs;
  const requestKey = slug ? `${slug}:${minDelayMs}:${maxDelayMs}` : null;

  useEffect(() => {
    let isMounted = true;

    if (!requestKey) {
      return () => {
        isMounted = false;
      };
    }

    fetchProductBySlug(slug, { minDelayMs, maxDelayMs })
      .then((product) => {
        if (!isMounted) return;
        setState({ data: product, error: null, resolvedKey: requestKey });
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setState((previousState) => ({
          data: previousState.data,
          error: err instanceof Error ? err : new Error('No se pudo cargar el producto.'),
          resolvedKey: requestKey,
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [maxDelayMs, minDelayMs, requestKey, slug]);

  if (!slug) {
    return { data: undefined, isLoading: false, error: null };
  }

  const isLoading = state.resolvedKey !== requestKey;
  const error = isLoading ? null : state.error;
  const data = state.resolvedKey === requestKey ? state.data : undefined;

  return { data, isLoading, error };
}

/*
Ejemplo de uso con estado local:

const { data: products, isLoading, error } = useProducts();
const { data: product } = useProduct(slug);

Si luego migran a SWR o React Query, pueden reutilizar fetchProducts/fetchProductBySlug como queryFn.
*/
