import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  Check, 
  RotateCcw,
  Search
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';

interface CatalogViewProps {
  products: Product[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(7000);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [powerType, setPowerType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Age brackets
  const ageOptions = [
    { label: 'All Ages', value: null },
    { label: '6 - 18 Months (Walkers)', value: '18 Months' },
    { label: '1 - 4 Years (Trikes & Push)', value: '4 Years' },
    { label: '3 - 8 Years (EV & Bikes)', value: '8 Years' },
    { label: '5 - 12 Years (Pro Scooters)', value: '12 Years' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory && p.category !== selectedCategory) return false;
        // Price filter
        if (p.price > maxPrice) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matches) return false;
        }
        // Age filter
        if (selectedAge && !p.ageRange.includes(selectedAge)) return false;
        // Power type filter
        if (powerType === 'battery' && !p.batterySpec) return false;
        if (powerType === 'manual' && p.batterySpec) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, maxPrice, searchQuery, selectedAge, powerType, sortBy]);

  const resetFilters = () => {
    onSelectCategory(null);
    setMaxPrice(7000);
    setSelectedAge(null);
    setPowerType(null);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-indigo-900 font-semibold">Our Products</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-amber-600 font-bold">{selectedCategory}</span>
              </>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
                {selectedCategory ? `${selectedCategory} Collection` : 'All Ride-On Toys & Vehicles'}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Showing {filteredProducts.length} certified Made-in-India models with BIS quality assurance
              </p>
            </div>

            {/* Quick Sort & Mobile Filter Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs"
              >
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs shadow-2xs">
                <span className="text-slate-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort products by"
                  className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="featured">Best Sellers First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount (%)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedCategory === null
                ? 'bg-indigo-950 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Toys ({products.length})
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.name)}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === c.name
                  ? 'bg-indigo-950 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Main Layout: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filter */}
          <aside className={`lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 ${
            mobileFilterOpen ? 'block fixed inset-0 z-50 overflow-y-auto bg-white m-4 rounded-3xl shadow-2xl' : 'hidden lg:block'
          }`}>
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 lg:hidden">
                <span className="font-bold text-base text-slate-900">Filter Toys</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Filter Products
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Search in Catalog
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. ducati, remote jeep, walker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Max Budget:</span>
                <span className="text-indigo-900 font-extrabold text-sm">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1800"
                max="7000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹1,800</span>
                <span>₹4,000</span>
                <span>₹7,000</span>
              </div>
            </div>

            {/* Age Group */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Target Age Group
              </label>
              <div className="space-y-1.5">
                {ageOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedAge(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedAge === opt.value
                        ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedAge === opt.value && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Power Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Drive Mechanism
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPowerType(powerType === 'battery' ? null : 'battery')}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                    powerType === 'battery'
                      ? 'bg-indigo-950 text-white border-indigo-950 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ⚡ 6V/12V Electric
                </button>
                <button
                  onClick={() => setPowerType(powerType === 'manual' ? null : 'manual')}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                    powerType === 'manual'
                      ? 'bg-indigo-950 text-white border-indigo-950 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🌀 Manual / Pedal
                </button>
              </div>
            </div>

            {/* Mobile Apply Button */}
            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-indigo-950 text-white font-bold text-sm rounded-xl"
              >
                Apply Filters ({filteredProducts.length} results)
              </button>
            )}
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No toys matched your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your budget slider, age bracket, or clear the search query to view more items.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-indigo-950 text-white text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
          </main>
        </div>
      </div>
    </div>
  );
};
