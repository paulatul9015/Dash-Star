import React from 'react';

interface PromoBannerProps {
  onViewCollections: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onViewCollections }) => {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Autumn Promo Banner Matching PDF Page 3 */}
        <div className="relative rounded-3xl bg-[#B8C2AA] text-slate-900 p-8 sm:p-12 lg:p-14 overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headings & Button */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900 block">
                PLAYTIME JUST GOT CUTER!
              </span>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 leading-tight tracking-tight">
                Get ready for a fun-filled autumn with our adorable baby toys!
              </h2>

              <div className="pt-3">
                <button
                  onClick={onViewCollections}
                  className="px-7 py-3 bg-[#E58F3B] hover:bg-[#D57F2B] text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  View All Collections
                </button>
              </div>
            </div>

            {/* Right Column: Kids on Toy Cars on Wooden Floor with ABC Blocks */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80"
                  alt="Kids playing with baby ride-on toys and ABC blocks"
                  className="w-full h-56 sm:h-64 object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
