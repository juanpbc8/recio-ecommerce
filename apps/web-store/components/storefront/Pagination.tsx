import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '@/types';

interface PaginationProps {
  meta: PaginationMeta;
}

export function Pagination({ meta }: PaginationProps) {
  const { currentPage, totalPages, hasPrevPage, hasNextPage } = meta;

  function buildPageUrl(page: number): string {
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(page));
    return `/productos?${searchParams.toString()}`;
  }

  return (
    <nav
      className="flex items-center justify-center gap-6 font-sans"
      aria-label="Paginación de productos"
    >
      {hasPrevPage ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="group flex items-center gap-2 border border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:border-border-strong hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          Anterior
        </Link>
      ) : (
        <span className="flex items-center gap-2 border border-border/50 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 cursor-not-allowed">
          <ChevronLeft className="w-3 h-3" />
          Anterior
        </span>
      )}

      <span className="font-display text-xs text-neutral-500 tracking-wider select-none">
        Página {currentPage} de {totalPages}
      </span>

      {hasNextPage ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="group flex items-center gap-2 border border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:border-border-strong hover:text-foreground transition-colors"
        >
          Siguiente
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ) : (
        <span className="flex items-center gap-2 border border-border/50 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 cursor-not-allowed">
          Siguiente
          <ChevronRight className="w-3 h-3" />
        </span>
      )}
    </nav>
  );
}
