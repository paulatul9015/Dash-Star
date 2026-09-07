import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Search, 
  Layers, 
  MessageSquare, 
  Phone, 
  Check, 
  ShoppingBag,
  Heart,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from './data/products';
import { Product, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { SpotlightBanner } from './components/SpotlightBanner';
import { TrendingSection } from './components/TrendingSection';
import { PromoBanner } from './components/PromoBanner';
import { Footer } from './components/Footer';
import { CatalogView } from './components/CatalogView';
import { AboutUsView } from './components/AboutUsView';
import { ExhibitionView } from './components/ExhibitionView';
import { ContactUsView } from './components/ContactUsView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AISearchModal } from './components/AISearchModal';
import { ArchitectureLabModal } from './components/ArchitectureLabModal';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<'home' | 'products' | 'about' | 'exhibition' | 'contact'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Pre-populate with DUCATTI for immediate delight
      quantity: 1,
      selectedColor: 'Racing Red',
    },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-001', 'prod-004']);

  // Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isArchitectureLabOpen, setIsArchitectureLabOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, color?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedColor: color || product.colors[0] || 'Standard',
        },
      ];
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist! ❤️');
        return [...prev, productId];
      }
    });
  };

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    setActiveView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'home' | 'products' | 'about' | 'exhibition' | 'contact') => {
    setActiveView(view);
    if (view !== 'products') {
      setSelectedCategory(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ducattiProduct = PRODUCTS.find((p) => p.name === 'DUCATTI') || PRODUCTS[0];
  const trendingEVProducts = [
    PRODUCTS.find((p) => p.id === 'gt-ev-09') || PRODUCTS[8],
    PRODUCTS.find((p) => p.id === 'jeep-ev-10') || PRODUCTS[9],
    PRODUCTS.find((p) => p.id === 'ranger-06') || PRODUCTS[5],
    PRODUCTS.find((p) => p.id === 'noddy-05') || PRODUCTS[4],
    PRODUCTS.find((p) => p.id === 'humr-ev-02') || PRODUCTS[1],
    PRODUCTS.find((p) => p.id === 'ducatti-01') || PRODUCTS[0],
  ].filter(Boolean) as Product[];
  const totalCartCount = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item?.quantity || 0), 0) : 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-amber-300 selection:text-slate-950">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentView={activeView}
        activeView={activeView}
        onNavigate={handleNavigate}
        cart={cart}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsAISearchOpen(true)}
        onOpenAISearch={() => setIsAISearchOpen(true)}
        onOpenAI={() => setIsAIAssistantOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenArchLab={() => setIsArchitectureLabOpen(true)}
        onOpenArchitectureLab={() => setIsArchitectureLabOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-0">
            {/* 1. Hero Banner Slider with 3 slide designs */}
            <HeroBanner
              onShopCategory={handleSelectCategory}
              onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
            />

            {/* 2. 6 Category Capsules Grid */}
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* 3. Best Seller Product Highlights (Page 1 & 2 in PDF) */}
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                    OUR COLLECTION
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Our Best-selling Products
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                  {PRODUCTS.slice(0, 8).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={(p) => setSelectedProduct(p)}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.includes(product.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Flagship Spotlight Banner for "DUCATTI" (Page 2 in PDF) */}
            <SpotlightBanner
              product={ducattiProduct}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setSelectedProduct(p)}
            />

            {/* 5. Trending EV & Scooter Collection (Page 2 & 3 in PDF) */}
            <TrendingSection
              products={trendingEVProducts}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setSelectedProduct(p)}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              onViewAllProducts={() => handleNavigate('products')}
            />

            {/* 6. Autumn Baby Toys Promo Banner (Page 3 in PDF) */}
            <PromoBanner
              onViewCollections={() => handleNavigate('products')}
            />

            {/* 7. BIS Safety & Factory Heritage Banner */}
            <section className="py-12 bg-slate-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl shrink-0 text-amber-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Since 1980s Heritage</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        40+ years of trusted toy craftsmanship with ISO 9001:2015 certified plant in Sahibabad.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl shrink-0 text-emerald-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">BIS IS 9873 Compliant</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Zero toxic plastics. Strictly virgin food-grade PP/ABS with rounded safety ergonomics.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl shrink-0 text-sky-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Direct Factory Support</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Pan-India express logistics, 1-year motor warranty, and genuine replacement parts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === 'products' && (
          <CatalogView
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setSelectedProduct(p)}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {activeView === 'about' && <AboutUsView />}

        {activeView === 'exhibition' && <ExhibitionView />}

        {activeView === 'contact' && <ContactUsView />}
      </main>

      {/* Persistent Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />

      {/* Floating Action Button: AI Shopping Assistant */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end">
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-full shadow-2xl hover:shadow-indigo-900/40 border border-indigo-400/40 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-none text-white">
              Ask StarBot AI
            </span>
            <span className="text-[10px] text-amber-300 font-semibold leading-tight">
              Toy Advisor & Specs
            </span>
          </div>
        </button>
      </div>

      {/* Interactive Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onOpenProduct={(p) => setSelectedProduct(p)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderCompleted={() => {
          setCart([]);
        }}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onSelectProduct={(p) => {
          setIsAIAssistantOpen(false);
          setSelectedProduct(p);
        }}
        onAddToCart={handleAddToCart}
      />

      <AISearchModal
        isOpen={isAISearchOpen}
        onClose={() => setIsAISearchOpen(false)}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => {
          setIsAISearchOpen(false);
          setSelectedProduct(p);
        }}
        onToggleWishlist={handleToggleWishlist}
        wishlist={wishlist}
      />

      <ArchitectureLabModal
        isOpen={isArchitectureLabOpen}
        onClose={() => setIsArchitectureLabOpen(false)}
      />
    </div>
  );
}
