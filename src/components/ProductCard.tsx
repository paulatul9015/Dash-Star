import React from 'react';
import { ShoppingCart, Eye, Heart, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist: propToggleWishlist,
  isWishlisted: propIsWishlisted,
}) => {
  const { isWishlisted: contextIsWishlisted, toggleWishlist: contextToggleWishlist } = useWishlist();
  const { getProductRatingStats } = useReviews();

  const [addedRecently, setAddedRecently] = React.useState(false);

  const activeWishlisted = propIsWishlisted !== undefined ? propIsWishlisted : contextIsWishlisted(product.id);
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (propToggleWishlist) {
      propToggleWishlist(product.id);
    } else {
      contextToggleWishlist(product.id);
    }
  };

  const { averageRating, reviewCount } = getProductRatingStats(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1600);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-[#E9ECF0] hover:bg-[#E2E6EC] rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between cursor-pointer border border-transparent hover:border-slate-300 hover:shadow-md"
    >
      {/* Top Discount Tag (Matching PDF "UP TO -15%" style) */}
      <div className="flex items-center justify-between w-full mb-2">
        <span className="bg-[#D89336] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
          UP TO -{product.discountPercent}%
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            activeWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm scale-105'
              : 'bg-white/70 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={activeWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${activeWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="relative w-full aspect-square sm:h-52 flex items-center justify-center my-2 overflow-hidden rounded-xl bg-white/40 group-hover:bg-white/70 transition-colors">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-indigo-950 transition-colors shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Specs</span>
          </button>
        </div>
      </div>

      {/* Product Details (Matching exact PDF typography) */}
      <div className="pt-2">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide truncate">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center justify-between mt-1 pt-1">
          <div className="flex items-baseline gap-2 text-xs sm:text-sm">
            {product.originalPrice && (
              <span className="text-slate-400 line-through text-[11px] sm:text-xs">
                ₹{product.originalPrice.toLocaleString('en-IN')}.00
              </span>
            )}
            <span className="font-bold text-slate-800">
              ₹{product.price.toLocaleString('en-IN')}.00
            </span>
          </div>

          {/* Add to Cart Quick Icon */}
          <button
            onClick={handleAdd}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
              addedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-indigo-950 text-white shadow-xs hover:shadow-md active:scale-95'
            }`}
            title="Add to Cart"
          >
            {addedRecently ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
