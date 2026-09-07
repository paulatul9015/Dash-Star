import React from 'react';
import { Product } from '../types';

interface SpotlightBannerProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const SpotlightBanner: React.FC<SpotlightBannerProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Red DUCATTI Feature Banner Matching PDF Page 2 */}
        <div className="relative rounded-3xl bg-[#7D1115] text-white p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl">
          {/* Subtle Decorative Background Stars */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-1/4 right-1/4 text-amber-300 text-xl font-black">★</div>
            <div className="absolute bottom-1/3 right-12 text-rose-300 text-2xl font-black">✦</div>
            <div className="absolute bottom-8 right-1/3 text-blue-300 text-3xl font-black">★</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: DUCATTI Branding, Quote & Large Bike Cutout */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              {/* Dash Star Logo at Top */}
              <div className="inline-flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-white text-sm sm:text-base font-black tracking-tight font-serif">
                  <span className="text-amber-400 text-lg">★</span>
                  <span>Dash Star</span>
                </div>
                <span className="text-[10px] text-rose-200 tracking-wider">
                  Grow with us
                </span>
              </div>

              {/* Stylized DUCATTI Title */}
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-wider text-white uppercase font-sans">
                DUCATTI
              </h2>

              {/* Exact Subtitle Quote from PDF */}
              <p className="text-xs sm:text-sm lg:text-base text-rose-100 italic max-w-lg leading-relaxed font-light">
                "Unleash your little one's inner racer with the ultimate electric ride-on. Built for safety, designed for style, and ready for every backyard adventure."
              </p>

              {/* Large Left Bike Cutout */}
              <div className="relative w-full max-w-md h-52 sm:h-72 mt-4 flex items-center justify-center">
                <img
                  src={product.image}
                  alt="DUCATTI Ride-on Superbike"
                  className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => onQuickView(product)}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Column: Floating White Product Card with Mint Cloud & Stars */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                onClick={() => onQuickView(product)}
                className="relative w-full max-w-xs sm:max-w-sm bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl cursor-pointer hover:scale-102 transition-transform duration-300 flex flex-col items-center"
              >
                {/* Decorative Mint Cloud Illustration */}
                <div className="absolute top-1/4 -left-6 w-16 h-12 bg-[#BCE3C5] rounded-full filter blur-[1px] opacity-80 pointer-events-none" />
                <div className="absolute top-1/3 -left-3 w-12 h-10 bg-[#A6D8B2] rounded-full opacity-80 pointer-events-none" />
                
                {/* Decorative Golden Star */}
                <div className="absolute bottom-10 left-4 text-amber-400 text-xl pointer-events-none">★</div>
                <div className="absolute bottom-4 right-6 text-blue-500 text-lg pointer-events-none">✦</div>

                {/* Top Badge */}
                <div className="w-full flex justify-start mb-2">
                  <span className="bg-[#4834D4] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    UP TO -15%
                  </span>
                </div>

                {/* Product Cutout Image */}
                <div className="w-full h-44 sm:h-52 flex items-center justify-center my-2">
                  <img
                    src={product.image}
                    alt="DUCATTI Superbike"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Card Title & Price */}
                <div className="text-center mt-2">
                  <h4 className="text-sm font-extrabold text-[#7D1115] uppercase tracking-wide">
                    DUCATTI
                  </h4>
                  <div className="flex items-center justify-center gap-2 mt-1 text-xs sm:text-sm">
                    <span className="text-slate-400 line-through text-xs">
                      ₹6,625.00
                    </span>
                    <span className="font-bold text-slate-800">
                      ₹5,630.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
