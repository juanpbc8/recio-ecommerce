'use server';

import { db } from '@/lib/db';
import type { CreateOrderRequest, OrderSuccessDto, ApiResponse } from '@/types';

/**
 * Generates a unique order reference code in the format: RC-YYYYMMDD-XXXX
 * Where XXXX is a random 4-character uppercase alphanumeric serial.
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
 * Processes a guest checkout order using a secure Prisma transaction.
 *
 * Steps:
 * 1. Fetch variants + parent products from DB (never trust client prices).
 * 2. Validate stock availability for each requested item.
 * 3. Decrement inventory atomically.
 * 4. Generate unique order code.
 * 5. Persist Order, OrderItems, and OrderAddress in a single transaction.
 * 6. Return the success DTO for the confirmation page.
 */
export async function createStorefrontGuestOrder(
  payload: CreateOrderRequest,
): Promise<ApiResponse<OrderSuccessDto>> {
  try {
    // --- Step 1: Fetch all requested variants with their parent product ---
    const variantIds = payload.items.map((item) => item.variantId);

    const variants = await db.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    if (variants.length !== variantIds.length) {
      return {
        success: false,
        error: 'Uno o más productos seleccionados no existen en el catálogo.',
      };
    }

    // Build a lookup map for quick access inside the transaction
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    // --- Step 2 & 3: Validate stock and calculate total inside transaction ---
    const orderCode = generateOrderCode();

    const result = await db.$transaction(async (tx) => {
      let grandTotal = 0;
      const orderItemsData: { variantId: number; quantity: number; priceAtPurchase: number }[] = [];

      for (const item of payload.items) {
        const variant = variantMap.get(item.variantId)!;
        const dbPrice = Number(variant.product.price);

        // Stock validation
        if (variant.stock < item.quantity) {
          throw new Error(
            `STOCK_INSUFFICIENT:${variant.product.name} en talla ${variant.size} y color ${variant.color}`,
          );
        }

        // Accumulate total from DB prices (security: never trust client price)
        grandTotal += dbPrice * item.quantity;

        // Prepare order item snapshot
        orderItemsData.push({
          variantId: variant.id,
          quantity: item.quantity,
          priceAtPurchase: dbPrice,
        });

        // Decrement inventory
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // --- Step 5: Persist Order + Relations ---
      const newOrder = await tx.order.create({
        data: {
          code: orderCode,
          totalPrice: grandTotal,
          status: 'PENDIENTE',
          customerEmail: payload.customerEmail,
          customerFirstName: payload.customerFirstName,
          customerLastName: payload.customerLastName,
          customerDocType: payload.customerDocType,
          customerDocNum: payload.customerDocNum,
          customerPhone: payload.customerPhone,
          items: {
            create: orderItemsData.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtPurchase: item.priceAtPurchase,
            })),
          },
          shippingAddress: {
            create: {
              addressLine: payload.addressLine,
              department: payload.department,
              province: payload.province,
              district: payload.district,
              reference: payload.reference ?? null,
            },
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      return newOrder;
    });

    // --- Step 6: Map response to OrderSuccessDto ---
    const successData: OrderSuccessDto = {
      orderCode: result.code,
      totalPrice: Number(result.totalPrice),
      customerEmail: result.customerEmail,
      customerFullName: `${result.customerFirstName} ${result.customerLastName}`,
      shippingAddress: result.shippingAddress?.addressLine ?? '',
      ubigeoText: `${result.shippingAddress?.department ?? ''}, ${result.shippingAddress?.province ?? ''}, ${result.shippingAddress?.district ?? ''}`,
    };

    return { success: true, data: successData };
  } catch (error: unknown) {
    // Handle stock validation errors thrown from inside the transaction
    if (error instanceof Error && error.message.startsWith('STOCK_INSUFFICIENT:')) {
      const details = error.message.replace('STOCK_INSUFFICIENT:', '');
      return {
        success: false,
        error: `Stock insuficiente para ${details}.`,
      };
    }

    // Log unexpected errors for DevOps tracing
    console.error('[ORDER_ACTION] Unexpected error processing guest order:', error);

    return {
      success: false,
      error: 'Error interno al procesar su orden. Por favor, intente nuevamente.',
    };
  }
}
