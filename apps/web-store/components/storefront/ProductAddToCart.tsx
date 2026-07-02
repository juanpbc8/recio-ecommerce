'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { ProductDetailDto, CartItemDto } from '@/types';

interface ProductAddToCartProps {
  product: ProductDetailDto;
}

export function ProductAddToCart({ product }: ProductAddToCartProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];
  const uniqueSizes = [...new Set(product.variants.map((v) => v.size))];

  const selectedVariant = product.variants.find(
    (v) =>
      v.color === selectedColor &&
      v.size === selectedSize,
  );

  const canAdd = !!selectedVariant && selectedVariant.stock > 0;

  const handleAddToCart = () => {
    if (!canAdd || !selectedVariant) return;

    const cartItem: CartItemDto = {
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      color: selectedVariant.color,
      size: selectedVariant.size,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      stockAvailable: selectedVariant.stock,
    };

    addItem(cartItem);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div className="mt-10 border-t border-border pt-8 space-y-8">
      {/* Color Selector */}
      {uniqueColors.length > 0 && (
        <div>
          <label className="block font-display text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            Color{selectedColor ? `: ${selectedColor}` : ''}
          </label>
          <div className="flex gap-3">
            {uniqueColors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`border px-4 py-2 font-sans text-[11px] uppercase tracking-wider transition-colors ${
                    isSelected
                      ? 'border-border-strong bg-foreground text-background'
                      : 'border-border hover:border-border-strong'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {uniqueSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-display text-[10px] font-bold uppercase tracking-[0.2em]">
              Talla{selectedSize ? `: ${selectedSize}` : ''}
            </label>
            <button
              type="button"
              className="font-sans text-[10px] uppercase tracking-widest text-neutral-500 underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Guía de tallas
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {uniqueSizes.map((size) => {
              const hasStock = product.variants.some(
                (v) => v.size === size && v.stock > 0,
              );
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!hasStock}
                  onClick={() => setSelectedSize(size)}
                  className={`border py-3 font-sans text-[11px] uppercase tracking-wider transition-colors ${
                    isSelected
                      ? 'border-border-strong bg-foreground text-background'
                      : hasStock
                        ? 'border-border hover:border-border-strong'
                        : 'border-border/50 text-neutral-400 cursor-not-allowed line-through'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock indicator */}
      {selectedVariant && (
        <p className="font-sans text-[10px] uppercase tracking-widest text-neutral-500">
          {selectedVariant.stock > 0
            ? `${selectedVariant.stock} unidades disponibles`
            : 'Agotado'}
        </p>
      )}

      {/* Add to Cart Button */}
      <button
        type="button"
        disabled={!canAdd}
        onClick={handleAddToCart}
        className={`w-full font-sans text-[11px] uppercase tracking-[0.2em] py-4 border transition-opacity ${
          addedFeedback
            ? 'bg-success border-success text-background'
            : canAdd
              ? 'bg-foreground text-background border-border-strong hover:opacity-[var(--opacity-hover)] active:opacity-90'
              : 'bg-neutral-200 text-neutral-400 border-border cursor-not-allowed'
        }`}
      >
        {addedFeedback
          ? '¡Agregado!'
          : canAdd
            ? 'Añadir al carrito'
            : 'Selecciona talla y color'}
      </button>
    </div>
  );
}
