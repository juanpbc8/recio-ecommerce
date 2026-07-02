import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-(--spacing-content) bg-background">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground mb-4">
          Mi Perfil
        </h1>
        <p className="font-sans text-sm text-neutral-500 mb-8">
          Esta sección estará disponible próximamente.
        </p>
        <Link
          href="/productos"
          className="inline-block bg-foreground text-background font-sans text-[10px] uppercase tracking-[0.2em] px-8 py-3 hover:opacity-[var(--opacity-hover)] transition-opacity"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
