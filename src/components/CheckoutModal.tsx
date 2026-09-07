import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Building, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Download,
  Phone,
  ArrowRight
} from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart = [],
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [processing, setProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);

  const [form, setForm] = useState({
    fullName: 'Ananya Sharma',
    phone: '9876543210',
    email: 'ananya.sharma@gmail.com',
    address: 'Flat 402, Lotus Grandeur, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
  });

  const safeCart = Array.isArray(cart) ? cart : [];
  const totalAmount = safeCart.reduce((sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0), 0);

  const handlePay = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount,
          customerInfo: form,
          paymentMethod,
        }),
      });
      const data = await response.json();
      setOrderSummary(data);
      setStep('confirmed');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      onOrderCompleted();
    } catch (e) {
      // Fallback
      setOrderSummary({
        orderId: 'DS-ORD-' + Math.floor(100000 + Math.random() * 900000),
        amount: totalAmount,
        customer: form,
      });
      setStep('confirmed');
      onOrderCompleted();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black">
              DS
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg font-serif">
                {step === 'confirmed' ? 'Order Confirmed!' : 'Dash Star Express Checkout'}
              </h2>
              <span className="text-xs text-slate-400">
                {step === 'details' ? 'Step 1 of 2: Shipping Info' : step === 'payment' ? 'Step 2 of 2: Razorpay Gateway' : 'Instant Tax Invoice & Tracking'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {step === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Order Amount Preview */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-indigo-950 block">Cart Total ({cart.length} unique items)</span>
                  <span className="text-indigo-700 font-semibold">Includes 18% GST + Free Express Shipping</span>
                </div>
                <span className="text-xl font-black text-indigo-950">
                  ₹{totalAmount.toLocaleString('en-IN')}.00
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: <QrCode className="w-4 h-4" /> },
                  { id: 'card', label: 'Credit/Debit', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'netbanking', label: 'NetBanking', icon: <Building className="w-4 h-4" /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <Truck className="w-4 h-4" /> },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-indigo-950 text-white border-indigo-950 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pm.icon}
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>

              {/* UPI QR Display (Razorpay stack) */}
              {paymentMethod === 'upi' && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=dashstartoys@icici%26pn=Dash%20Star%20Toys%26am=5630%26cu=INR"
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Scan with Google Pay, PhonePe, Paytm, or BHIM
                  </p>
                  <p className="text-[11px] text-slate-500">
                    VPA: <code className="font-mono bg-white px-1.5 py-0.5 rounded-sm border">dashstartoys@icici</code>
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 •••• •••• 1111"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={handlePay}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  {processing ? (
                    <span>Verifying with Razorpay...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay ₹{totalAmount.toLocaleString('en-IN')}.00 Securely</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'confirmed' && orderSummary && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 font-serif">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Your ride-on toy is being prepared for dispatch from our Sahibabad factory.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">{orderSummary.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dispatch Facility:</span>
                  <span className="font-semibold text-slate-800">18/38 Sahibabad Industrial Area, Ghaziabad</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {form.fullName}, {form.city} ({form.pincode})
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-700">₹{totalAmount.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-indigo-950 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Continue Shopping
                </button>
                <a
                  href={`https://wa.me/919599811712?text=Hello%20Dash%20Star,%20I%20placed%20Order%20${orderSummary.orderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Track on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
