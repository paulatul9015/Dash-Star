import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface TrendingSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  onViewAllProducts?: () => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlist,
  onViewAllProducts,
}) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Matching PDF Page 2 */}
        <div className="text-center mb-10">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            TRENDING NOW
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            EV and Scooter collection
          </h2>
        </div>

        {/* Product Cards Grid (Matching Page 2 & 3 layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>

        {/* Additional 2 products from Page 3 if present */}
        {products.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-5 sm:mt-6">
            {products.slice(4, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
              />
            ))}
          </div>
        )}

        {/* "All Products" Pill Button Matching PDF Page 3 */}
        {onViewAllProducts && (
          <div className="flex justify-center mt-10">
            <button
              onClick={onViewAllProducts}
              className="px-8 py-3 bg-[#9CA899] hover:bg-[#8B9888] text-white font-bold text-sm rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
