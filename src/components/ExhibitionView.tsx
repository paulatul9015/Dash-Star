import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Building2, 
  Send, 
  CheckCircle2, 
  Download, 
  Sparkles,
  Phone
} from 'lucide-react';

export const ExhibitionView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    storeType: 'Retail Toy Store',
    estimatedMonthlyVolume: '20 - 50 Units',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-bold">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>TRADE FAIRS & B2B WHOLESALE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Exhibitions & Dealer Partnerships
          </h1>

          <p className="text-sm sm:text-base text-slate-600">
            Meet the Dash Star leadership team at national and international toy expos, or apply below for authorized dealership & distribution across India.
          </p>
        </div>

        {/* Featured Trade Shows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'ToyBiz International B2B Expo',
              venue: 'Pragati Maidan, Hall 4, Stall B-12',
              location: 'New Delhi, India',
              date: 'Annual Trade Event',
              status: 'Featured Stall',
              image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
              highlight: 'Live showcase of 2026 12V Dual Motor EV Series & Swing Car lineup'
            },
            {
              title: 'Kids India International Fair',
              venue: 'Bombay Exhibition Centre (NESCO)',
              location: 'Mumbai, Maharashtra',
              date: 'Autumn Expo',
              status: 'Upcoming Stall',
              image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
              highlight: 'Exclusive dealer discount slabs & early booking festive allocations'
            },
            {
              title: 'Spielwarenmesse Toy Fair',
              venue: 'Messezentrum Exhibition Hall',
              location: 'Nuremberg, Germany',
              date: 'Global Trade Delegation',
              status: 'International Showcase',
              image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
              highlight: 'Promoting Made-in-India BIS compliant engineering to international buyers'
            }
          ].map((expo, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={expo.image}
                  alt={expo.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-indigo-950 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  {expo.status}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{expo.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{expo.venue}, {expo.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{expo.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                    {expo.highlight}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* B2B Dealer Inquiry Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              BECOME AN AUTHORIZED DEALER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif mt-1">
              Apply for Factory-Direct Wholesale Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Direct factory supply from our Sahibabad plant with Tier-1 margins, dealer display stands, and pan-India logistics support.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-emerald-950">B2B Dealership Request Received!</h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                Thank you, <strong>{formData.contactPerson}</strong> ({formData.businessName}). Our Sahibabad Sales Team will contact you within 4 business hours with our 2026 Wholesale Price List & GST Invoice Terms.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Business / Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wonder Toys Hub"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Verma"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sales@wondertoys.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    City & State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={formData.cityState}
                    onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Store Type
                  </label>
                  <select
                    value={formData.storeType}
                    onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  >
                    <option>Retail Toy Store</option>
                    <option>Multi-Brand Department Store</option>
                    <option>E-commerce Reseller</option>
                    <option>Regional Distributor / Wholesaler</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Message / Target Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about the models you are interested in (e.g. 12V Electric Bikes, Swing Cars)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Submit Wholesale Dealer Application</span>
                </button>

                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  ⚡ Immediate callback during factory hours (9am - 7pm IST)
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
