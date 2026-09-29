import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, UserCheck, LogIn, UserPlus, LogOut } from 'lucide-react';
import { BUSINESS_INFO, getGenericWhatsAppLink } from '../types';
import { BrandBagEmblem } from './BrandLogo';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const {
    isAuthenticated,
    isAdminAuthenticated,
    currentUserEmail,
    currentUserName,
    logout,
  } = useStore();

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#0A0A0A] text-[#D0CEC7]">
      {/* Top Architectural Diagonal Hazard Stripe Band */}
      <div className="h-2.5 w-full offwhite-stripes-gold border-b border-white/15" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand Identity */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3.5">
              <BrandBagEmblem className="w-12 h-12 shrink-0 border border-white/20" />
              <div>
                <Link
                  to="/"
                  className="font-display text-xl font-extrabold text-[#F6F5F0] hover:text-[#C5A059] transition-colors block"
                >
                  {BUSINESS_INFO.name}™
                </Link>
                <p className="text-xs font-mono-tabular text-[#C5A059] mt-0.5">
                  "{BUSINESS_INFO.tagline}"
                </p>
              </div>
            </div>
            <p className="text-sm text-[#A8A6A1] leading-relaxed">
              c/o {BUSINESS_INFO.location}. Curated male, female, and unisex
              streetwear &amp; luxury fashion essentials. {BUSINESS_INFO.delivery}.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-xs font-mono-tabular font-bold text-[#F6F5F0] mb-4">
              "NAVIGATION"
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#C5A059] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C5A059] transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C5A059] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C5A059] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div>
            <h3 className="text-xs font-mono-tabular font-bold text-[#F6F5F0] mb-4">
              "DEPARTMENTS"
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/shop?category=male"
                  className="hover:text-[#C5A059] transition-colors"
                >
                  "MALE"
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=female"
                  className="hover:text-[#C5A059] transition-colors"
                >
                  "FEMALE"
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=unisex"
                  className="hover:text-[#C5A059] transition-colors"
                >
                  "UNISEX"
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?hot=true"
                  className="text-[#C5A059] hover:underline transition-colors"
                >
                  "HOT SELLING"
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Account Sign In / Sign Up */}
          <div>
            <h3 className="text-xs font-mono-tabular font-bold text-[#F6F5F0] mb-4">
              "ACCOUNT"
            </h3>
            {isAuthenticated && currentUserEmail ? (
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white/5 border border-white/15 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono-tabular text-[#C5A059]">
                    <UserCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>SIGNED IN</span>
                  </div>
                  <p className="text-xs font-semibold text-[#F6F5F0] truncate">
                    {currentUserName || currentUserEmail}
                  </p>
                  <p className="text-[11px] font-mono-tabular text-[#A8A6A1] truncate">
                    {currentUserEmail}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {isAdminAuthenticated && (
                    <Link
                      to="/admin/dashboard"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-[#0A0A0A] bg-[#C5A059] hover:bg-[#F6F5F0] transition-colors rounded-none whitespace-nowrap"
                    >
                      <span>"DASHBOARD"</span>
                    </Link>
                  )}

                  <Link
                    to="/auth?mode=signin"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-[#F6F5F0] bg-white/10 hover:bg-white/20 border border-white/20 transition-colors rounded-none whitespace-nowrap"
                  >
                    <span>"SWITCH ACCOUNT"</span>
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-[#EF5350] hover:text-white hover:bg-[#C62828] border border-[#EF5350]/40 transition-colors rounded-none whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>"SIGN OUT"</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <p className="text-xs text-[#A8A6A1] leading-relaxed">
                  Sign in to your account or create a new profile with Mr. J
                  Collections.
                </p>
                <div className="flex flex-col gap-2.5 pt-1">
                  <Link
                    to="/auth?mode=signin"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#0A0A0A] bg-[#F6F5F0] hover:bg-[#C5A059] transition-colors rounded-none whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>"SIGN IN"</span>
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#F6F5F0] bg-transparent hover:bg-[#F6F5F0] hover:text-[#0A0A0A] border border-white/30 transition-colors rounded-none whitespace-nowrap"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>"SIGN UP"</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Column 5: Direct Contact */}
          <div>
            <h3 className="text-xs font-mono-tabular font-bold text-[#F6F5F0] mb-4">
              "DISPATCH &amp; ORDERS"
            </h3>
            <div className="space-y-2.5 text-sm">
              <p className="text-[#F6F5F0] font-medium">{BUSINESS_INFO.location}</p>
              <p className="text-[#A8A6A1]">{BUSINESS_INFO.delivery}</p>
              <p>
                WhatsApp / Phone:{' '}
                <a
                  href={getGenericWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F6F5F0] hover:text-[#C5A059] transition-colors font-mono-tabular font-semibold"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </p>
              <p>
                Social:{' '}
                <span className="text-[#F6F5F0] font-mono-tabular">
                  {BUSINESS_INFO.socialHandle}
                </span>
              </p>
              <div className="pt-2">
                <a
                  href={getGenericWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#0A0A0A] bg-[#C5A059] hover:bg-[#F6F5F0] transition-colors rounded-none whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>"CHAT ON WHATSAPP"</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tabular text-[#8C8982]">
          <p>© 2026 Mr. J Collections. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/auth?mode=signin"
              className="text-[#F6F5F0] hover:text-[#C5A059] transition-colors"
            >
              "SIGN IN"
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              to="/auth?mode=signup"
              className="text-[#F6F5F0] hover:text-[#C5A059] transition-colors"
            >
              "SIGN UP"
            </Link>
            <span aria-hidden="true">·</span>
            <span>
              {BUSINESS_INFO.location} · Currency: {BUSINESS_INFO.currency}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
