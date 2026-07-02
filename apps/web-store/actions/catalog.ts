'use server';

import { MOCK_PRODUCTS } from '@/mocks/products';
import {
  ApiResponse,
  ProductCardDto,
  ProductDetailDto,
  CategoryDto,
  PaginatedResponse,
  PaginationMeta,
} from '@/types';

/**
 * Diccionario estático para mapear los categoryId del esquema a nombres y slugs semánticos.
 * Resuelve la desalineación relacional temporal sin alterar el archivo de mocks global.
 */
const CATEGORY_MAP: Record<number, { name: string; slug: string }> = {
  1: { name: 'Camisetas', slug: 'camisetas' },
  2: { name: 'Camisas', slug: 'camisas' },
  3: { name: 'Blazers', slug: 'blazers' },
  4: { name: 'Pantalones', slug: 'pantalones' },
  5: { name: 'Casacas y Abrigos', slug: 'casacas-y-abrigos' },
  6: { name: 'Jerseys', slug: 'jerseys' },
};

/**
 * Helper utilitario local para empaquetar los resultados bajo el DTO de paginación común.
 */
function paginateStorefrontArray<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  const currentPage = Math.max(1, page);
  const currentPageSize = Math.max(1, pageSize);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / currentPageSize) || 1;

  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const slicedItems = items.slice(startIndex, endIndex);

  const meta: PaginationMeta = {
    totalItems,
    currentPage,
    pageSize: currentPageSize,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };

  return {
    items: slicedItems,
    meta,
  };
}

/**
 * Obtiene los productos activos del catálogo en una estructura paginada estándar (Grillas).
 * Permite filtrado por slug de categoría.
 */
export async function getStorefrontCatalogProducts(
  categorySlug?: string,
  page: number = 1,
  pageSize: number = 6, // Por defecto 6 ítems para grillas de 2 o 3 columnas nativas
): Promise<ApiResponse<PaginatedResponse<ProductCardDto>>> {
  try {
    // Filtrar únicamente productos visibles en el catálogo
    let filteredProducts = MOCK_PRODUCTS.filter((product) => product.isVisible);

    // Filtrar por categoría si se requiere
    if (categorySlug) {
      filteredProducts = filteredProducts.filter((product) => {
        const categoryInfo = CATEGORY_MAP[product.categoryId];
        return categoryInfo && categoryInfo.slug === categorySlug;
      });
    }

    // Adaptar los productos crudos/relacionales de la BD al contrato ProductCardDto
    const adaptedProducts: ProductCardDto[] = filteredProducts.map((product) => {
      const mainImage = product.images?.find((img) => img.url);
      const fallbackImage = product.images?.[0];
      const categoryInfo = CATEGORY_MAP[product.categoryId] ?? { name: 'Ropa', slug: 'ropa' };

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        imageUrl: mainImage?.url ?? fallbackImage?.url ?? null,
        isNew: !!product.isNew,
        isOnSale: !!product.isOnSale,
        categoryName: categoryInfo.name,
      };
    });

    // Aplicar la lógica de paginación en memoria sobre el catálogo adaptado
    const paginatedData = paginateStorefrontArray(adaptedProducts, page, pageSize);

    return { success: true, data: paginatedData };
  } catch (error) {
    return {
      success: false,
      error: 'Ocurrió un error al cargar el catálogo de productos.',
    };
  }
}

/**
 * Obtiene el detalle completo de un producto específico mediante su slug único (PDP).
 */
export async function getStorefrontProductDetailBySlug(
  slug: string,
): Promise<ApiResponse<ProductDetailDto | null>> {
  try {
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug && p.isVisible);

    if (!product) {
      return { success: true, data: null };
    }

    const mainImage = product.images?.find((img) => img.url);
    const fallbackImage = product.images?.[0];
    const categoryInfo = CATEGORY_MAP[product.categoryId] ?? { name: 'Ropa', slug: 'ropa' };

    // Estructurar el DTO completo de detalle alineado al contrato ProductDetailDto
    const data: ProductDetailDto = {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      slug: product.slug,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      imageUrl: mainImage?.url ?? fallbackImage?.url ?? null,
      isNew: !!product.isNew,
      isOnSale: !!product.isOnSale,
      category: {
        id: product.categoryId,
        name: categoryInfo.name,
        slug: categoryInfo.slug,
      },
      variants: product.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        stock: v.stock,
        color: v.color,
        size: v.size,
      })),
    };

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: 'Ocurrió un error al obtener el detalle del producto.',
    };
  }
}

/**
 * Recupera el listado único de categorías configuradas para alimentar filtros y menús.
 */
export async function getStorefrontCategories(): Promise<ApiResponse<CategoryDto[]>> {
  try {
    const data: CategoryDto[] = Object.entries(CATEGORY_MAP).map(([id, info]) => ({
      id: Number(id),
      name: info.name,
      slug: info.slug,
    }));

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: 'Ocurrió un error al obtener el menú de categorías.',
    };
  }
}
