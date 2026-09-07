import React from 'react';
import { CATEGORIES } from '../data/products';

interface CategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 6 Category Capsules Grid Matching PDF Page 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-lg ring-2 ring-indigo-500 scale-105'
                    : 'bg-[#E3E7EC] hover:bg-[#D9DEE5] text-slate-800 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Floating Cutout Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-2">
                  <img
                    src={cat.bannerImg}
                    alt={cat.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                {/* Capsule Label */}
                <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 group-hover:text-slate-950">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
