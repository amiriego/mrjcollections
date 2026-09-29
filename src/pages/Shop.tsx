import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category, SUBCATEGORIES } from '../types';
import { ProductCard } from '../components/ProductCard';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc';

export const Shop: React.FC = () => {
  const { products, loadingProducts } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  const subcategoryParam = searchParams.get('subcategory') || 'all';
  const hotParam = searchParams.get('hot') === 'true';
  const searchQuery = searchParams.get('q') || '';
  const sortParam = (searchParams.get('sort') as SortOption) || 'newest';

  const selectedCategory: 'all' | Category =
    categoryParam === 'male' ||
    categoryParam === 'female' ||
    categoryParam === 'unisex'
      ? categoryParam
      : 'all';

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') {
      const combined = new Set<string>([
        ...SUBCATEGORIES.male,
        ...SUBCATEGORIES.female,
        ...SUBCATEGORIES.unisex,
      ]);
      return Array.from(combined);
    }
    return SUBCATEGORIES[selectedCategory];
  }, [selectedCategory]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'false') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key === 'category') {
      next.delete('subcategory');
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (
        subcategoryParam !== 'all' &&
        item.subcategory.toLowerCase() !== subcategoryParam.toLowerCase()
      ) {
        return false;
      }
      if (hotParam && !item.hotSelling) {
        return false;
      }
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.subcategory.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q) &&
        !(item.colors && item.colors.some((c) => c.toLowerCase().includes(q)))
      ) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;

      if (sortParam === 'price_asc') {
        return priceA - priceB;
      }
      if (sortParam === 'price_desc') {
        return priceB - priceA;
      }
      if (sortParam === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    products,
    selectedCategory,
    subcategoryParam,
    hotParam,
    searchQuery,
    sortParam,
  ]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    subcategoryParam !== 'all' ||
    hotParam ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-10">
      {/* Page Header */}
      <div className="border-b border-[#0A0A0A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-mono-tabular text-[#9E7B32] mb-1">
            c/o Mr. J Collections · Tarkwa, Ghana
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A0A0A]">
            "CATALOG INDEX"
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#52514E] font-mono-tabular">
          Showing {filteredProducts.length} of {products.length} items
        </p>
      </div>

      {/* Architectural Filter & Search Bar */}
      <div className="bg-[#FFFFFF] border border-[#0A0A0A] p-5 rounded-none space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'male', label: '"MALE"' },
                { id: 'female', label: '"FEMALE"' },
                { id: 'unisex', label: '"UNISEX"' },
              ] as const
            ).map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => updateParam('category', tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-none border transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#0A0A0A] text-[#F6F5F0] border-[#0A0A0A]'
                      : 'bg-[#F6F5F0] text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            {/* Combinable Hot Selling Toggle */}
            <button
              type="button"
              onClick={() => updateParam('hot', hotParam ? null : 'true')}
              className={`px-4 py-2 text-xs font-bold rounded-none border transition-colors whitespace-nowrap ${
                hotParam
                  ? 'bg-[#C5A059] text-[#0A0A0A] border-[#0A0A0A]'
                  : 'bg-[#FFFFFF] text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#F6F5F0]'
              }`}
            >
              "HOT SELLING"
            </button>
          </div>

          {/* Search Input by Product Name */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#52514E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value || null)}
              placeholder="Search by product name..."
              aria-label="Search products by name"
              className="w-full pl-10 pr-8 py-2 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] placeholder-[#686662] focus:outline-none focus:bg-[#FFFFFF]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => updateParam('q', null)}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52514E] hover:text-[#0A0A0A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subcategory & Sort Selectors */}
        <div className="pt-4 border-t border-[#0A0A0A]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="subcategory-select"
              className="text-xs font-semibold text-[#0A0A0A]"
            >
              Subcategory:
            </label>
            <select
              id="subcategory-select"
              value={subcategoryParam}
              onChange={(e) => updateParam('subcategory', e.target.value)}
              className="px-3.5 py-2 text-xs font-medium bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] focus:outline-none"
            >
              <option value="all">All Subcategories</option>
              {availableSubcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#9E7B32] hover:underline px-2 py-1 whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-select"
              className="text-xs font-semibold text-[#0A0A0A] whitespace-nowrap"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="px-3.5 py-2 text-xs font-medium bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name (A – Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-[4/4] bg-[#EAE8E1] border border-[#0A0A0A] rounded-none animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#0A0A0A] rounded-none p-12 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#0A0A0A]">
            "NO MATCHING ITEMS"
          </h2>
          <p className="text-sm text-[#52514E] max-w-md mx-auto">
            Clear your current filters or switch categories to explore more items
            from Mr. J Collections.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center justify-center px-6 py-3 text-xs font-bold bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition-colors rounded-none"
          >
            "VIEW ALL PRODUCTS"
          </button>
        </div>
      )}
    </div>
  );
};
