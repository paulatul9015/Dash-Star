import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Check, 
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
}

export const AISearchModal: React.FC<AISearchModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlist,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedCriteria, setParsedCriteria] = useState<any>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [explanation, setExplanation] = useState<string>('');

  const exampleQueries = [
    "Red electric motorcycle for a 5 year old with headlights",
    "Self balancing swing car without battery under ₹2,000",
    "Baby learning walker with musical activity tray for 9 month infant",
    "Heavy duty 4x4 offroad jeep with parent remote control"
  ];

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();
      setParsedCriteria(data.criteria || {});
      setExplanation(data.explanation || '');

      const foundIds: string[] = data.productIds || [];
      const results = PRODUCTS.filter((p) => foundIds.includes(p.id));
      
      // If AI didn't find any direct matches, fallback to standard fuzzy match
      if (results.length === 0) {
        const fallback = PRODUCTS.filter((p) => 
          p.name.toLowerCase().includes(q.toLowerCase()) || 
          p.category.toLowerCase().includes(q.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
        );
        setMatchedProducts(fallback.length > 0 ? fallback : PRODUCTS.slice(0, 3));
      } else {
        setMatchedProducts(results);
      }
    } catch (e) {
      // Local fallback
      const fallback = PRODUCTS.filter((p) => 
        p.name.toLowerCase().includes(q.toLowerCase()) || 
        p.category.toLowerCase().includes(q.toLowerCase())
      );
      setMatchedProducts(fallback.length > 0 ? fallback : PRODUCTS.slice(0, 3));
      setExplanation("Showing closest matching models from Dash Star catalog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 className="font-bold text-lg font-serif">AI Semantic & Visual Search</h2>
              <p className="text-xs text-slate-400">
                Type in natural English or Hindi phrasing — our NLP model parses intent, age, battery type & budget.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="e.g. 'Looking for a red sports bike for 4 year old boy with training wheels'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium outline-none focus:border-indigo-600 shadow-2xs"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
            >
              {loading ? (
                <span>Analyzing NLP...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Search</span>
                </>
              )}
            </button>
          </form>

          {/* Example query chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500">Try asking:</span>
            {exampleQueries.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(ex);
                  handleSearch(ex);
                }}
                className="text-[11px] bg-white border border-slate-200 hover:border-indigo-400 px-2.5 py-1 rounded-full text-slate-600 hover:text-indigo-900 transition-colors shadow-2xs"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Parsed Intent Card */}
          {parsedCriteria && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-950 font-bold">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>NLU Intent Extraction & Semantic Vector Match</span>
              </div>
              <p className="text-slate-700">{explanation}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {parsedCriteria.category && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-200 font-medium text-indigo-900">
                    Category: <strong>{parsedCriteria.category}</strong>
                  </span>
                )}
                {parsedCriteria.maxPrice && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-200 font-medium text-emerald-800">
                    Budget: <strong>≤ ₹{parsedCriteria.maxPrice}</strong>
                  </span>
                )}
                {parsedCriteria.ageRange && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-200 font-medium text-slate-800">
                    Age Group: <strong>{parsedCriteria.ageRange}</strong>
                  </span>
                )}
                {parsedCriteria.powerType && (
                  <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-200 font-medium text-amber-900">
                    Power: <strong>{parsedCriteria.powerType}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                {matchedProducts.length > 0
                  ? `Found ${matchedProducts.length} Recommended Models`
                  : 'Start searching above'}
              </h3>
            </div>

            {matchedProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Search className="w-12 h-12 mx-auto stroke-1" />
                <p className="text-xs">Enter your criteria above or click any sample prompt</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
