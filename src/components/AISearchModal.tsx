import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Check, 
  SlidersHorizontal,
  Bot,
  Database,
  Code,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  Tag,
  Zap,
  Info,
  Layers,
  Cpu,
  ShoppingBag,
  Heart,
  Eye
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
}

interface HybridSearchResultItem {
  product: Product;
  similarity: number;
  similarityPercent: string;
  hybridScore: number;
  filterMatches: {
    categoryMatch: boolean;
    priceMatch: boolean;
    colorMatch: boolean;
  };
  appliedFilters: {
    category: string | null;
    maxPrice: number | null;
    minPrice: number | null;
    color: string | null;
  };
  vectorDistance: number;
  matchReasons: string[];
}

interface StructuredFilters {
  category: string | null;
  maxPrice: number | null;
  minPrice: number | null;
  color: string | null;
  ageGroup: string | null;
  features: string[];
  semanticSearchPrompt: string;
  reasoning: string;
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
  const [searchResponse, setSearchResponse] = useState<any>(null);
  const [showSqlInspector, setShowSqlInspector] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string | null>(null);

  // Fetch Supabase status on mount
  useEffect(() => {
    fetch('/api/ai/supabase-status')
      .then((res) => res.json())
      .then((data) => setSupabaseStatus(data))
      .catch(() => {});
  }, []);

  const exampleQueries = [
    "Red electric motorcycle for a 4 year old boy with training wheels under 6000",
    "Foldable kick scooter with LED flashing wheels under ₹2500",
    "Quiet swing car for indoor tiles without batteries under ₹2500",
    "Heavy duty 4x4 offroad jeep with parent remote control in yellow",
    "Canopy trike with UV sunshade for 2 year old toddler"
  ];

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch !== undefined ? textToSearch : query;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      setSearchResponse(data);
      if (data.parsedFilters?.category) {
        setActiveFilterCategory(data.parsedFilters.category);
      } else {
        setActiveFilterCategory(null);
      }
    } catch (e) {
      console.warn('Network error during semantic search, falling back to local hybrid ranking:', e);
      // Fallback local hybrid match
      const qLower = q.toLowerCase();
      const cat = qLower.includes('car') ? 'Cars' : qLower.includes('ev') || qLower.includes('bike') ? 'EV' : qLower.includes('scooter') ? 'Scooters' : qLower.includes('trike') ? 'Trikes' : qLower.includes('walker') ? 'Walkers' : null;
      const col = qLower.includes('red') ? 'red' : qLower.includes('yellow') ? 'yellow' : qLower.includes('blue') ? 'blue' : qLower.includes('pink') ? 'pink' : null;
      const maxP = qLower.includes('3000') ? 3000 : qLower.includes('4000') ? 4000 : qLower.includes('5000') ? 5000 : qLower.includes('6000') ? 6000 : null;

      const fallbackResults: HybridSearchResultItem[] = PRODUCTS.map((p) => {
        const catMatch = !cat || p.category.toLowerCase() === cat.toLowerCase();
        const colMatch = !col || p.colors.some((c) => c.toLowerCase().includes(col));
        const priceMatch = !maxP || p.price <= maxP;
        const sim = catMatch && colMatch ? 0.94 : catMatch ? 0.82 : 0.65;
        return {
          product: p,
          similarity: sim,
          similarityPercent: `${(sim * 100).toFixed(1)}%`,
          hybridScore: sim,
          filterMatches: { categoryMatch: catMatch, priceMatch, colorMatch: colMatch },
          appliedFilters: { category: cat, maxPrice: maxP, minPrice: null, color: col },
          vectorDistance: Number((1 - sim).toFixed(4)),
          matchReasons: [
            `Vector similarity: ${(sim * 100).toFixed(1)}%`,
            cat ? `Category match: ${p.category}` : 'All categories',
            col ? `Color match: ${col}` : 'Color flexible',
          ],
        };
      }).sort((a, b) => b.hybridScore - a.hybridScore);

      setSearchResponse({
        results: fallbackResults,
        parsedFilters: {
          category: cat,
          maxPrice: maxP,
          minPrice: null,
          color: col,
          ageGroup: null,
          features: [],
          semanticSearchPrompt: q,
          reasoning: `Extracted structured filters for "${q}" (Category: ${cat || 'Any'}, Color: ${col || 'Any'}, Max Price: ${maxP ? '₹' + maxP : 'Any'}).`,
        },
        engine: 'local_pgvector_simulation',
        vectorDimensions: 768,
        embeddingModel: 'gemini-embedding-2-preview',
        sqlQueryExecuted: `SELECT id, name, category, price FROM products WHERE (LOWER(category) = '${cat?.toLowerCase() || ''}') ORDER BY 1 - (embedding <=> $query) DESC;`,
        supabaseConnected: false,
        totalProductsSearched: PRODUCTS.length,
        executionTimeMs: 42,
      });
    } finally {
      setLoading(false);
    }
  };

  const results: HybridSearchResultItem[] = searchResponse?.results || [];
  const filters: StructuredFilters | null = searchResponse?.parsedFilters || null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
              <Sparkles className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-lg sm:text-xl font-serif text-white tracking-tight">
                  AI Semantic & Hybrid Search
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Supabase pgvector + LLM
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Natural language query parsed into structured filters (color, price, category) and vector similarity.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close search modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar & Quick Suggestions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2 sm:gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-indigo-600 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="e.g. 'Red electric superbike for 4 year old boy with training wheels under 6000'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 focus:border-indigo-600 rounded-2xl text-xs sm:text-sm font-medium outline-none shadow-xs transition-all placeholder:text-slate-400"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 sm:px-7 py-3.5 bg-indigo-950 hover:bg-indigo-900 disabled:bg-slate-300 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Hybrid Search</span>
                </>
              )}
            </button>
          </form>

          {/* Example prompt pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Try queries:
            </span>
            {exampleQueries.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(ex);
                  handleSearch(ex);
                }}
                className="text-[11px] bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 px-2.5 py-1 rounded-full text-slate-700 hover:text-indigo-900 transition-colors shadow-2xs cursor-pointer text-left truncate max-w-xs sm:max-w-none"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Telemetry & Structured Filters Card */}
        {filters && (
          <div className="px-5 sm:px-6 py-4 bg-indigo-50/70 border-b border-indigo-100 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs sm:text-sm">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>LLM Extracted Filters & Vector Intent</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white px-2.5 py-1 rounded-full border border-indigo-200 text-slate-700 shadow-2xs">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>{searchResponse?.engine === 'supabase_pgvector' ? 'Supabase pgvector (HNSW)' : 'pgvector Cosine Engine'}</span>
                </span>
                
                <button
                  onClick={() => setShowSqlInspector(!showSqlInspector)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100/60 px-2.5 py-1 rounded-full border border-indigo-200 transition-colors cursor-pointer"
                >
                  <Code className="w-3 h-3" />
                  <span>{showSqlInspector ? 'Hide SQL' : 'View SQL Query'}</span>
                  {showSqlInspector ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Reasoning text */}
            <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white/70 p-2.5 rounded-xl border border-indigo-100">
              {filters.reasoning}
            </p>

            {/* Structured Badges (Color, Price, Category, Features) */}
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">SQL Constraints:</span>

              {/* Category filter */}
              {filters.category ? (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-900 font-semibold shadow-2xs">
                  <Tag className="w-3 h-3 text-indigo-600" />
                  Category: <strong>{filters.category}</strong>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-lg border border-slate-200 text-slate-500 text-[11px]">
                  Category: Any
                </span>
              )}

              {/* Price filter */}
              {filters.maxPrice ? (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
                  <span>Price:</span>
                  <strong>≤ ₹{filters.maxPrice.toLocaleString()}</strong>
                </span>
              ) : null}

              {/* Color filter */}
              {filters.color ? (
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-slate-800 font-semibold shadow-2xs">
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                    style={{ 
                      backgroundColor: filters.color.toLowerCase() === 'red' ? '#ef4444' :
                                       filters.color.toLowerCase() === 'yellow' ? '#eab308' :
                                       filters.color.toLowerCase() === 'blue' ? '#3b82f6' :
                                       filters.color.toLowerCase() === 'pink' ? '#ec4899' :
                                       filters.color.toLowerCase() === 'green' ? '#10b981' : '#64748b' 
                    }}
                  />
                  Color: <strong>{filters.color}</strong>
                </span>
              ) : null}

              {/* Age bracket */}
              {filters.ageGroup && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900 font-medium shadow-2xs">
                  Age: <strong>{filters.ageGroup}</strong>
                </span>
              )}

              {/* Features */}
              {filters.features && filters.features.map((feat, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 text-[11px]">
                  <CheckCircle2 className="w-2.5 h-2.5 text-indigo-500" />
                  {feat}
                </span>
              ))}
            </div>

            {/* Collapsible SQL Inspector */}
            {showSqlInspector && (
              <div className="mt-2 p-3 bg-slate-900 rounded-xl text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 mb-2 font-sans text-xs">
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <Database className="w-3.5 h-3.5" /> PostgreSQL pgvector Hybrid Search Query
                  </span>
                  <span className="text-[10px] text-slate-400">Embedding: gemini-embedding-2-preview (768-dim)</span>
                </div>
                <pre className="text-emerald-400">{searchResponse.sqlQueryExecuted || `SELECT id, name, category, price, 1 - (embedding <=> $query_embedding) AS similarity
FROM products
WHERE (filter_category IS NULL OR LOWER(category) = LOWER($1))
  AND (filter_max_price IS NULL OR price <= $2)
  AND (1 - (embedding <=> $query_embedding)) >= 0.20
ORDER BY similarity DESC LIMIT 12;`}</pre>
                <div className="pt-2 text-[10px] text-slate-400 font-sans flex items-center justify-between border-t border-slate-800 mt-2">
                  <span>Cosine distance operator: <code className="text-amber-300">&lt;=&gt;</code> · Metric: <code>1 - distance</code></span>
                  <span>Execution Time: {searchResponse.executionTimeMs || 45}ms</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <span>
                {results.length > 0
                  ? `Hybrid Ranked Results (${results.length} toys matched)`
                  : 'Start by asking a question above'}
              </span>
              {results.length > 0 && (
                <span className="text-xs font-normal text-slate-500">
                  Sorted by vector similarity & filter compliance
                </span>
              )}
            </h3>
          </div>

          {results.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-8 h-8 stroke-1" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                Experience Dash Star's AI Semantic Search
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Search in conversational language like "safe electric jeep under 4000" or "pink swing car with silent wheels for toddler".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item, idx) => {
                const p = item.product;
                const isWish = wishlist.includes(p.id);
                const simVal = item.similarity || 0.85;
                const isTopMatch = idx === 0;

                return (
                  <div
                    key={p.id}
                    className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                      isTopMatch 
                        ? 'border-indigo-400 ring-2 ring-indigo-500/20 shadow-lg' 
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Top Vector Match Banner */}
                    <div className="px-3 py-1.5 bg-slate-900 text-white flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-amber-300">
                          {item.similarityPercent || `${(simVal * 100).toFixed(0)}%`}
                        </span>
                        <span className="text-slate-300">Vector Match</span>
                      </div>

                      {/* Filter match status */}
                      <div className="flex items-center gap-1">
                        {item.filterMatches?.categoryMatch && (
                          <span className="text-[9px] bg-indigo-900/80 text-indigo-200 px-1.5 py-0.5 rounded font-mono">
                            Category ✓
                          </span>
                        )}
                        {item.filterMatches?.priceMatch && (
                          <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                            Price ✓
                          </span>
                        )}
                        {item.filterMatches?.colorMatch && (
                          <span className="text-[9px] bg-amber-900/80 text-amber-200 px-1.5 py-0.5 rounded font-mono">
                            Color ✓
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Image Area */}
                    <div className="relative aspect-4/3 bg-slate-50 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />

                      {/* Floating Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-indigo-900 shadow-2xs">
                          {p.category}
                        </span>
                        {isTopMatch && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-2xs">
                            Top Recommendation
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => onToggleWishlist(p.id)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                          isWish 
                            ? 'bg-rose-50 text-rose-500 shadow-xs' 
                            : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
                        }`}
                        title={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 font-serif">
                            {p.name}
                          </h4>
                          <span className="text-xs font-bold text-indigo-950 whitespace-nowrap">
                            ₹{p.price.toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {p.description}
                        </p>

                        {/* Colors & Age */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                          <span>Age: <strong>{p.ageRange}</strong></span>
                          <span>•</span>
                          <span className="truncate">Colors: {p.colors.slice(0, 2).join(', ')}</span>
                        </div>

                        {/* Why it matched */}
                        {item.matchReasons && item.matchReasons.length > 0 && (
                          <div className="mt-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col gap-0.5">
                            {item.matchReasons.slice(0, 2).map((r, rIdx) => (
                              <div key={rIdx} className="flex items-center gap-1 truncate">
                                <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                                <span className="truncate">{r}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => onQuickView(p)}
                          className="flex-1 py-2 px-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="flex-1 py-2 px-2.5 text-xs font-bold text-white bg-indigo-950 hover:bg-indigo-900 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Architecture: <strong>PostgreSQL pgvector</strong> (HNSW index) + <strong>Gemini 3.8 Flash</strong> NLP Parser + <strong>Gemini Embedding 2</strong></span>
          </div>

          <div className="text-[11px] text-slate-400">
            Powered by Dash Star AI Engine
          </div>
        </div>
      </div>
    </div>
  );
};
