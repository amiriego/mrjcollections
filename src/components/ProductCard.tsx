import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { Product, formatPrice, getOrderWhatsAppLink } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const primaryImage = product.images?.[0] || '';
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount =
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  return (
    <article className="group bg-[#FFFFFF] border border-[#0A0A0A] rounded-none flex flex-col transition-transform duration-150 hover:-translate-y-0.5">
      {/* Product Image Container (4:3 ratio) */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-[4/3] w-full bg-[#EAE8E1] border-b border-[#0A0A0A] overflow-hidden block"
      >
        {!imageError && primaryImage ? (
          <img
            src={primaryImage}
            alt={`${product.name} - ${product.category} ${product.subcategory} at Mr. J Collections Tarkwa`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-103"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EAE8E1]">
            <ShoppingBag className="w-8 h-8 text-[#0A0A0A]/50 mb-2" />
            <span className="text-xs font-medium text-[#52514E] line-clamp-2">
              {product.name}
            </span>
          </div>
        )}

        {/* Maximum 1 subtle status label in top-left corner */}
        {isOutOfStock ? (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-mono-tabular font-semibold bg-[#0A0A0A] text-[#F6F5F0]">
            "OUT OF STOCK"
          </span>
        ) : product.hotSelling ? (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-mono-tabular font-semibold bg-[#0A0A0A] text-[#C5A059] border border-[#C5A059]/60">
            "HOT SELLING"
          </span>
        ) : null}
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-1.5">
          {/* Clean unboxed metadata with typographic separator */}
          <div className="flex items-center gap-1.5 text-xs text-[#686662] capitalize">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.subcategory}</span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="block text-base font-bold text-[#0A0A0A] group-hover:text-[#9E7B32] transition-colors line-clamp-1"
          >
            "{product.name}"
          </Link>

          {/* Price in tabular numerals */}
          <div className="flex items-baseline gap-2.5 pt-1 font-mono-tabular">
            <span className="text-[15px] font-semibold text-[#0A0A0A]">
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#8C8982] line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Actions: View Product + Buy Now */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#0A0A0A]/15">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center px-3 py-2.5 text-xs font-semibold text-[#0A0A0A] bg-[#F6F5F0] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] border border-[#0A0A0A] transition-colors whitespace-nowrap truncate rounded-none"
          >
            View Product
          </Link>

          <a
            href={getOrderWhatsAppLink(product.name, effectivePrice)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-[#F6F5F0] bg-[#0A0A0A] hover:bg-[#C5A059] hover:text-[#0A0A0A] border border-[#0A0A0A] transition-colors whitespace-nowrap truncate rounded-none"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>"BUY NOW"</span>
          </a>
        </div>
      </div>
    </article>
  );
};
