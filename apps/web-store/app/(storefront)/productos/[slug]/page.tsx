import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getStorefrontProductDetailBySlug } from '@/actions/catalog';
import { ProductAddToCart } from '@/components/storefront/ProductAddToCart';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value);
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getStorefrontProductDetailBySlug(slug);

  if (!response.success || !response.data) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: response.data.name,
    description: response.data.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const response = await getStorefrontProductDetailBySlug(slug);

  if (!response.success || !response.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-(--spacing-content) bg-background">
        <div className="text-center max-w-md">
          <span className="font-display text-6xl font-bold text-neutral-200 select-none">404</span>
          <h1 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-foreground">
            Producto no encontrado
          </h1>
          <p className="mt-3 font-sans text-sm text-neutral-500 leading-relaxed">
            El artículo que buscas no existe o ya no está disponible en nuestra colección.
          </p>
          <Link
            href="/productos"
            className="mt-8 inline-block border border-border-strong bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.2em] px-8 py-3 hover:opacity-[var(--opacity-hover)] transition-opacity"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const product = response.data;
  const imageSrc = product.imageUrl;
  const discountPercentage =
    product.isOnSale && product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary">
        <div className="max-w-(--width-container-max) mx-auto px-(--spacing-content) py-4 flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-neutral-500">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-foreground transition-colors">
            Productos
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* PDP: 2-Column Layout */}
      <div className="max-w-(--width-container-max) mx-auto px-(--spacing-content) py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Product Image */}
          <div className="lg:w-1/2">
            <div className="relative w-full aspect-portrait overflow-hidden bg-neutral-100 border border-border">
              {imageSrc ? (
                <Image
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  src={imageSrc}
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-sans text-[10px] tracking-widest text-neutral-400 uppercase">
                  Sin imagen
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isNew && (
                  <span className="bg-primary px-3 py-1.5 font-sans text-[10px] tracking-widest text-primary-foreground uppercase">
                    Novedad
                  </span>
                )}
                {discountPercentage && (
                  <span className="bg-white border border-border-strong px-3 py-1.5 font-sans text-[10px] tracking-widest text-foreground uppercase font-bold">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:w-1/2 flex flex-col justify-start">
            {/* Category */}
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
              {product.category.name}
            </span>

            {/* Name */}
            <h1 className="font-display text-3xl lg:text-4xl font-bold uppercase tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mt-6">
              <span className="font-display text-2xl font-bold text-foreground">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-display text-base text-neutral-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discountPercentage && (
                <span className="font-sans text-[10px] uppercase tracking-widest text-error font-bold">
                  Ahorra {discountPercentage}%
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-8 font-sans text-sm text-neutral-600 leading-relaxed max-w-md">
                {product.description}
              </p>
            )}

            {/* Interactive: Color/Size Selection + Add to Cart */}
            <ProductAddToCart product={product} />

            {/* Metadata */}
            <div className="mt-8 border-t border-border pt-6 space-y-3">
              <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-neutral-500">
                <span className="w-1 h-1 bg-success rounded-full" />
                Envío gratuito en pedidos superiores a S/ 200
              </div>
              <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-neutral-500">
                <span className="w-1 h-1 bg-success rounded-full" />
                Devoluciones gratis dentro de 30 días
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
