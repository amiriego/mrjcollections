import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  formatPrice,
  getOrderWhatsAppLink,
  getGenericWhatsAppLink,
  BUSINESS_INFO,
} from '../types';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();

  const product = products.find((p) => p.id === id);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [mainImgError, setMainImgError] = useState(false);

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 text-center space-y-5">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A0A0A]">
          "PRODUCT NOT FOUND"
        </h1>
        <p className="text-sm text-[#52514E]">
          The item you are looking for may have been removed or updated.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-[#0A0A0A] text-[#F6F5F0] rounded-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>"BACK TO SHOP"</span>
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [''];
  const activeImage = images[selectedImageIdx] || images[0];
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount =
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;
  const isInStock = product.stockStatus === 'in_stock';

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-10 lg:py-16 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0A0A0A] hover:text-[#9E7B32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>"BACK TO SHOP"</span>
        </Link>

        <div className="text-xs font-mono-tabular text-[#52514E] capitalize">
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#0A0A0A]">
            {product.category}
          </Link>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <span className="text-[#0A0A0A] font-medium">{product.subcategory}</span>
        </div>
      </div>

      {/* Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Image Gallery (Main + Thumbnails) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full bg-[#EAE8E1] border border-[#0A0A0A] rounded-none overflow-hidden">
            {!mainImgError && activeImage ? (
              <img
                src={activeImage}
                alt={`${product.name} - ${product.category} ${product.subcategory} at Mr. J Collections Tarkwa`}
                referrerPolicy="no-referrer"
                onError={() => setMainImgError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center">
                <ShoppingBag className="w-12 h-12 text-[#0A0A0A]/40 mb-3" />
                <p className="text-sm font-medium text-[#52514E]">{product.name}</p>
              </div>
            )}

            {product.hotSelling && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-mono-tabular font-semibold bg-[#0A0A0A] text-[#C5A059] border border-[#C5A059]">
                "HOT SELLING"
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {images.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => {
                    setSelectedImageIdx(idx);
                    setMainImgError(false);
                  }}
                  className={`aspect-[4/3] bg-[#EAE8E1] rounded-none overflow-hidden border transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#0A0A0A] ring-2 ring-[#0A0A0A]'
                      : 'border-[#0A0A0A]/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Specification Sheet & WhatsApp Purchase Controls */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#0A0A0A] p-6 sm:p-8 rounded-none space-y-6">
          {/* Unboxed Metadata: Category · Subcategory · Stock Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
            <div className="text-[#52514E] capitalize">
              <span>{product.category}</span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span>{product.subcategory}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 font-semibold">
              {isInStock ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B7A43]" />
                  <span className="text-[#1B7A43]">In Stock</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-[#C62828]" />
                  <span className="text-[#C62828]">Out of Stock</span>
                </>
              )}
            </div>
          </div>

          {/* Product Name & Price */}
          <div className="space-y-3 border-b border-[#0A0A0A] pb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] leading-snug">
              "{product.name}"
            </h1>

            <div className="flex items-baseline gap-3 font-mono-tabular">
              <span className="text-2xl font-bold text-[#0A0A0A]">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-[#8C8982] line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-[#0A0A0A]">Specification Notes</h2>
            <p className="text-sm text-[#3D3C39] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Sizes (if present) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0A0A0A]">Available Sizes</span>
                {selectedSize && (
                  <span className="font-mono-tabular text-[#9E7B32]">
                    Selected: {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(active ? null : size)}
                      className={`px-3.5 py-2 text-xs font-mono-tabular font-semibold rounded-none border transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#0A0A0A] text-[#F6F5F0] border-[#0A0A0A]'
                          : 'bg-[#F6F5F0] text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors (if present) */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0A0A0A]">Available Colors</span>
                {selectedColor && (
                  <span className="font-mono-tabular text-[#9E7B32]">
                    Selected: {selectedColor}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const active = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(active ? null : color)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-none border transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#0A0A0A] text-[#F6F5F0] border-[#0A0A0A]'
                          : 'bg-[#F6F5F0] text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0]'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Primary Actions: Buy Now (WhatsApp pre-filled order) + Chat on WhatsApp */}
          <div className="space-y-3 pt-4 border-t border-[#0A0A0A]">
            <a
              href={getOrderWhatsAppLink(product.name, effectivePrice)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>"BUY NOW" — {formatPrice(effectivePrice)}</span>
            </a>

            <a
              href={getGenericWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-wider bg-[#F6F5F0] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
            >
              <span>"CHAT ON WHATSAPP"</span>
            </a>
          </div>

          {/* Provenance Block */}
          <div className="pt-3 border-t border-[#0A0A0A]/15 text-xs font-mono-tabular text-[#52514E] space-y-1">
            <p>
              Origin: <span className="text-[#0A0A0A]">{BUSINESS_INFO.location}</span>
            </p>
            <p>
              Dispatch: <span className="text-[#0A0A0A]">{BUSINESS_INFO.delivery}</span>
            </p>
            <p>
              WhatsApp Desk: <span className="text-[#0A0A0A]">{BUSINESS_INFO.phone}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
