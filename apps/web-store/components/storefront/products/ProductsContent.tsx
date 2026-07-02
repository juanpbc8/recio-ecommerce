import { ProductCard } from '@/components/storefront/ProductCard';
import { Pagination } from '@/components/storefront/Pagination';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { ProductCardDto, PaginationMeta } from '@/types';

interface ProductsContentProps {
  products: ProductCardDto[];
  meta: PaginationMeta | null;
  error: string | null;
  currentPage: number;
}

export function ProductsContent({ products, meta, error, currentPage }: ProductsContentProps) {
  return (
    <>
      {/* CATEGORY HEADER */}
      <header className="w-full border-b border-border bg-secondary py-12">
        <div className="max-w-(--width-container-max) mx-auto px-(--spacing-content)">
          <h1 className="font-display text-4xl font-bold uppercase tracking-tighter">
            Colección Completa
          </h1>
          <p className="mt-2 font-sans text-xs text-neutral-500 uppercase tracking-widest">
            {meta ? `${meta.totalItems} piezas encontradas` : 'Cargando...'}
          </p>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="w-full border-b border-border bg-white sticky top-16 z-40">
        <div className="max-w-(--width-container-max) mx-auto px-(--spacing-content) h-14 flex items-center justify-between">
          <button className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] hover:opacity-50 transition-opacity">
            <SlidersHorizontal className="w-4 h-4" />
            Filtrar
          </button>

          <div className="flex gap-8">
            <button className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.2em] hover:opacity-50">
              Ordenar por <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-(--width-container-max) mx-auto px-(--spacing-content) py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR DE FILTROS (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="space-y-10">
              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] mb-6">
                  Categorías
                </h3>
                <ul className="space-y-3">
                  {['Todos', 'Camisetas', 'Pantalones', 'Accesorios'].map((cat) => (
                    <li key={cat}>
                      <button className="font-sans text-[11px] uppercase tracking-widest text-neutral-500 hover:text-foreground">
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] mb-6">
                  Tallas
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      className="border border-border py-2 font-sans text-[11px] hover:border-black transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] mb-6">
                  Precio
                </h3>
                <div className="space-y-2">
                  <input type="range" className="w-full accent-black" />
                  <div className="flex justify-between font-display text-[11px] text-neutral-500">
                    <span>S/ 0</span>
                    <span>S/ 1000</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID + PAGINATION */}
          <section className="flex-1">
            {error && (
              <div className="border border-error bg-error/10 text-error p-4 font-sans text-sm mb-8">
                {error}
              </div>
            )}

            {!error && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-display text-lg text-neutral-400 uppercase tracking-wider">
                  No se encontraron productos
                </p>
                <p className="mt-2 font-sans text-xs text-neutral-400">
                  Intenta con otros filtros o vuelve más tarde.
                </p>
              </div>
            )}

            {products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 3} />
                  ))}
                </div>

                {meta && meta.totalPages > 1 && (
                  <div className="mt-16">
                    <Pagination meta={meta} />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
