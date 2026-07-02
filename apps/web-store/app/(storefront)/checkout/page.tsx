'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createStorefrontGuestOrder } from '@/actions/storefront/order';
import type { CreateOrderRequest } from '@/types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value);
}

const INPUT_STYLE =
  'w-full bg-transparent border border-border px-4 py-3 font-sans text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:border-border-strong transition-colors rounded-none';

const LABEL_STYLE = 'block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-foreground mb-2';

export default function CheckoutPage() {
  const { items, isLoaded, subtotal, clearCart, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    customerEmail: '',
    customerFirstName: '',
    customerLastName: '',
    customerDocType: 'DNI' as CreateOrderRequest['customerDocType'],
    customerDocNum: '',
    customerPhone: '',
    addressLine: '',
    department: '',
    province: '',
    district: '',
    reference: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setServerError(null);

    const payload: CreateOrderRequest = {
      customerEmail: form.customerEmail,
      customerFirstName: form.customerFirstName,
      customerLastName: form.customerLastName,
      customerDocType: form.customerDocType,
      customerDocNum: form.customerDocNum,
      customerPhone: form.customerPhone,
      addressLine: form.addressLine,
      department: form.department,
      province: form.province,
      district: form.district,
      reference: form.reference || undefined,
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    try {
      const result = await createStorefrontGuestOrder(payload);

      if (!result.success || !result.data) {
        setServerError(result.error || 'Error al procesar la orden.');
        setIsSubmitting(false);
        return;
      }

      clearCart();

      const params = new URLSearchParams({
        code: result.data.orderCode,
        total: String(result.data.totalPrice),
        email: result.data.customerEmail,
        name: result.data.customerFullName,
        address: result.data.shippingAddress,
        ubigeo: result.data.ubigeoText,
      });

      router.push(`/checkout/success?${params.toString()}`);
    } catch {
      setServerError('Error inesperado. Por favor, intente nuevamente.');
      setIsSubmitting(false);
    }
  };

  // Prevent SSR flash: show nothing until client-side hydration
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="font-display text-xs uppercase tracking-[0.2em] text-neutral-400">Cargando...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-(--spacing-content)">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground mb-4">
          Tu carrito está vacío
        </h1>
        <p className="font-sans text-sm text-neutral-500 mb-8">
          Agrega productos antes de continuar con la compra.
        </p>
        <Link
          href="/productos"
          className="bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.2em] px-8 py-3 hover:opacity-[var(--opacity-hover)] transition-opacity"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-(--width-container-max) mx-auto px-(--spacing-content) py-16">
      {/* Header */}
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tighter text-foreground">
          Finalizar Pedido
        </h1>
        <p className="mt-2 font-sans text-xs text-neutral-500 uppercase tracking-widest">
          {items.length} {items.length === 1 ? 'artículo' : 'artículos'} en tu carrito
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
        {/* Left Column: Checkout Form */}
        <div className="lg:w-7/12 space-y-12">
          {/* Section 1: Personal Data */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-3">
              <span className="font-display text-[10px] font-bold bg-foreground text-background w-6 h-6 flex items-center justify-center">
                1
              </span>
              <h2 className="font-display text-lg uppercase font-bold tracking-tight">
                Datos Personales
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={LABEL_STYLE}>Correo Electrónico</label>
                <input
                  name="customerEmail"
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={form.customerEmail}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_STYLE}>Nombres</label>
                <input
                  name="customerFirstName"
                  type="text"
                  required
                  placeholder="Juan"
                  value={form.customerFirstName}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_STYLE}>Apellidos</label>
                <input
                  name="customerLastName"
                  type="text"
                  required
                  placeholder="Pérez"
                  value={form.customerLastName}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_STYLE}>Tipo de Documento</label>
                <select
                  name="customerDocType"
                  value={form.customerDocType}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">Carné de Extranjería</option>
                </select>
              </div>
              <div>
                <label className={LABEL_STYLE}>Número de Documento</label>
                <input
                  name="customerDocNum"
                  type="text"
                  required
                  placeholder="12345678"
                  value={form.customerDocNum}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_STYLE}>Teléfono</label>
                <input
                  name="customerPhone"
                  type="tel"
                  required
                  placeholder="999 888 777"
                  value={form.customerPhone}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Shipping Address */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-3">
              <span className="font-display text-[10px] font-bold bg-foreground text-background w-6 h-6 flex items-center justify-center">
                2
              </span>
              <h2 className="font-display text-lg uppercase font-bold tracking-tight">
                Dirección de Envío
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={LABEL_STYLE}>Dirección (Calle / Av. / Dpto)</label>
                <input
                  name="addressLine"
                  type="text"
                  required
                  placeholder="Av. Principal 123, Dpto 401"
                  value={form.addressLine}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_STYLE}>Departamento</label>
                <input
                  name="department"
                  type="text"
                  required
                  placeholder="Lima"
                  value={form.department}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_STYLE}>Provincia</label>
                <input
                  name="province"
                  type="text"
                  required
                  placeholder="Lima"
                  value={form.province}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_STYLE}>Distrito</label>
                <input
                  name="district"
                  type="text"
                  required
                  placeholder="Miraflores"
                  value={form.district}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_STYLE}>Referencia (Opcional)</label>
                <input
                  name="reference"
                  type="text"
                  placeholder="Frente al parque"
                  value={form.reference}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          </section>

          {/* Server Error */}
          {serverError && (
            <div className="border border-error bg-error/10 text-error px-4 py-3 font-sans text-sm">
              {serverError}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <aside className="lg:w-5/12">
          <div className="sticky top-24 border border-border bg-secondary p-8 space-y-6">
            <h2 className="font-display text-lg uppercase font-bold tracking-tight border-b border-border pb-4">
              Resumen de Compra
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-neutral-100 overflow-hidden shrink-0 border border-border">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-sans text-[8px] text-neutral-400 uppercase">
                        Sin img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-sans text-xs uppercase tracking-wider text-foreground line-clamp-1">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="font-sans text-[10px] text-neutral-400 hover:text-error transition-colors shrink-0 uppercase tracking-wider"
                      >
                        Quitar
                      </button>
                    </div>
                    <p className="font-sans text-[10px] text-neutral-500 mt-0.5">
                      {item.color} / {item.size}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 border border-border flex items-center justify-center font-sans text-xs text-neutral-500 hover:border-border-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          -
                        </button>
                        <span className="font-sans text-xs text-foreground w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockAvailable}
                          className="w-6 h-6 border border-border flex items-center justify-center font-sans text-xs text-neutral-500 hover:border-border-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-display text-xs font-bold text-foreground">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between font-sans text-xs text-neutral-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-sans text-xs text-neutral-600">
                <span>Envío</span>
                <span className="text-success font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-display text-base font-bold text-foreground border-t border-border-strong pt-3">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] py-4 border border-border-strong hover:opacity-[var(--opacity-hover)] active:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Compra'}
            </button>

            <p className="font-sans text-[9px] text-neutral-400 text-center leading-relaxed">
              Al confirmar, aceptas nuestros términos y condiciones de compra.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
