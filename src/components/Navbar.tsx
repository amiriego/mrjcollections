import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { BUSINESS_INFO } from '../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [navSearch, setNavSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setNavSearch(searchParams.get('q') || '');
  }, [searchParams, location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = navSearch.trim();
    setMobileMenuOpen(false);
    if (trimmed) {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
  };

  const handleSearchChange = (value: string) => {
    setNavSearch(value);
    if (location.pathname === '/shop') {
      const next = new URLSearchParams(searchParams);
      if (value.trim()) {
        next.set('q', value);
      } else {
        next.delete('q');
      }
      navigate(`/shop?${next.toString()}`, { replace: true });
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F6F5F0]/95 backdrop-blur-md border-b border-[#0A0A0A]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-[#0A0A0A] hover:text-[#9E7B32] transition-colors whitespace-nowrap shrink-0"
        >
          {BUSINESS_INFO.name}™
        </Link>

        {/* Zone 2: 4 clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-semibold"
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  isActive
                    ? 'text-[#0A0A0A] border-[#0A0A0A]'
                    : 'text-[#52514E] border-transparent hover:text-[#0A0A0A]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Primary Search Bar & Shop Action */}
        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="hidden sm:flex items-center relative w-48 lg:w-64"
          >
            <Search className="w-3.5 h-3.5 text-[#52514E] absolute left-3 pointer-events-none" />
            <input
              type="search"
              value={navSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full pl-8 pr-7 py-2 text-xs font-medium bg-[#FFFFFF] border border-[#0A0A0A] rounded-none text-[#0A0A0A] placeholder-[#686662] focus:outline-none focus:border-[#9E7B32]"
            />
            {navSearch && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2 text-[#52514E] hover:text-[#0A0A0A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition-colors whitespace-nowrap shrink-0 rounded-none border border-[#0A0A0A]"
          >
            "SHOP NOW"
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] transition-colors rounded-none border border-[#0A0A0A] focus-visible:outline-2 focus-visible:outline-[#0A0A0A]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Search Bar */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F5F0] border-b border-[#0A0A0A] px-5 py-6 space-y-5">
          <form onSubmit={handleSearchSubmit} role="search" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#52514E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={navSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search sneakers, bags, perfumes..."
                aria-label="Search products"
                className="w-full pl-10 pr-4 py-3 text-xs font-medium bg-[#FFFFFF] border border-[#0A0A0A] rounded-none text-[#0A0A0A] placeholder-[#686662] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-3 text-xs font-bold bg-[#0A0A0A] text-[#F6F5F0] rounded-none whitespace-nowrap"
            >
              "SEARCH"
            </button>
          </form>

          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-lg font-display font-bold transition-colors ${
                    isActive ? 'text-[#9E7B32] underline underline-offset-4' : 'text-[#0A0A0A]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#0A0A0A]/20">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-5 py-3.5 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition-colors whitespace-nowrap rounded-none"
            >
              "SHOP NOW"
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
