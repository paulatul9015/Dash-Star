import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Eye, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  CloudCheck, 
  AlertCircle,
  PackageOpen,
  ShoppingBag
} from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';

interface WishlistViewProps {
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onContinueShopping: () => void;
  onOpenAssistant: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  onOpenProduct,
  onAddToCart,
  onContinueShopping,
  onOpenAssistant,
}) => {
  const { wishlistProducts, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { getProductRatingStats } = useReviews();
  const { user, signInWithGoogle } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(wishlistProducts.map((p) => p.category)))];

  const filteredProducts = filterCategory === 'All'
    ? wishlistProducts
    : wishlistProducts.filter((p) => p.category === filterCategory);

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((prod) => {
      onAddToCart(prod);
    });
    setCopiedNotification('All wishlisted toys moved to your cart!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleSingleMoveToCart = (prod: Product) => {
    onAddToCart(prod);
    setCopiedNotification(`Added ${prod.name} to cart!`);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-6 h-6 fill-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-serif tracking-tight">
                My Toy Wishlist
              </h1>
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <span>{wishlistCount} {wishlistCount === 1 ? 'item' : 'saved items'}</span>
                <span>•</span>
                {user ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <span>☁️ Synced to your Dash Star account ({user.email})</span>
                  </span>
                ) : (
                  <button
                    onClick={() => signInWithGoogle()}
                    className="text-amber-300 hover:text-amber-200 font-bold underline"
                  >
                    Sign in to sync across devices
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={handleMoveAllToCart}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-amber-400/20 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Move All to Cart</span>
            </button>
            <button
              onClick={clearWishlist}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-rose-300" />
              <span>Clear List</span>
            </button>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {copiedNotification && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-bold animate-fade-in">
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Filters / Category Pills */}
      {wishlistProducts.length > 0 && categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 mr-1">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                filterCategory === cat
                  ? 'bg-indigo-950 text-white border-indigo-950 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Wishlist Items */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const { averageRating, reviewCount } = getProductRatingStats(product.id);
            const discountAmount = product.originalPrice - product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 bg-slate-50 overflow-hidden p-3 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {product.discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                      -{product.discountPercent}%
                    </span>
                  )}

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-rose-50 text-rose-600 shadow-md transition-all hover:scale-110"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Age: {product.ageRange}
                      </span>
                    </div>

                    <h3
                      onClick={() => onOpenProduct(product)}
                      className="font-black text-slate-900 text-base uppercase hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1 text-amber-400">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(averageRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{averageRating}</span>
                      <span className="text-[10px] text-slate-400">({reviewCount})</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 line-through block">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Save ₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenProduct(product)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => handleSingleMoveToCart(product)}
                      className="py-2.5 px-3 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-serif">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Explore our ISI/BIS certified 12V Superbikes, 4x4 Off-Road Jeeps, Magic Swing Cars, and Pro Urban Scooters. Tap the heart icon on any toy to save it for later!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onContinueShopping}
              className="px-6 py-3.5 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Explore Catalog</span>
            </button>
            <button
              onClick={onOpenAssistant}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask StarBot AI for Ideas</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
