import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [couponError, setCouponError] = useState('');

  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce((sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0), 0);
  const mrpTotal = safeCart.reduce((sum, item) => sum + (item?.product?.originalPrice || item?.product?.price || 0) * (item?.quantity || 0), 0);
  const totalSavings = mrpTotal - subtotal + discountApplied;
  const shippingThreshold = 1999;
  const isFreeShipping = subtotal >= shippingThreshold;
  const finalTotal = Math.max(0, subtotal - discountApplied);
  const totalItemCount = safeCart.reduce((s, i) => s + (i?.quantity || 0), 0);

  const applyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'DASHSTAR10') {
      const disc = Math.round(subtotal * 0.10);
      setDiscountApplied(disc);
    } else if (code === 'FESTIVE500' && subtotal >= 3000) {
      setDiscountApplied(500);
    } else {
      setCouponError('Invalid code or minimum order not met. Try DASHSTAR10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-900" />
            <h2 className="font-bold text-lg text-slate-900">Your Shopping Cart</h2>
            <span className="bg-indigo-50 text-indigo-900 font-extrabold text-xs px-2 py-0.5 rounded-full">
              {totalItemCount}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-5 py-3 bg-amber-50/80 border-b border-amber-100 text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>🎉 Congratulations! You have unlocked FREE Express Delivery!</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span>Add ₹{(shippingThreshold - subtotal).toLocaleString('en-IN')} more for <strong>FREE Delivery</strong></span>
                <span className="font-bold">{Math.round((subtotal / shippingThreshold) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Your cart is currently empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our best-selling electric jeeps, superbikes, swing cars, and walkers.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-indigo-950 text-white rounded-xl text-xs font-bold"
              >
                Browse Dash Star Toys
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex gap-3 items-center"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 object-cover rounded-xl bg-white p-1 border border-slate-200"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {item.product.name}
                  </h4>
                  {item.selectedColor && (
                    <span className="text-[11px] text-slate-500 block">
                      Color: {item.selectedColor}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-xs sm:text-sm text-indigo-950">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{item.product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
            {/* Coupon Box */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Coupon: DASHSTAR10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs uppercase font-bold outline-none focus:border-indigo-600"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-3 py-1.5 bg-indigo-950 text-white rounded-xl text-xs font-bold hover:bg-indigo-900"
                >
                  Apply
                </button>
              </div>
              {discountApplied > 0 && (
                <span className="text-[11px] text-emerald-700 font-bold block">
                  ✓ Extra ₹{discountApplied} discount applied!
                </span>
              )}
              {couponError && (
                <span className="text-[11px] text-rose-600 font-semibold block">{couponError}</span>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}.00</span>
              </div>
              {discountApplied > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountApplied.toLocaleString('en-IN')}.00</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-emerald-700">
                  {isFreeShipping ? 'FREE' : '₹150.00'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount (Incl. GST)</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-indigo-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Proceed to Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
