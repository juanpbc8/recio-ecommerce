import type { Metadata } from 'next';
import { getStorefrontCatalogProducts } from '@/actions/catalog';
import { ProductsContent } from '@/components/storefront/products/ProductsContent';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explora nuestra colección completa de piezas esenciales con precisión minimalista.',
};

interface ProductosPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const pageSize = 6;

  const response = await getStorefrontCatalogProducts(undefined, currentPage, pageSize);

  const items = response.success && response.data ? response.data.items : [];
  const meta = response.success && response.data ? response.data.meta : null;
  const error = !response.success ? (response.error ?? null) : null;

  return (
    <ProductsContent
      products={items}
      meta={meta}
      error={error}
      currentPage={currentPage}
    />
  );
}
