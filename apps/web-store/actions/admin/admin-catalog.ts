'use server';

import { MOCK_PRODUCTS } from '@/mocks/products';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  AdminProductTableRowDto,
  AdminProductDetailDto,
  SaveProductRequestDto,
  AdminCategoryTableRowDto,
  SaveCategoryRequestDto,
} from '@/types';

// Diccionario centralizado para consistencia de datos de categorías
const ADMIN_CATEGORY_MAP: Record<number, { name: string; slug: string; createdAt: Date }> = {
  1: { name: 'Camisetas', slug: 'camisetas', createdAt: new Date('2026-01-10') },
  2: { name: 'Camisas', slug: 'camisas', createdAt: new Date('2026-01-12') },
  3: { name: 'Blazers', slug: 'blazers', createdAt: new Date('2026-01-15') },
  4: { name: 'Pantalones', slug: 'pantalones', createdAt: new Date('2026-01-20') },
  5: { name: 'Casacas y Abrigos', slug: 'casacas-y-abrigos', createdAt: new Date('2026-02-01') },
  6: { name: 'Jerseys', slug: 'jerseys', createdAt: new Date('2026-02-10') },
};

/**
 * Helper utilitario para paginar cualquier arreglo en memoria de forma estandarizada.
 */
function paginateArray<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
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

// ==========================================
// 📦 MÓDULO PRODUCTOS (ADMIN)
// ==========================================

/**
 * Obtiene el listado de productos paginado y con soporte para búsqueda por texto.
 */
export async function getAdminProductsList(
  page: number = 1,
  pageSize: number = 5,
  search?: string,
): Promise<ApiResponse<PaginatedResponse<AdminProductTableRowDto>>> {
  try {
    let products = [...MOCK_PRODUCTS];

    // Aplicar filtro de búsqueda si el cliente lo solicita
    if (search) {
      const query = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query),
      );
    }

    // Adaptar los ítems crudos al contrato estricto AdminProductTableRowDto
    const adaptedRows: AdminProductTableRowDto[] = products.map((p) => {
      const mainImage = p.images?.find((img) => img.url);
      const fallbackImage = p.images?.[0];
      const categoryInfo = ADMIN_CATEGORY_MAP[p.categoryId] ?? { name: 'Sin Categoría' };

      // Sumatoria reactiva del stock disponible a través de todas sus variantes
      const totalStock = p.variants?.reduce((acc, v) => acc + v.stock, 0) ?? 0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        totalStock,
        isVisible: p.isVisible,
        categoryName: categoryInfo.name,
        imageUrl: mainImage?.url ?? fallbackImage?.url ?? null,
      };
    });

    // Paginar el arreglo adaptado
    const paginatedData = paginateArray(adaptedRows, page, pageSize);

    return { success: true, data: paginatedData };
  } catch (error) {
    return { success: false, error: 'Error al procesar la tabla de productos del administrador.' };
  }
}

/**
 * Recupera un producto específico mapeado al contrato de detalle completo para edición.
 */
export async function getAdminProductDetailById(
  id: number,
): Promise<ApiResponse<AdminProductDetailDto | null>> {
  try {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);

    if (!product) {
      return { success: true, data: null };
    }

    const mainImage = product.images?.find((img) => img.url);
    const fallbackImage = product.images?.[0];

    const data: AdminProductDetailDto = {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      slug: product.slug,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      isVisible: product.isVisible,
      isNew: product.isNew,
      isOnSale: product.isOnSale,
      categoryId: product.categoryId,
      imageUrl: mainImage?.url ?? fallbackImage?.url ?? null,
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
    return { success: false, error: 'Error al recuperar el detalle de producto para auditoría.' };
  }
}

/**
 * Server Action unificada para procesar la creación (POST) o actualización (PUT) de productos.
 */
export async function saveAdminProductForm(
  payload: SaveProductRequestDto,
  id?: number,
): Promise<ApiResponse<{ id: number }>> {
  try {
    // Validar lógicas de negocio base
    if (!payload.name || !payload.slug || payload.price <= 0) {
      return { success: false, error: 'Datos de formulario inválidos o incompletos.' };
    }

    if (id) {
      // Simulación de actualización de registro existente
      console.log(`[DB MOCK UPDATE]: Producto ID ${id} modificado exitosamente.`);
      return { success: true, data: { id } };
    } else {
      // Simulación de inserción secuencial de nuevo registro
      const newId = MOCK_PRODUCTS.length + 1;
      console.log(`[DB MOCK INSERT]: Producto creado con ID asignado: ${newId}.`);
      return { success: true, data: { id: newId } };
    }
  } catch (error) {
    return { success: false, error: 'Ocurrió un fallo de persistencia al guardar el producto.' };
  }
}

// ==========================================
// 📂 MÓDULO CATEGORÍAS (ADMIN)
// ==========================================

/**
 * Obtiene la tabla paginada de categorías calculando dinámicamente el conteo de productos vinculados.
 */
export async function getAdminCategoriesList(
  page: number = 1,
  pageSize: number = 5,
): Promise<ApiResponse<PaginatedResponse<AdminCategoryTableRowDto>>> {
  try {
    const categoriesArray = Object.entries(ADMIN_CATEGORY_MAP).map(([idStr, info]) => {
      const id = Number(idStr);

      // Agregación en caliente: Contar cuántos productos del mock pertenecen a esta categoría
      const productsCount = MOCK_PRODUCTS.filter((p) => p.categoryId === id).length;

      return {
        id,
        name: info.name,
        slug: info.slug,
        productsCount,
        createdAt: info.createdAt,
      };
    });

    // Paginación estandarizada
    const paginatedData = paginateArray(categoriesArray, page, pageSize);

    return { success: true, data: paginatedData };
  } catch (error) {
    return { success: false, error: 'Error al procesar la tabla de control de categorías.' };
  }
}

/**
 * Server Action unificada para crear o editar categorías desde el panel administrativo.
 */
export async function saveAdminCategoryForm(
  payload: SaveCategoryRequestDto,
  id?: number,
): Promise<ApiResponse<{ id: number }>> {
  try {
    if (!payload.name || !payload.slug) {
      return { success: false, error: 'El nombre y el slug de la categoría son obligatorios.' };
    }

    if (id) {
      console.log(`[DB MOCK UPDATE]: Categoría ID ${id} actualizada.`);
      return { success: true, data: { id } };
    } else {
      const newCategoryId = Object.keys(ADMIN_CATEGORY_MAP).length + 1;
      console.log(`[DB MOCK INSERT]: Nueva categoría registrada con ID: ${newCategoryId}.`);
      return { success: true, data: { id: newCategoryId } };
    }
  } catch (error) {
    return { success: false, error: 'Fallo al procesar el almacenamiento de la categoría.' };
  }
}
