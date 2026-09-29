export type Category = 'male' | 'female' | 'unisex';
export type StockStatus = 'in_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  category: Category;
  subcategory: string;
  description: string;
  images: string[];
  sizes: string[] | null;
  colors: string[] | null;
  stockStatus: StockStatus;
  hotSelling: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  price: number;
  discountPrice: number | null;
  category: Category;
  subcategory: string;
  description: string;
  images: string[];
  sizes: string[] | null;
  colors: string[] | null;
  stockStatus: StockStatus;
  hotSelling: boolean;
}

export const SUBCATEGORIES: Record<Category, string[]> = {
  male: [
    'Boxers & Singlets',
    'Slides',
    'Sneakers',
    'Plain T-Shirts',
    'Jeans',
    'Shorts',
    'Face Caps',
    'Belt',
    'Cross Bag',
    'Perfume Oil',
    'Chain/Bracelet',
  ],
  female: [
    'Slides',
    'Sneakers',
    'Handbags',
    'Perfume/Body Mist',
    'Wigs',
    'Hair Bonnets',
    'Lip Gloss/Makeup',
    'Short Gowns',
    'Tops & Leggings',
    'Underwear Set',
    'Jewelry Set',
    'Sunglasses',
  ],
  unisex: [
    'Perfumes',
    'Slides',
    'Sneakers',
    'Wristwatch',
    'Sunglasses',
    'Caps',
    'T-Shirts',
  ],
};

export const VALIDATION_LIMITS = {
  NAME_MAX: 150,
  SUBCATEGORY_MAX: 80,
  DESCRIPTION_MAX: 2000,
  IMAGES_MAX: 10,
  SIZES_MAX: 15,
  COLORS_MAX: 15,
  PRICE_MAX: 1000000,
  ID_PATTERN: /^[a-zA-Z0-9_\-]+$/,
} as const;

export const BUSINESS_INFO = {
  name: 'Mr. J Collections',
  location: 'Tarkwa, Ghana',
  delivery: 'Nationwide across Ghana',
  phone: '0594326515',
  whatsappNumber: '233594326515',
  whatsappBaseUrl: 'https://wa.me/233594326515',
  socialHandle: '@mr.j.collections',
  currency: 'GH₵',
  tagline: 'Your trusted fashion plug in Tarkwa',
  defaultEnquiryMessage: 'Hello Mr. J Collections, I would like to make an enquiry.',
} as const;

export function getGenericWhatsAppLink(customMessage?: string): string {
  const text = customMessage ?? BUSINESS_INFO.defaultEnquiryMessage;
  return `${BUSINESS_INFO.whatsappBaseUrl}?text=${encodeURIComponent(text)}`;
}

export function getOrderWhatsAppLink(productName: string, price: number): string {
  const message = `Hello Mr. J Collections, I want to order:\n\nProduct: ${productName}\nPrice: GH₵${price}\n\nPlease send me the payment details and delivery information.`;
  return `${BUSINESS_INFO.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(amount: number): string {
  return `${BUSINESS_INFO.currency}${amount.toLocaleString('en-GH', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
