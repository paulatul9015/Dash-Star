import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck,
  Truck
} from 'lucide-react';

export const ContactUsView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Order Tracking & Delivery',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            GET IN TOUCH WITH US
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Contact Dash Star Customer Desk
          </h1>
          <p className="text-sm text-slate-600">
            Have questions about battery maintenance, assembly guidance, order status, or spare parts? We’re here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-950 text-white rounded-3xl p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold font-serif text-amber-300">
                Factory & Administrative Office
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Manufacturing Plant Address</span>
                    <span>18/38, Sahibabad Industrial Area Site-4, Ghaziabad, Uttar Pradesh - 201010</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Customer Support & Wholesale Desk</span>
                    <a href="tel:+919599811712" className="hover:text-amber-300 transition-colors block">
                      +91-9599811712
                    </a>
                    <a href="tel:+919599811713" className="hover:text-amber-300 transition-colors block">
                      +91-9599811713
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Official Email</span>
                    <a href="mailto:sales.dashstar@gmail.com" className="hover:text-amber-300 transition-colors">
                      sales.dashstar@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Working Hours</span>
                    <span>Monday - Saturday: 9:00 AM to 7:00 PM IST (Sunday Closed)</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp button */}
              <div className="pt-4 border-t border-indigo-900">
                <a
                  href="https://wa.me/919599811712?text=Hello%20Dash%20Star,%20I%20need%20assistance%20with%20a%20ride-on%20toy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Support Desk</span>
                </a>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <Truck className="w-6 h-6 text-indigo-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Pan-India Express</span>
                  <span className="text-slate-500">Fast insured road transport</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Genuine Spares</span>
                  <span className="text-slate-500">Batteries, motors & chargers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Support Message Form */}
          <div className="lg:col-span-7 bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-500 mb-6">
              Our service engineering team responds to all consumer inquiries within 2 hours.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-950">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-800">
                  Thank you, <strong>{form.name}</strong>. A support executive will contact you at <strong>{form.phone || form.email}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                    >
                      <option>Order Tracking & Delivery</option>
                      <option>Battery & Charger Technical Support</option>
                      <option>Product Assembly Assistance</option>
                      <option>Spare Parts & Replacement Request</option>
                      <option>B2B Wholesale / Bulk Purchase</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details such as toy model name (e.g. DUCATTI, HUMR EV) or order ID..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send Customer Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
