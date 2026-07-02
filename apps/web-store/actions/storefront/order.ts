'use server';

import { MOCK_PRODUCTS } from '@/mocks/products';
import type { CreateOrderRequest, OrderSuccessDto, ApiResponse } from '@/types';

/**
 * Generates a unique order reference code in the format: RC-YYYYMMDD-XXXX
 */
function generateOrderCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStamp = `${year}${month}${day}`;

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let serial = '';
  for (let i = 0; i < 4; i++) {
    serial += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `RC-${dateStamp}-${serial}`;
}

/**
 * Processes a guest checkout order.
 *
 * Validates stock and prices against the mock product catalog (the current data source),
 * then returns a success DTO for the confirmation page.
 *
 * NOTE: When the database is seeded with real product/variant data, swap this implementation
 * to use a Prisma $transaction block (see commented transaction skeleton below).
 */
export async function createStorefrontGuestOrder(
  payload: CreateOrderRequest,
): Promise<ApiResponse<OrderSuccessDto>> {
  try {
    // --- Step 1: Build a flat lookup of all mock variants with their parent product ---
    const variantMap = new Map<
      number,
      { id: number; stock: number; color: string; size: string; productName: string; price: number }
    >();

    for (const product of MOCK_PRODUCTS) {
      for (const variant of product.variants) {
        variantMap.set(variant.id, {
          id: variant.id,
          stock: variant.stock,
          color: variant.color,
          size: variant.size,
          productName: product.name,
          price: Number(product.price),
        });
      }
    }

    // --- Step 2: Validate all requested items exist and have sufficient stock ---
    let grandTotal = 0;

    for (const item of payload.items) {
      const variant = variantMap.get(item.variantId);

      if (!variant) {
        return {
          success: false,
          error: 'Uno o más productos seleccionados no existen en el catálogo.',
        };
      }

      if (variant.stock < item.quantity) {
        return {
          success: false,
          error: `Stock insuficiente para ${variant.productName} en talla ${variant.size} y color ${variant.color}.`,
        };
      }

      grandTotal += variant.price * item.quantity;
    }

    // --- Step 3: Generate order code and build success response ---
    const orderCode = generateOrderCode();

    const successData: OrderSuccessDto = {
      orderCode,
      totalPrice: grandTotal,
      customerEmail: payload.customerEmail,
      customerFullName: `${payload.customerFirstName} ${payload.customerLastName}`,
      shippingAddress: payload.addressLine,
      ubigeoText: `${payload.department}, ${payload.province}, ${payload.district}`,
    };

    return { success: true, data: successData };
  } catch (error: unknown) {
    console.error('[ORDER_ACTION] Unexpected error processing guest order:', error);

    return {
      success: false,
      error: 'Error interno al procesar su orden. Por favor, intente nuevamente.',
    };
  }
}

/*
 * ─── FUTURE: Prisma Transaction Skeleton ───
 * When the database is seeded with real products, replace the mock validation above with:
 *
 * import { db } from '@/lib/db';
 *
 * const result = await db.$transaction(async (tx) => {
 *   // 1. Fetch variants from DB, validate stock
 *   // 2. Decrement inventory
 *   // 3. Create Order + OrderItems + OrderAddress
 *   // 4. Return created order
 * });
 */
