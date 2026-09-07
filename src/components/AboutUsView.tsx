import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Factory, 
  HeartHandshake, 
  Sparkles, 
  Users, 
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AboutUsView: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-900 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>ESTABLISHED 1980s • GHAZIABAD, INDIA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Crafting Childhood Joy with Uncompromising Safety
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Dash Star has been one of India’s leading domestic manufacturers of kids’ ride-on toys, electric vehicles, tricycles, and baby walkers for over four decades.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
              title: 'BIS IS 9873 Certified',
              description: 'Strict adherence to Bureau of Indian Standards toy safety specifications, non-toxic food-grade virgin polymers, and rounded child-safe contours.'
            },
            {
              icon: <Factory className="w-8 h-8 text-indigo-600" />,
              title: 'In-House Injection Molding',
              description: 'State-of-the-art manufacturing facility in Sahibabad Industrial Area with precision CNC molds, robotic assembly lines, and battery testing jigs.'
            },
            {
              icon: <Award className="w-8 h-8 text-amber-500" />,
              title: 'ISO 9001:2015 Quality',
              description: 'Rigorous multi-stage quality control from raw pellet inspection to drop tests, load-bearing stress tests, and electrical circuit insulation.'
            },
            {
              icon: <HeartHandshake className="w-8 h-8 text-rose-500" />,
              title: 'Pan-India B2B Network',
              description: 'Trusted partner to over 2,500+ retail toy stores, department chains, and e-commerce platforms across 28 Indian states.'
            }
          ].map((pillar, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-md">
              <div className="mb-4 p-3 bg-white rounded-xl inline-block shadow-2xs">
                {pillar.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{pillar.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Manufacturing & Safety Story */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                OUR MANUFACTURING EXCELLENCE
              </span>

              <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
                Inside the Sahibabad Plant: Where Quality Meets Fun
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Located at 18/38, Sahibabad Industrial Area Site-4, Ghaziabad, our modern 50,000+ sq. ft. manufacturing campus produces thousands of ride-on toys each month. Every toy is engineered from the ground up to withstand rough Indian terrain, courtyard asphalt, and energetic kids.
              </p>

              <div className="space-y-3">
                {[
                  '100% Virgin Virgin Polypropylene (PP) and ABS — No hazardous recycled scrap plastics',
                  'Heavy-gauge powder-coated anti-corrosion tubular steel frames',
                  'Precision-engineered 12V motors with thermal overload protectors',
                  'Double-shielded sealed wiring harnesses preventing any short circuits'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"
                  alt="Dash Star Manufacturing Facility"
                  className="w-full h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
