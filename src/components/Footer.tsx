import React from 'react';
import { 
  ArrowUp, 
  Facebook, 
  Instagram, 
  Youtube,
  ShoppingBag
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface FooterProps {
  onNavigate: (view: 'home' | 'products' | 'about' | 'exhibition' | 'contact') => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0E23] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12">
          {/* Col 1: Logo & Company Description (Matching PDF Page 3) */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex flex-col">
              <div className="flex items-center gap-1.5 text-white text-xl font-black font-serif">
                <span className="text-amber-400 text-lg">★</span>
                <span>Dash Star</span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider">
                Grow with us
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Dash Star has been one of the leading manufacturers in India for baby rides and toys since the 1980s. Our company is an ISO 9001:2015 certified company that specializes in manufacturing a wide range of attractive, fun, and innovative toys for children. Our products are in compliance with the safety standards of the Bureau of Indian Standards (BIS).
            </p>
          </div>

          {/* Col 2: Our Products (Matching PDF Page 3) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Our Products
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.name);
                      onNavigate('products');
                    }}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Address & Contact (Matching PDF Page 3) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Address
            </h3>

            <div className="space-y-2 text-xs text-slate-400">
              <p>
                18/38, Sahibabad Industrial Area Site-4, Ghaziabad, Uttar Pradesh-201010.
              </p>

              <p>
                <a href="tel:+919599811712" className="hover:text-white transition-colors">
                  +91-9599811712
                </a>
              </p>

              <p>
                <a href="tel:+919599811713" className="hover:text-white transition-colors">
                  +91-9599811713
                </a>
              </p>

              <p>
                <a href="mailto:sales.dashstar@gmail.com" className="hover:text-amber-400 transition-colors">
                  sales.dashstar@gmail.com
                </a>
              </p>

              {/* Social Icons matching screenshot */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Facebook className="w-3.5 h-3.5 fill-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-[#E1306C] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Youtube className="w-3.5 h-3.5 fill-white" />
                </a>
                <a
                  href="https://amazon.in"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-[#FF9900] text-slate-900 flex items-center justify-center font-bold text-[10px] hover:opacity-80 transition-opacity"
                >
                  a
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar with Scroll to Top */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="text-center sm:text-left">
            ©2025 Dash Star. All rights reserved || Developed by Viral Stance
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
