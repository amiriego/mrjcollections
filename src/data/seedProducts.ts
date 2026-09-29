import { Product } from '../types';
import heroEditorialImg from '../assets/images/hero_fashion_editorial_1790560008785.jpg';
import maleFashionImg from '../assets/images/category_male_fashion_1790560019796.jpg';
import femaleFashionImg from '../assets/images/category_female_fashion_1790560029898.jpg';
import unisexLuxuryImg from '../assets/images/category_unisex_luxury_1790560039864.jpg';
import sneakersLuxuryImg from '../assets/images/product_sneakers_luxury_1790560049932.jpg';
import streetwearBgImg from '../assets/images/streetwear_hero_background_1790561978655.jpg';

const freeTheYouthSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 640" width="800" height="640">
  <rect width="800" height="640" fill="#FFFFFF" />
  <defs>
    <clipPath id="ftyGlobeClip">
      <circle cx="400" cy="300" r="112" />
    </clipPath>
  </defs>

  <!-- Center Wireframe Globe -->
  <g stroke="#000000" stroke-width="4.5" fill="none" stroke-linecap="round">
    <g clip-path="url(#ftyGlobeClip)">
      <!-- Longitudinal Meridians -->
      <path d="M 400 188 C 350 222, 350 378, 400 412" />
      <path d="M 400 188 C 294 214, 294 386, 400 412" />
      <path d="M 400 188 C 450 222, 450 378, 400 412" />
      <path d="M 400 188 C 506 214, 506 386, 400 412" />

      <!-- Latitudinal Parallels -->
      <path d="M 284 216 Q 400 264 516 216" />
      <path d="M 284 256 Q 400 312 516 256" />
      <path d="M 284 344 Q 400 288 516 344" />
      <path d="M 284 384 Q 400 336 516 384" />
    </g>
    <circle cx="400" cy="300" r="112" />
  </g>

  <!-- Circular "FREE THE YOUTH" Serif Typography -->
  <g fill="#000000" font-family="Georgia, 'Times New Roman', Times, serif" font-weight="700" font-size="68" text-anchor="middle">
    <!-- FREE -->
    <g transform="translate(400, 300) rotate(-82) translate(0, -130)"><text transform="scale(1.12, 1)">F</text></g>
    <g transform="translate(400, 300) rotate(-56) translate(0, -130)"><text transform="scale(1.12, 1)">R</text></g>
    <g transform="translate(400, 300) rotate(-30) translate(0, -130)"><text transform="scale(1.12, 1)">E</text></g>
    <g transform="translate(400, 300) rotate(-4) translate(0, -130)"><text transform="scale(1.12, 1)">E</text></g>

    <!-- THE -->
    <g transform="translate(400, 300) rotate(34) translate(0, -130)"><text transform="scale(1.12, 1)">T</text></g>
    <g transform="translate(400, 300) rotate(62) translate(0, -130)"><text transform="scale(1.12, 1)">H</text></g>
    <g transform="translate(400, 300) rotate(89) translate(0, -130)"><text transform="scale(1.12, 1)">E</text></g>

    <!-- YOUTH -->
    <g transform="translate(400, 300) rotate(126) translate(0, -130)"><text transform="scale(1.12, 1)">Y</text></g>
    <g transform="translate(400, 300) rotate(153) translate(0, -130)"><text transform="scale(1.12, 1)">O</text></g>
    <g transform="translate(400, 300) rotate(181) translate(0, -130)"><text transform="scale(1.12, 1)">U</text></g>
    <g transform="translate(400, 300) rotate(208) translate(0, -130)"><text transform="scale(1.12, 1)">T</text></g>
    <g transform="translate(400, 300) rotate(235) translate(0, -130)"><text transform="scale(1.12, 1)">H</text></g>
  </g>
</svg>`;

export const FREE_THE_YOUTH_LOGO_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  freeTheYouthSvg
)}`;

export const BRAND_ASSETS = {
  backgroundBanner: streetwearBgImg,
  heroEditorial: FREE_THE_YOUTH_LOGO_URI,
  heroEditorialPhoto: heroEditorialImg,
  maleCategory: maleFashionImg,
  femaleCategory: femaleFashionImg,
  unisexCategory: unisexLuxuryImg,
  productSneakers: sneakersLuxuryImg,
};

export const INITIAL_SEED_PRODUCTS: Product[] = [
  {
    id: 'mrj-monochrome-leather-sneakers',
    name: 'Monochrome Low-Top Leather Sneakers',
    price: 480,
    discountPrice: 420,
    category: 'unisex',
    subcategory: 'Sneakers',
    description:
      'Crafted from supple full-grain black and bone-white calfskin leather with a cushioned vulcanized sole. Designed for effortless everyday wear across Tarkwa and beyond.',
    images: [sneakersLuxuryImg, heroEditorialImg],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: ['Black / Bone', 'Triple Black'],
    stockStatus: 'in_stock',
    hotSelling: true,
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-09-26T12:00:00.000Z',
  },
  {
    id: 'mrj-structured-noir-handbag',
    name: 'Noir Gold-Clasp Structured Handbag',
    price: 390,
    discountPrice: 340,
    category: 'female',
    subcategory: 'Handbags',
    description:
      'Architectural top-handle handbag finished in grained matte black leather with brushed gold hardware and detachable shoulder strap. Spacious interior with dual compartments.',
    images: [femaleFashionImg, unisexLuxuryImg],
    sizes: ['One Size'],
    colors: ['Obsidian Black', 'Warm Taupe'],
    stockStatus: 'in_stock',
    hotSelling: true,
    createdAt: '2026-09-21T11:30:00.000Z',
    updatedAt: '2026-09-26T14:00:00.000Z',
  },
  {
    id: 'mrj-heavyweight-crossbody-set',
    name: 'Tarkwa Executive Leather Cross Bag',
    price: 260,
    discountPrice: null,
    category: 'male',
    subcategory: 'Cross Bag',
    description:
      'Minimalist Pebble-leather cross-body messenger bag built for daily essentials. Features reinforced gunmetal zippers, adjustable woven strap, and water-resistant lining.',
    images: [maleFashionImg, heroEditorialImg],
    sizes: ['Standard'],
    colors: ['Matte Black'],
    stockStatus: 'in_stock',
    hotSelling: true,
    createdAt: '2026-09-22T09:15:00.000Z',
    updatedAt: '2026-09-26T15:00:00.000Z',
  },
  {
    id: 'mrj-amber-oud-extrait-perfume',
    name: 'Oud Royale & Ambergris Eau de Parfum (100ml)',
    price: 320,
    discountPrice: 280,
    category: 'unisex',
    subcategory: 'Perfumes',
    description:
      'Long-lasting niche fragrance opening with warm spiced bergamot and settling into rich smoked oud, Madagascar vanilla, and golden amber. Over 14 hours of projection.',
    images: [unisexLuxuryImg, heroEditorialImg],
    sizes: ['100ml'],
    colors: null,
    stockStatus: 'in_stock',
    hotSelling: true,
    createdAt: '2026-09-23T14:20:00.000Z',
    updatedAt: '2026-09-26T16:30:00.000Z',
  },
  {
    id: 'mrj-silk-drape-evening-gown',
    name: 'Tailored Midnight Short Evening Gown',
    price: 410,
    discountPrice: null,
    category: 'female',
    subcategory: 'Short Gowns',
    description:
      'Flattering figure-skimming short gown cut from breathable stretch crepe with a subtle structured shoulder and concealed back zip. Ideal for dinner dates and formal events.',
    images: [femaleFashionImg, heroEditorialImg],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Midnight Black', 'Champagne Gold'],
    stockStatus: 'in_stock',
    hotSelling: false,
    createdAt: '2026-09-24T08:45:00.000Z',
    updatedAt: '2026-09-26T17:00:00.000Z',
  },
  {
    id: 'mrj-heavyweight-essential-tee',
    name: '300GSM Heavyweight Boxy Plain T-Shirt',
    price: 160,
    discountPrice: 135,
    category: 'male',
    subcategory: 'Plain T-Shirts',
    description:
      'Ultra-soft 100% combed organic cotton T-shirt in a relaxed drop-shoulder silhouette. High-density ribbed collar that holds its shape wash after wash.',
    images: [maleFashionImg, sneakersLuxuryImg],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Jet Black', 'Chalk White', 'Sand Beige'],
    stockStatus: 'in_stock',
    hotSelling: true,
    createdAt: '2026-09-24T16:10:00.000Z',
    updatedAt: '2026-09-26T18:00:00.000Z',
  },
  {
    id: 'mrj-chronograph-gold-wristwatch',
    name: 'Sovereign Brushed-Gold Minimalist Wristwatch',
    price: 550,
    discountPrice: 490,
    category: 'unisex',
    subcategory: 'Wristwatch',
    description:
      'Precision quartz timepiece featuring a sunray black dial, scratch-resistant sapphire crystal glass, and stainless steel link bracelet with 18k gold PVD finish.',
    images: [unisexLuxuryImg, maleFashionImg],
    sizes: ['40mm Adjustable'],
    colors: ['Gold / Black Dial', 'Silver / Black Dial'],
    stockStatus: 'in_stock',
    hotSelling: true,
    createdAt: '2026-09-25T12:00:00.000Z',
    updatedAt: '2026-09-26T19:00:00.000Z',
  },
  {
    id: 'mrj-cloud-molded-slides',
    name: 'Architectural Matte Foam Recovery Slides',
    price: 190,
    discountPrice: null,
    category: 'unisex',
    subcategory: 'Slides',
    description:
      'Ergonomic single-piece EVA molded slides engineered for plush arch support and slip-resistant traction. Lightweight, waterproof, and built for everyday comfort.',
    images: [sneakersLuxuryImg, unisexLuxuryImg],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Onyx Black', 'Warm Bone'],
    stockStatus: 'in_stock',
    hotSelling: false,
    createdAt: '2026-09-25T15:40:00.000Z',
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    id: 'mrj-cuban-link-chain-set',
    name: '18K Gold-Plated Cuban Link Chain & Bracelet',
    price: 240,
    discountPrice: 210,
    category: 'male',
    subcategory: 'Chain/Bracelet',
    description:
      'Tarnish-free 316L stainless steel Cuban link neck chain paired with a matching box-clasp wrist bracelet. Water and sweat resistant for daily drip.',
    images: [maleFashionImg, unisexLuxuryImg],
    sizes: ['20 inch + 8 inch Bracelet'],
    colors: ['18K Gold Tone'],
    stockStatus: 'out_of_stock',
    hotSelling: false,
    createdAt: '2026-09-26T09:00:00.000Z',
    updatedAt: '2026-09-26T21:00:00.000Z',
  },
];
