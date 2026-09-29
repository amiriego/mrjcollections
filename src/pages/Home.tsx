import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO, getGenericWhatsAppLink } from '../types';
import { BRAND_ASSETS } from '../data/seedProducts';
import { ProductCard } from '../components/ProductCard';
import { BrandBagEmblem } from '../components/BrandLogo';
import { StreetwearBrandsShowcase } from '../components/StreetwearBrandsWall';

export const Home: React.FC = () => {
  const {
    products,
    loadingProducts,
    backgroundImage,
  } = useStore();
  const navigate = useNavigate();
  const [heroImgError, setHeroImgError] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');

  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = homeSearchQuery.trim();
    if (q) {
      navigate(`/shop?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/shop');
    }
  };

  const searchedProducts = useMemo(() => {
    const q = homeSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.colors && item.colors.some((c) => c.toLowerCase().includes(q)))
    );
  }, [products, homeSearchQuery]);

  const hotSellingProducts = products.filter((p) => p.hotSelling);

  const categories = [
    {
      key: 'male',
      index: '01.',
      title: '"MALE"',
      subtitle: 'Sneakers · Plain T-Shirts · Jeans · Cross Bags · Chains',
      image: BRAND_ASSETS.maleCategory,
      link: '/shop?category=male',
    },
    {
      key: 'female',
      index: '02.',
      title: '"FEMALE"',
      subtitle: 'Handbags · Short Gowns · Wigs · Slides · Perfumes',
      image: BRAND_ASSETS.femaleCategory,
      link: '/shop?category=female',
    },
    {
      key: 'unisex',
      index: '03.',
      title: '"UNISEX"',
      subtitle: 'Perfumes · Wristwatches · Sneakers · Slides · Sunglasses',
      image: BRAND_ASSETS.unisexCategory,
      link: '/shop?category=unisex',
    },
  ];

  return (
    <div className="pb-24 space-y-20">
      {/* Section 1: Architectural Streetwear Hero with Full-Bleed Background Image */}
      <section className="relative border-b border-[#0A0A0A] bg-[#0A0A0A] overflow-hidden">
        {/* Full-Bleed Hero Background Image */}
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Measured High-Contrast Scrim for WCAG AA Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/92 via-[#0A0A0A]/80 to-[#0A0A0A]/55" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: High-Contrast Streetwear Manifesto on Background */}
          <div className="lg:col-span-7 px-5 sm:px-8 lg:px-12 py-12 lg:py-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/20 space-y-10">
            {/* Provenance Row */}
            <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-5">
              <div className="flex items-center gap-3.5">
                <BrandBagEmblem className="w-12 h-12 shrink-0 border border-[#C5A059]" />
                <div className="text-xs font-mono-tabular text-[#F6F5F0]">
                  <p className="font-semibold">
                    {BUSINESS_INFO.name}™ c/o {BUSINESS_INFO.location}
                  </p>
                  <p className="text-[#C7C4BC] mt-0.5">
                    "{BUSINESS_INFO.tagline}" · {BUSINESS_INFO.delivery}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-16 h-4 offwhite-stripes-light shrink-0" />
            </div>

            {/* Dominant Display Headline */}
            <div className="space-y-6">
              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-wide text-[#F6F5F0] leading-[1.04]"
                style={{ textWrap: 'balance' }}
              >
                "YOUR STYLE. YOUR DRIP. YOUR COLLECTION."
              </h1>

              <p className="text-base sm:text-lg text-[#E0DDD5] max-w-[60ch] leading-relaxed">
                Curated streetwear, monochrome footwear, luxury fragrances,
                structured handbags, and statement timepieces from{' '}
                <strong className="text-[#C5A059] font-semibold">
                  {BUSINESS_INFO.name}
                </strong>{' '}
                in {BUSINESS_INFO.location}. Instant WhatsApp ordering with direct
                dispatch across Ghana.
              </p>

              {/* Primary Hero CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs font-bold tracking-wider bg-[#C5A059] text-[#0A0A0A] hover:bg-[#F6F5F0] hover:text-[#0A0A0A] border border-[#C5A059] transition-colors rounded-none whitespace-nowrap"
                >
                  <span>"SHOP NOW"</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={getGenericWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs font-bold tracking-wider bg-[#0A0A0A]/80 text-[#F6F5F0] hover:bg-[#F6F5F0] hover:text-[#0A0A0A] border border-[#F6F5F0] transition-colors rounded-none whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A059]" />
                  <span>"CHAT ON WHATSAPP"</span>
                </a>
              </div>
            </div>

            {/* Architectural Spec Footer Line */}
            <div className="pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tabular text-[#C7C4BC]">
              <span>Collection: Seasonal &amp; Permanent Archive</span>
              <span>Currency: {BUSINESS_INFO.currency} · Direct Checkout</span>
            </div>
          </div>

          {/* Right Column: Editorial Campaign Frame */}
          <div className="lg:col-span-5 bg-[#FFFFFF] relative flex flex-col justify-between overflow-hidden">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full w-full overflow-hidden flex flex-col justify-between bg-[#FFFFFF]">
              <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[#FFFFFF]">
                {!heroImgError ? (
                  <img
                    src={BRAND_ASSETS.heroEditorial}
                    alt="Free The Youth streetwear emblem at Mr. J Collections Tarkwa"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full max-h-[360px] object-contain object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-[#FFFFFF] text-[#0A0A0A]">
                    <BrandBagEmblem className="w-24 h-24 mb-4" />
                    <p className="font-display text-2xl font-bold">
                      {BUSINESS_INFO.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Lookbook 2026 Bar */}
              <div className="bg-[#0A0A0A] border-t border-[#0A0A0A] p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4 text-[#F6F5F0]">
                  <div className="space-y-1">
                    <p className="text-xs font-mono-tabular text-[#C5A059]">
                      "LOOKBOOK 2026"
                    </p>
                    <p className="font-display text-xl font-bold">
                      {BUSINESS_INFO.location} · {BUSINESS_INFO.socialHandle}
                    </p>
                  </div>
                  <span className="text-xs font-mono-tabular px-2.5 py-1 bg-[#0A0A0A] border border-[#C5A059] text-[#C5A059] whitespace-nowrap">
                    {BUSINESS_INFO.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streetwear Brands Wall Directly Beneath the Hero Background Image */}
      <StreetwearBrandsShowcase />

      {/* Customer Product Search Bar Section */}
      <section
        aria-label="Search Products"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 space-y-8"
      >
        <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] p-5 sm:p-7 rounded-none space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor="home-product-search"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#0A0A0A]"
            >
              "SEARCH PRODUCTS"
            </label>
            <span className="text-xs font-mono-tabular text-[#52514E]">
              Search by name, category, or style (e.g. Sneakers, Perfumes, Handbags, Watches)
            </span>
          </div>

          <form
            onSubmit={handleHomeSearchSubmit}
            role="search"
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#52514E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="home-product-search"
                type="search"
                value={homeSearchQuery}
                onChange={(e) => setHomeSearchQuery(e.target.value)}
                placeholder="Search for sneakers, slides, perfumes, handbags, t-shirts, watches..."
                className="w-full pl-11 pr-10 py-3.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] placeholder-[#686662] focus:outline-none focus:bg-[#FFFFFF]"
              />
              {homeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHomeSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52514E] hover:text-[#0A0A0A]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>"SEARCH CATALOG"</span>
            </button>
          </form>

          {/* Quick Search Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono-tabular text-[#52514E] mr-1">
              Popular:
            </span>
            {[
              'Sneakers',
              'Handbags',
              'Perfumes',
              'Wristwatch',
              'Plain T-Shirts',
              'Slides',
            ].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setHomeSearchQuery(term)}
                className={`px-3 py-1 text-xs font-semibold border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap ${
                  homeSearchQuery.toLowerCase() === term.toLowerCase()
                    ? 'bg-[#0A0A0A] text-[#F6F5F0]'
                    : 'bg-[#F6F5F0] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0]'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Instant Search Results Preview when typing on Homepage */}
        {homeSearchQuery.trim().length > 0 && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-4">
              <h3 className="font-display text-2xl font-extrabold text-[#0A0A0A]">
                "SEARCH RESULTS" ({searchedProducts.length})
              </h3>
              <button
                type="button"
                onClick={() => setHomeSearchQuery('')}
                className="text-xs font-bold text-[#9E7B32] hover:underline"
              >
                Clear Search
              </button>
            </div>

            {searchedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {searchedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-[#FFFFFF] border border-[#0A0A0A] p-8 text-center rounded-none space-y-2">
                <p className="text-sm font-bold text-[#0A0A0A]">
                  No products found matching "{homeSearchQuery}".
                </p>
                <p className="text-xs text-[#52514E]">
                  Try another keyword or browse all categories below.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Section 2: Category Lookbook Grid (Male / Female / Unisex) */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0A0A0A] pb-5">
          <div>
            <p className="text-xs font-mono-tabular text-[#9E7B32] mb-1">
              01. Curated Departments
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A0A0A]">
              "COLLECTIONS"
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0A0A0A] hover:text-[#9E7B32] transition-colors whitespace-nowrap"
          >
            <span>View Full Index</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="group relative aspect-[3/4] bg-[#0A0A0A] border border-[#0A0A0A] rounded-none overflow-hidden flex flex-col justify-between"
            >
              <img
                src={cat.image}
                alt={`${cat.title} streetwear and fashion collection at Mr. J Collections Tarkwa`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-103"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

              {/* Top Editorial Index */}
              <div className="relative z-10 p-5 flex items-center justify-between text-xs font-mono-tabular text-[#F6F5F0]">
                <span className="px-2.5 py-1 bg-[#0A0A0A]/90 border border-white/20">
                  {cat.index} Department
                </span>
              </div>

              {/* Bottom Title + Shop Now Button */}
              <div className="relative z-10 p-6 sm:p-7 space-y-3 border-t border-white/15 bg-black/50 backdrop-blur-xs">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F6F5F0]">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#E0DDD5] leading-relaxed">
                  {cat.subtitle}
                </p>
                <div className="pt-2">
                  <Link
                    to={cat.link}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wider bg-[#F6F5F0] text-[#0A0A0A] hover:bg-[#C5A059] transition-colors rounded-none whitespace-nowrap"
                  >
                    <span>"SHOP NOW"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Hot Selling Drops */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0A0A0A] pb-5">
          <div>
            <p className="text-xs font-mono-tabular text-[#9E7B32] mb-1">
              02. High-Demand Archive
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A0A0A]">
              "HOT SELLING"
            </h2>
          </div>
          <Link
            to="/shop?hot=true"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0A0A0A] hover:text-[#9E7B32] transition-colors whitespace-nowrap"
          >
            <span>View All Hot Selling</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="aspect-[4/4] bg-[#EAE8E1] border border-[#0A0A0A] rounded-none animate-pulse"
              />
            ))}
          </div>
        ) : hotSellingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {hotSellingProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#0A0A0A] p-10 text-center rounded-none space-y-4">
            <p className="text-base font-medium text-[#0A0A0A]">
              No Hot Selling items marked at the moment.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-[#0A0A0A] text-[#F6F5F0] rounded-none"
            >
              "BROWSE FULL CATALOG"
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};
