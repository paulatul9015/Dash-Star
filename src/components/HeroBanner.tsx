import React, { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onShopCategory?: (category: string) => void;
  onOpenAIAssistant?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopCategory,
  onOpenAIAssistant,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="relative w-full overflow-hidden bg-slate-900">
      {/* Slider Pagination Dot at Top Center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-md"></div>
        <div className="w-2 h-2 rounded-full bg-white/40"></div>
        <div className="w-2 h-2 rounded-full bg-white/40"></div>
      </div>

      {/* Hero Image Container */}
      <div className="relative w-full h-[320px] sm:h-[450px] md:h-[540px] lg:h-[620px] flex items-center justify-center overflow-hidden">
        {/* Yellow 4x4 Jeep Hero Image from PDF Screenshot */}
        <img
          src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1800&q=90"
          alt="Dash Star Yellow 4x4 Jeep"
          className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Top-Right Badge: Dash Star - Grow with us (Matching PDF Page 1) */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-20 bg-amber-400 text-indigo-950 px-3.5 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-xl flex flex-col items-center border border-amber-300">
          <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm tracking-tight font-serif">
            <span className="text-indigo-950 font-black">★ Dash Star</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-indigo-900 tracking-wider">
            Grow with us
          </span>
        </div>

        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      </div>
    </div>
  );
};
