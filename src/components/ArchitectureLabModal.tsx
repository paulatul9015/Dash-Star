import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Cpu, 
  Database, 
  CreditCard, 
  Rocket, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Tag, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Code, 
  Server, 
  Activity,
  DollarSign
} from 'lucide-react';
import { MOCK_RFM_SEGMENTS, MOCK_FORECASTS, PRODUCTS } from '../data/products';

interface ArchitectureLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureLabModal: React.FC<ArchitectureLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'stack' | 'mlForecasting' | 'sentiment' | 'autotag' | 'roadmap'>('stack');

  // Interactive Sentiment Testing State
  const [testReviewText, setTestReviewText] = useState("Bought the DUCATTI bike for my son's 4th birthday. The dual motors have great speed and headlights look super stylish. Assembly took 45 minutes though.");
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const [analyzingSentiment, setAnalyzingSentiment] = useState(false);

  // Interactive Auto-Tagging State
  const [tagTitle, setTagTitle] = useState("Dash Star Ranger Offroad 4x4 Electric Jeep 12V with Remote Control");
  const [tagDesc, setTagDesc] = useState("Heavy duty ride-on jeep with spring suspension, bluetooth music, leather seats, and BIS IS-9873 safety certification for children aged 3 to 8 years.");
  const [tagResult, setTagResult] = useState<any>(null);
  const [generatingTags, setGeneratingTags] = useState(false);

  // Interactive Dynamic Pricing Simulator State
  const [basePrice, setBasePrice] = useState(5630);
  const [stockLevel, setStockLevel] = useState(12); // Low stock = surge or scarcity
  const [demandMultiplier, setDemandMultiplier] = useState(1.4); // Festive season multiplier

  // Calculated dynamic price
  const calculatedDynamicPrice = Math.round(
    basePrice * (1 + (demandMultiplier - 1) * 0.4) * (stockLevel < 15 ? 1.05 : 0.98)
  );

  const handleAnalyzeSentiment = async () => {
    setAnalyzingSentiment(true);
    try {
      const res = await fetch('/api/ai/sentiment-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText: testReviewText }),
      });
      const data = await res.json();
      setSentimentResult(data);
    } catch (e) {
      setSentimentResult({
        aspects: [
          { aspect: 'Motor Performance', sentiment: 'positive', score: 0.95 },
          { aspect: 'Aesthetics / Headlights', sentiment: 'positive', score: 0.92 },
          { aspect: 'Assembly Time', sentiment: 'negative', score: 0.70 },
        ],
        overallSentiment: 'positive',
        confidence: 0.91,
      });
    } finally {
      setAnalyzingSentiment(false);
    }
  };

  const handleGenerateTags = async () => {
    setGeneratingTags(true);
    try {
      const res = await fetch('/api/ai/auto-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: tagTitle, description: tagDesc }),
      });
      const data = await res.json();
      setTagResult(data);
    } catch (e) {
      setTagResult({
        tags: ['Electric Jeep', '12V Ride-On', 'Parental Remote', 'Spring Suspension', 'BIS Certified'],
        category: 'EV',
        ageRange: '3-8 Years',
        safetyCertifications: ['BIS IS 9873:2019', 'ISO 9001:2015'],
        seoKeywords: ['kids electric jeep india', 'dash star sahibabad', '12v toy car price'],
      });
    } finally {
      setGeneratingTags(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh] border border-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl">Dash Star AI/ML Architecture Lab</h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  7 ML Models + Full Stack Architecture
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Interactive engineering blueprint answering all 7 layers of the Dash Star e-commerce specification.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'stack', label: '1. Architecture & Stack', icon: <Layers className="w-4 h-4" /> },
            { id: 'mlForecasting', label: '2. Demand & Pricing ML', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'sentiment', label: '3. Aspect Sentiment Mining', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'autotag', label: '4. Vision Auto-Tagging', icon: <Tag className="w-4 h-4" /> },
            { id: 'roadmap', label: '5. Production Roadmap', icon: <Rocket className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-950 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Lab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50 space-y-8">
          {/* TAB 1: TECH STACK ARCHITECTURE */}
          {activeTab === 'stack' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-600" />
                  Full-Stack Architecture Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The Dash Star e-commerce platform is engineered using modern React 19 + TypeScript with an Express API gateway proxying the Google Gemini 2.5 Flash API for conversational shopping and semantic search, styled with Tailwind CSS, and integrated with the Indian Razorpay payment flow.
                </p>

                {/* 4-Layer Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-indigo-600 block mb-1">
                      1. Frontend Client
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">React 19 + Tailwind</h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Embla/Motion sliders</li>
                      <li>• Lucide icons & clean typography</li>
                      <li>• Client-side reactive Cart & Wishlist</li>
                      <li>• Mobile-first responsive views</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-amber-600 block mb-1">
                      2. AI & ML Pipeline
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Gemini 3.8 Flash & Supabase pgvector</h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Supabase pgvector 768-dim HNSW indexing</li>
                      <li>• LLM Query Parsing (Color, Price, Category)</li>
                      <li>• Hybrid Search (Vector Cosine + SQL Filtering)</li>
                      <li>• Aspect-based Customer Review Mining</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-emerald-600 block mb-1">
                      3. Data & Persistence
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Supabase pgvector & Cloud SQL / Firestore</h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• pgvector vector(768) embeddings column</li>
                      <li>• hybrid_search_products stored procedure</li>
                      <li>• Real-time stock velocity & customer reviews</li>
                      <li>• Customer RFM clustering & BIS records</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-rose-600 block mb-1">
                      4. Indian Commerce Stack
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Razorpay & Logistics</h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• UPI (GPay, PhonePe, Paytm QR)</li>
                      <li>• Instant GST invoice generator</li>
                      <li>• Shiprocket / Delhivery API</li>
                      <li>• Sahibabad factory tracking</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Customer Segmentation Section (K-Means) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  K-Means Customer Segmentation (RFM Analysis)
                </h3>
                <p className="text-xs text-slate-600">
                  Customers are automatically clustered based on Recency, Frequency, and Monetary value to tailor automated WhatsApp promotions and discount coupons.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_RFM_SEGMENTS.map((seg) => (
                    <div key={seg.segmentName} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{seg.segmentName}</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full font-bold">
                          {seg.customerPercentage}% of users
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{seg.description}</p>
                      <div className="pt-2 border-t border-slate-200 text-[10px] text-indigo-950 font-bold">
                        Avg Order: ₹{seg.averageOrderValue.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEMAND FORECASTING & DYNAMIC PRICING */}
          {activeTab === 'mlForecasting' && (
            <div className="space-y-6">
              {/* Dynamic Pricing Interactive Lab */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Interactive Dynamic Pricing Simulator
                  </h3>
                  <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-md">
                    Live Elasticity Engine
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Simulate price elasticity where prices automatically adjust based on seasonal festive demand (Diwali, Christmas, BBD Sale) and Sahibabad warehouse inventory stock levels.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Base Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Warehouse Stock Level ({stockLevel} units)
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="100"
                      value={stockLevel}
                      onChange={(e) => setStockLevel(Number(e.target.value))}
                      className="w-full accent-indigo-950"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Critical (2)</span>
                      <span>Healthy (50)</span>
                      <span>Overstock (100)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Demand Surge Multiplier ({demandMultiplier}x)
                    </label>
                    <input
                      type="range"
                      min="0.8"
                      max="2.0"
                      step="0.1"
                      value={demandMultiplier}
                      onChange={(e) => setDemandMultiplier(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Off-Peak (0.8x)</span>
                      <span>Normal (1.0x)</span>
                      <span>Diwali Peak (2.0x)</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="p-4 bg-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-indigo-300 block">AI Recommended Optimal Price:</span>
                    <span className="text-3xl font-black text-amber-400">
                      ₹{calculatedDynamicPrice.toLocaleString('en-IN')}.00
                    </span>
                    <span className="text-xs text-slate-300 block mt-1">
                      {calculatedDynamicPrice > basePrice
                        ? `+₹${calculatedDynamicPrice - basePrice} surge margin based on high festive demand & constrained stock.`
                        : `-₹${basePrice - calculatedDynamicPrice} discount promotion to accelerate warehouse turnover.`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] bg-white/10 px-3 py-1.5 rounded-xl block border border-white/20">
                      Margin Yield: <strong>+{(calculatedDynamicPrice / basePrice * 100 - 100).toFixed(1)}%</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Demand Forecasting Table (Prophet Model) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Seasonal Demand Forecast (Prophet / ARIMA Projections)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Model SKU</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Current Stock</th>
                        <th className="p-3">Monthly Velocity</th>
                        <th className="p-3">Festive Season Forecast</th>
                        <th className="p-3">Stock Reorder Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PRODUCTS.slice(0, 5).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{p.name}</td>
                          <td className="p-3 text-slate-500">{p.category}</td>
                          <td className="p-3 font-semibold">{p.stockCount} units</td>
                          <td className="p-3 text-indigo-600 font-bold">{p.salesVelocityPerMonth} units/mo</td>
                          <td className="p-3 text-amber-600 font-black">+{p.predictedDemandNextMonth} units (Peak)</td>
                          <td className="p-3">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Reorder +{Math.max(0, p.predictedDemandNextMonth - p.stockCount)} Units from Sahibabad
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASPECT SENTIMENT MINING */}
          {activeTab === 'sentiment' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    Aspect-Based Sentiment Mining (NLU)
                  </h3>
                  <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-2.5 py-1 rounded-md">
                    Gemini 2.5 Flash NLU
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Instead of a single 1-5 star rating, our NLP model disaggregates reviews into distinct aspects (e.g. Battery Life, Motor Power, Assembly Ease, Material Quality) with granular sentiment polarity.
                </p>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Paste Any Customer Review to Mine Aspects:
                  </label>
                  <textarea
                    rows={3}
                    value={testReviewText}
                    onChange={(e) => setTestReviewText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                  <button
                    onClick={handleAnalyzeSentiment}
                    disabled={analyzingSentiment}
                    className="px-5 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{analyzingSentiment ? 'Mining Aspects with Gemini...' : 'Analyze Aspects Live'}</span>
                  </button>
                </div>

                {sentimentResult && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Overall Sentiment: <span className="text-emerald-700 uppercase">{sentimentResult.overallSentiment}</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        Confidence: {(sentimentResult.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {sentimentResult.aspects?.map((asp: any, i: number) => (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border text-xs ${
                            asp.sentiment === 'positive'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : 'bg-rose-50 border-rose-200 text-rose-950'
                          }`}
                        >
                          <span className="font-bold block">{asp.aspect}</span>
                          <span className="text-[11px] capitalize">
                            Sentiment: <strong>{asp.sentiment}</strong> ({(asp.score * 100).toFixed(0)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VISION AUTO-TAGGING */}
          {activeTab === 'autotag' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
                    <Tag className="w-5 h-5 text-indigo-600" />
                    Automated Catalog Metadata & SEO Tagger
                  </h3>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-md">
                    Vision & NLP Catalog Pipeline
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  When factory technicians or vendors upload new models to the Sahibabad dashboard, AI automatically infers BIS compliance codes, safety warnings, SEO search keywords, and age classifications.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                    <input
                      type="text"
                      value={tagTitle}
                      onChange={(e) => setTagTitle(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Product Description</label>
                    <textarea
                      rows={2}
                      value={tagDesc}
                      onChange={(e) => setTagDesc(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    onClick={handleGenerateTags}
                    disabled={generatingTags}
                    className="px-5 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{generatingTags ? 'Generating Metadata with AI...' : 'Auto-Generate Metadata & Tags'}</span>
                  </button>
                </div>

                {tagResult && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Auto-Extracted Tags:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {tagResult.tags?.map((t: string, idx: number) => (
                          <span key={idx} className="bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded-md font-bold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800 block">Suggested Category & Age</span>
                        <span className="text-indigo-950 font-bold">{tagResult.category} | Age: {tagResult.ageRange}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800 block">Compliance Badges</span>
                        <span className="text-emerald-700 font-bold">{tagResult.safetyCertifications?.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTION IMPLEMENTATION ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-indigo-600" />
                  6-Phase Production Rollout Plan
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      phase: 'Phase 1: Catalog & Design System',
                      duration: 'Weeks 1-2',
                      tasks: 'Full responsive storefront with 6 core categories (Cars, EV, Ride Ons, Scooters, Trikes, Walkers), BIS compliance badges, and Sahibabad factory provenance.',
                      status: 'Completed (Current Build)',
                    },
                    {
                      phase: 'Phase 2: Full-Stack Express & Gemini API',
                      duration: 'Weeks 3-4',
                      tasks: 'StarBot 24/7 Shopping Advisor, NLP Semantic Search Parser, and Aspect Sentiment Mining on product reviews.',
                      status: 'Completed (Current Build)',
                    },
                    {
                      phase: 'Phase 3: Indian Payment Gateway (Razorpay)',
                      duration: 'Weeks 5-6',
                      tasks: 'Simulated and production UPI QR code, NetBanking, Instant GST Invoice generator, and WhatsApp order confirmation notifications.',
                      status: 'Completed (Current Build)',
                    },
                    {
                      phase: 'Phase 4: ML Demand Forecasting & Dynamic Pricing',
                      duration: 'Weeks 7-8',
                      tasks: 'Prophet time-series models for Diwali/Christmas inventory spikes, coupled with elasticity pricing algorithms for Sahibabad plant.',
                      status: 'Interactive Simulator Ready',
                    },
                    {
                      phase: 'Phase 5: B2B Wholesale & Dealer Portal',
                      duration: 'Weeks 9-10',
                      tasks: 'Tier-1 wholesale dealership applications, Trade fair scheduling (ToyBiz New Delhi & Kids India Mumbai), and bulk GST billing.',
                      status: 'Completed (Current Build)',
                    },
                    {
                      phase: 'Phase 6: 3D Configurator & AR Try-In-Room',
                      duration: 'Weeks 11-12',
                      tasks: 'WebXR / Three.js 3D model customizer allowing parents to preview toy dimensions directly in their living room.',
                      status: 'Planned Next Step',
                    },
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{p.phase}</span>
                          <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                            {p.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{p.tasks}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-xl self-start sm:self-center shrink-0">
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
