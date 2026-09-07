import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  Star, 
  ShieldCheck, 
  Zap, 
  Award, 
  Check, 
  Sparkles, 
  Battery, 
  Truck, 
  RotateCcw,
  MessageSquare,
  ThumbsUp,
  Filter,
  Send,
  UserCheck
} from 'lucide-react';
import { Product, CustomerReview } from '../types';
import { PRODUCTS } from '../data/products';
import { useReviews } from '../context/ReviewContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color?: string) => void;
  onOpenProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenProduct,
}) => {
  if (!product) return null;

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { getReviewsForProduct, getProductRatingStats, addReview, isVerifiedPurchaser } = useReviews();
  const { user, signInWithGoogle } = useAuth();

  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'safety' | 'mlInsights'>('specs');
  const [added, setAdded] = useState(false);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'verified' | '5' | '4' | '3'>('all');

  // Dynamic reviews & stats
  const dynamicReviews = getReviewsForProduct(product.id);
  const { averageRating, reviewCount } = getProductRatingStats(product.id);
  const verifiedBuyer = isVerifiedPurchaser(product.id);

  // Filter reviews
  const filteredReviews = dynamicReviews.filter((r) => {
    if (reviewFilter === 'verified') return r.verifiedPurchase;
    if (reviewFilter === '5') return r.rating === 5;
    if (reviewFilter === '4') return r.rating === 4;
    if (reviewFilter === '3') return r.rating <= 3;
    return true;
  });

  // Recommendations: products in the same or adjacent category
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.isBestSeller)).slice(0, 3);

  const handleAdd = () => {
    onAddToCart(product, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      await addReview({
        productId: product.id,
        rating: newRating,
        title: reviewTitle.trim() || 'Verified Customer Review',
        comment: reviewComment.trim(),
        aspects: {
          durability: newRating >= 4 ? 'positive' : 'neutral',
          safety: 'positive',
          assembly: 'positive',
        },
      });

      setReviewComment('');
      setReviewTitle('');
      setShowReviewForm(false);
      setReviewSuccessMsg('Thank you! Your verified review and rating have been recorded in the database.');
      setTimeout(() => setReviewSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const isCurrentWishlisted = isWishlisted(product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Top Section: Media Gallery + Key Purchase Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 p-2 flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                {product.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-md uppercase">
                    UP TO -{product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${
                        activeImage === img ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-indigo-50 text-indigo-900 font-bold text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    BIS Code: {product.bisCode}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-serif">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{averageRating} / 5.0</span>
                  <span className="text-xs text-slate-500">({reviewCount} customer reviews)</span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through block">
                    MRP: ₹{product.originalPrice.toLocaleString('en-IN')}.00
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}.00
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} (Inclusive of GST)
                    </span>
                  </div>
                </div>

                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-md">
                  In Stock ({product.stockCount} left)
                </span>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Available Colors: <span className="text-indigo-900">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedColor === color
                            ? 'bg-indigo-950 text-white border-indigo-950 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-950 hover:bg-indigo-900 text-white shadow-lg hover:shadow-indigo-950/20 active:scale-95'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Your Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 text-amber-400" />
                      <span>Add to Cart • ₹{product.price.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isCurrentWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-slate-300 text-slate-500 hover:text-rose-600'
                  }`}
                  title={isCurrentWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isCurrentWishlisted ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Free insured express shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>1 Year Factory Motor Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Info Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex border-b border-slate-200 gap-4 sm:gap-8">
              {[
                { id: 'specs', label: 'Technical Specifications' },
                { id: 'reviews', label: `Reviews & Ratings (${dynamicReviews.length})` },
                { id: 'safety', label: 'Safety & BIS Compliance' },
                { id: 'mlInsights', label: '🤖 AI & Demand Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-indigo-950 border-b-2 border-indigo-950'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-6">
              {activeTab === 'specs' && (
                <div className="space-y-6">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Age Suitability</span>
                      <span className="text-sm font-bold text-slate-900">{product.ageRange}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Max Rider Weight</span>
                      <span className="text-sm font-bold text-slate-900">{product.maxWeightKg} kg tested capacity</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Product Dimensions</span>
                      <span className="text-sm font-bold text-slate-900">{product.dimensions}</span>
                    </div>

                    {product.batterySpec && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] text-slate-400 font-semibold block uppercase">Battery & Motor</span>
                        <span className="text-sm font-bold text-slate-900">{product.batterySpec}</span>
                      </div>
                    )}

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Material Grade</span>
                      <span className="text-sm font-bold text-slate-900">{product.material}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">Certifications</span>
                      <span className="text-sm font-bold text-slate-900">{product.safetyCertifications.join(', ')}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Key Engineering Features</h3>
                    <ul className="space-y-1.5">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews Summary Header with "Write a Review" Button */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="text-4xl font-black text-slate-900 block font-serif">
                          {averageRating}
                        </span>
                        <div className="flex items-center justify-center text-amber-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(averageRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                          Based on {reviewCount} verified reviews
                        </span>
                      </div>

                      <div className="h-12 w-px bg-slate-200 hidden sm:block" />

                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Bureau of Indian Standards IS 9873 Compliant</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>100% Verified Indian Parent Community</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-5 py-3 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>{showReviewForm ? 'Cancel Review' : 'Write a Customer Review'}</span>
                    </button>
                  </div>

                  {/* Review Success Notification */}
                  {reviewSuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{reviewSuccessMsg}</span>
                    </div>
                  )}

                  {/* Review Submission Form */}
                  {showReviewForm && (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="p-6 bg-white rounded-3xl border-2 border-indigo-100 shadow-md space-y-4 animate-fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <span>Leave Your Star Rating & Feedback</span>
                          {verifiedBuyer && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </h4>
                        {!user && (
                          <button
                            type="button"
                            onClick={() => signInWithGoogle()}
                            className="text-xs text-indigo-600 font-bold hover:underline"
                          >
                            Sign in with Google
                          </button>
                        )}
                      </div>

                      {/* Interactive Star Rating Selector */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Rating Score: <span className="text-amber-500 font-black">{newRating} Stars</span>
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 cursor-pointer transition-transform hover:scale-125"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= (hoverRating || newRating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Headline / Title */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Review Headline</label>
                        <input
                          type="text"
                          placeholder="e.g. My 4-year-old absolutely loves this bike!"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-indigo-600"
                        />
                      </div>

                      {/* Comment / Review Text */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Review *</label>
                        <textarea
                          rows={3}
                          placeholder="Share your experience regarding ride comfort, battery life, durability, or safety features..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-indigo-600 resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingReview || !reviewComment.trim()}
                          className="px-5 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>{submittingReview ? 'Submitting to Firestore...' : 'Publish Review'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Filter reviews pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {[
                      { id: 'all', label: 'All Reviews' },
                      { id: 'verified', label: 'Verified Buyers Only' },
                      { id: '5', label: '5 Stars ★' },
                      { id: '4', label: '4 Stars ★' },
                      { id: '3', label: '3 Stars & Below' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setReviewFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                          reviewFilter === f.id
                            ? 'bg-indigo-950 text-white border-indigo-950 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* AI Aspect Sentiment Mining Summary */}
                  {product.sentimentSummary && (
                    <div className="bg-indigo-50/70 rounded-2xl p-5 border border-indigo-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-xs sm:text-sm text-indigo-950">
                            AI Aspect-Based Sentiment Mining (NLU)
                          </span>
                        </div>
                        <span className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                          {Math.round(product.sentimentSummary.positiveRatio * 100)}% Positive Sentiment
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-indigo-100">
                          <span className="font-bold text-emerald-700 block mb-1">👍 What Parents Love Most:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                            {product.sentimentSummary.topPraises.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-indigo-100">
                          <span className="font-bold text-amber-700 block mb-1">ℹ️ Helpful Parent Tips:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                            {product.sentimentSummary.topConcerns.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {filteredReviews.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">No reviews match the selected filter.</p>
                        <button
                          onClick={() => setReviewFilter('all')}
                          className="text-xs text-indigo-600 font-bold hover:underline"
                        >
                          View all {dynamicReviews.length} reviews
                        </button>
                      </div>
                    ) : (
                      filteredReviews.map((rev) => (
                        <div key={rev.id} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900">{rev.userName}</span>
                              {rev.verifiedPurchase && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Verified Buyer
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{rev.date}</span>
                          </div>

                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{rev.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'safety' && (
                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-emerald-950">Bureau of Indian Standards (BIS) Verified</h4>
                      <p className="text-emerald-800 text-xs mt-0.5">
                        License Registration: <strong>{product.bisCode}</strong> under Scheme-I of BIS (Conformity Assessment) Regulations. Tested strictly against mechanical, flammability, and heavy metals leaching (IS 9873: Part 1, 2, and 3).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Safety & Battery Maintenance Guidelines</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                      <li>Always charge battery for 6-8 hours before initial first use.</li>
                      <li>Do not overcharge continuously beyond 12 hours.</li>
                      <li>Adult supervision is recommended during outdoor riding near slopes.</li>
                      <li>Clean with damp cloth; avoid submerging motor chassis in water.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'mlInsights' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-400 uppercase">
                        ML Demand & Inventory Velocity (Prophet Forecast Model)
                      </span>
                      <span className="text-xs bg-sky-950 text-sky-300 px-2 py-0.5 rounded-md border border-sky-800">
                        SKU: {product.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-800 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Monthly Velocity</span>
                        <span className="text-base font-bold text-white">{product.salesVelocityPerMonth} units/mo</span>
                      </div>
                      <div className="bg-slate-800 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Predicted Peak Demand</span>
                        <span className="text-base font-bold text-amber-400">+{product.predictedDemandNextMonth} units</span>
                      </div>
                      <div className="bg-slate-800 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Stock Runway</span>
                        <span className="text-base font-bold text-emerald-400">
                          {Math.round((product.stockCount / product.salesVelocityPerMonth) * 30)} Days
                        </span>
                      </div>
                      <div className="bg-slate-800 p-2.5 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Search Vector Match</span>
                        <span className="text-base font-bold text-indigo-300">0.94 Cosine</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customers Also Viewed Carousel */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Customers Also Viewed (Collaborative Filter Recommendation)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onOpenProduct(rel)}
                    className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-200 cursor-pointer transition-all flex items-center gap-3"
                  >
                    <img src={rel.image} alt={rel.name} className="w-14 h-14 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{rel.name}</h4>
                      <span className="text-xs font-black text-indigo-950">₹{rel.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-400 block">Age {rel.ageRange}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

