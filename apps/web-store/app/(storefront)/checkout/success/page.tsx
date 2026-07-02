import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedido Confirmado',
  description: 'Tu pedido ha sido procesado exitosamente.',
};

function formatCurrency(value: string): string {
  const num = Number(value);
  if (isNaN(num)) return 'S/ 0.00';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(num);
}

interface SuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  const orderCode = typeof params.code === 'string' ? params.code : 'N/A';
  const totalPrice = typeof params.total === 'string' ? params.total : '0';
  const customerEmail = typeof params.email === 'string' ? params.email : '';
  const customerFullName = typeof params.name === 'string' ? params.name : '';
  const shippingAddress = typeof params.address === 'string' ? params.address : '';
  const ubigeoText = typeof params.ubigeo === 'string' ? params.ubigeo : '';

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-(--spacing-content) py-16">
      <div className="max-w-lg w-full bg-background border border-border p-12 text-center space-y-8">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-success text-background">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
            ¡Pedido Confirmado!
          </h1>
          <p className="mt-3 font-sans text-sm text-neutral-500 leading-relaxed">
            Gracias por tu compra, <span className="text-foreground font-medium">{customerFullName}</span>.
            Recibirás un correo en <span className="text-foreground font-medium">{customerEmail}</span> con los detalles de tu envío.
          </p>
        </div>

        {/* Order Code */}
        <div className="border-y border-border py-6">
          <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Código de Orden
          </span>
          <span className="block font-display text-2xl font-bold tracking-wider text-foreground">
            {orderCode}
          </span>
        </div>

        {/* Summary */}
        <div className="space-y-3 text-left">
          <div className="flex justify-between font-sans text-xs">
            <span className="text-neutral-500">Total Pagado</span>
            <span className="font-display font-bold text-foreground">{formatCurrency(totalPrice)}</span>
          </div>
          {shippingAddress && (
            <div className="border-t border-border pt-3">
              <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
                Enviaremos tu pedido a:
              </span>
              <p className="font-sans text-sm text-foreground">
                {shippingAddress}
              </p>
              {ubigeoText && (
                <p className="font-sans text-xs text-neutral-500 mt-0.5">{ubigeoText}</p>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href="/productos"
          className="block w-full bg-foreground text-background font-sans text-[11px] uppercase tracking-[0.2em] py-4 text-center hover:opacity-[var(--opacity-hover)] transition-opacity"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
