import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ShoppingCart, 
  Heart, 
  Phone, 
  Cpu, 
  Bot, 
  Menu, 
  X,
  ShieldCheck,
  Truck,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { CartItem } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView?: 'home' | 'products' | 'about' | 'exhibition' | 'contact' | 'wishlist';
  activeView?: 'home' | 'products' | 'about' | 'exhibition' | 'contact' | 'wishlist';
  onNavigate: (view: 'home' | 'products' | 'about' | 'exhibition' | 'contact' | 'wishlist') => void;
  cart?: CartItem[];
  cartCount?: number;
  onOpenCart: () => void;
  onOpenSearch?: () => void;
  onOpenAISearch?: () => void;
  onOpenAI?: () => void;
  onOpenAIAssistant?: () => void;
  onOpenArchLab?: () => void;
  onOpenArchitectureLab?: () => void;
  wishlistCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeView,
  onNavigate,
  cart = [],
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAISearch,
  onOpenAI,
  onOpenAIAssistant,
  onOpenArchLab,
  onOpenArchitectureLab,
  wishlistCount: propWishlistCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { wishlistCount: contextWishlistCount } = useWishlist();
  const { user, signInWithGoogle, signOut } = useAuth();

  const totalWishlistCount = propWishlistCount !== undefined ? propWishlistCount : contextWishlistCount;

  const totalCartCount = cartCount !== undefined 
    ? cartCount 
    : (Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item?.quantity || 0), 0) : 0);
  const activeTab = currentView || activeView || 'home';
  const handleSearch = onOpenSearch || onOpenAISearch || (() => {});
  const handleAI = onOpenAI || onOpenAIAssistant || (() => {});
  const handleArchLab = onOpenArchLab || onOpenArchitectureLab || (() => {});

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1 font-medium text-amber-400">
              <Truck className="w-3.5 h-3.5" /> FREE Delivery across India on ₹1,999+
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% BIS IS 9873 Certified Safe Toys
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button 
              onClick={handleArchLab}
              className="flex items-center gap-1 text-sky-300 hover:text-sky-200 bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-700/50 transition-colors cursor-pointer"
            >
              <Cpu className="w-3 h-3 text-sky-400" />
              <span>Full System Architecture & ML Lab</span>
            </button>
            <a href="tel:+919599811712" className="hidden lg:flex items-center gap-1 hover:text-amber-300 transition-colors">
              <Phone className="w-3 h-3 text-amber-400" />
              +91-9599811712
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-indigo-950 font-serif">Dash Star</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block mb-1"></span>
              </div>
              <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold -mt-1">
                Grow with us
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About us' },
              { id: 'products', label: 'Our Products' },
              { id: 'wishlist', label: `Wishlist (${totalWishlistCount})` },
              { id: 'exhibition', label: 'Exhibition' },
              { id: 'contact', label: 'Contact us' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id as any)}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-indigo-900 bg-indigo-50 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-indigo-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* AI Search Trigger */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-colors group cursor-pointer"
              title="Search with AI semantic search"
            >
              <Search className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span className="hidden sm:inline">AI Search</span>
              <span className="hidden lg:inline text-[10px] bg-white text-indigo-600 px-1.5 py-0.5 rounded-full font-bold shadow-2xs">
                NLP
              </span>
            </button>

            {/* AI Shopping Assistant Button */}
            <button
              onClick={handleAI}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Ask StarBot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('wishlist')}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${totalWishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-slate-800 bg-amber-400 hover:bg-amber-500 rounded-full font-bold transition-all shadow-xs cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 bg-indigo-950 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Button */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-full border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer"
                  title={`Signed in as ${user.displayName || user.email}`}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-900 text-amber-400 flex items-center justify-center text-xs font-bold">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 hover:text-indigo-950 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors cursor-pointer"
                  title="Sign in with Google"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user.displayName || 'Toy Enthusiast'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('wishlist');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>My Wishlist ({totalWishlistCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 cursor-pointer font-medium border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About us' },
            { id: 'products', label: 'Our Products' },
            { id: 'wishlist', label: `Wishlist (${totalWishlistCount})` },
            { id: 'exhibition', label: 'Exhibition' },
            { id: 'contact', label: 'Contact us' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onNavigate(tab.id as any);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg ${
                activeTab === tab.id
                  ? 'text-indigo-900 bg-indigo-50 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {!user ? (
              <button
                onClick={() => {
                  signInWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-indigo-950 text-white rounded-lg"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Sign In with Google</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-slate-100 text-rose-600 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.displayName || user.email})</span>
              </button>
            )}
            <button
              onClick={() => {
                handleArchLab();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold bg-sky-50 text-sky-900 border border-sky-200 rounded-lg"
            >
              <Cpu className="w-4 h-4 text-sky-600" />
              Explore Full Tech Architecture & ML Specs
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

