/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { STREETWEAR_BRANDS_WALLPAPER_URI } from './components/StreetwearBrandsWall';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#0A0A0A] border border-[#0A0A0A] text-[#F6F5F0] text-xs font-semibold rounded-none shadow-xl"
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#EF5350] shrink-0" />
            ) : t.type === 'info' ? (
              <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#66BB6A] shrink-0" />
            )}
            <span>{t.title}</span>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
            className="text-[#A8A6A1] hover:text-[#F6F5F0]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const AppShell: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F6F5F0] text-[#0A0A0A]">
      {/* Fixed Full-Viewport Streetwear Brands Background Layer Beneath Page */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FFFFFF]"
      >
        <img
          src={STREETWEAR_BRANDS_WALLPAPER_URI}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-15"
        />
        {/* Subtle Chalk Scrim so foreground content remains legible while showcasing the streetwear logos beneath */}
        <div className="absolute inset-0 bg-[#F6F5F0]/75" />
      </div>

      {/* Foreground Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <ToastContainer />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AdminLogin />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppShell />
      </BrowserRouter>
    </StoreProvider>
  );
}
