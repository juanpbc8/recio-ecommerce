export default function SuccessPage() {
  return (
    <div className="max-w-[40rem] mx-auto px-6 py-24 text-center font-sans">
      <div className="mb-8 flex justify-center">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h1 className="font-display text-3xl font-bold uppercase mb-4">¡Pedido Confirmado!</h1>
      <p className="text-neutral-600 mb-8">Gracias por tu compra. Hemos enviado los detalles a tu correo electrónico.</p>
      
      <div className="border border-neutral-200 p-6 rounded-sm bg-neutral-50 text-left mb-8">
        <h3 className="font-bold uppercase text-xs mb-4 border-b border-neutral-200 pb-2">Resumen</h3>
        <div className="flex justify-between text-sm mb-2">
          <span>Número de Orden:</span>
          <span className="font-mono">#REC-9283</span>
        </div>
      </div>

      <a href="/" className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:opacity-hover transition-recio">
        Volver a la tienda
      </a>
    </div>
  );
}