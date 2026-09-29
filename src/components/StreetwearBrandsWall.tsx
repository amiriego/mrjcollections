import React from 'react';

const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 830" width="1200" height="830">
  <rect width="1200" height="830" fill="#FFFFFF" />

  <!-- ROW 1 -->
  <!-- 1. Supreme -->
  <g transform="translate(50, 56)">
    <rect x="0" y="0" width="282" height="100" fill="#E41E26" />
    <text x="141" y="70" text-anchor="middle" fill="#FFFFFF" font-family="Helvetica Neue, Arial, sans-serif" font-weight="900" font-style="italic" font-size="60" letter-spacing="-1.5">Supreme</text>
  </g>

  <!-- 2. NIKE -->
  <g transform="translate(376, 48)">
    <text x="34" y="60" fill="#0A0A0A" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-style="italic" font-size="64" letter-spacing="1">NIKE</text>
    <path d="M 28 45 C 8 78 -4 108 15 120 C 34 132 72 115 228 46 C 145 72 68 88 45 78 C 30 72 24 58 28 45 Z" fill="#0A0A0A" />
  </g>

  <!-- 3. adidas Trefoil -->
  <g transform="translate(650, 26)">
    <!-- Center leaf -->
    <path d="M 85 0 C 62 32 62 78 85 110 C 108 78 108 32 85 0 Z" fill="#0A0A0A" />
    <!-- Left leaf -->
    <path d="M 5 42 C 12 82 44 106 80 110 C 68 74 42 48 5 42 Z" fill="#0A0A0A" />
    <!-- Right leaf -->
    <path d="M 165 42 C 158 82 126 106 90 110 C 102 74 128 48 165 42 Z" fill="#0A0A0A" />
    <!-- Three white horizontal stripes cutting across trefoil base -->
    <rect x="0" y="74" width="170" height="5.5" fill="#FFFFFF" />
    <rect x="0" y="85" width="170" height="5.5" fill="#FFFFFF" />
    <rect x="0" y="96" width="170" height="5.5" fill="#FFFFFF" />
    <!-- adidas wordmark -->
    <text x="85" y="152" text-anchor="middle" fill="#0A0A0A" font-family="Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="48" letter-spacing="-1">adidas</text>
    <text x="163" y="128" fill="#0A0A0A" font-family="Arial, sans-serif" font-weight="700" font-size="11">®</text>
  </g>

  <!-- 4. BAPE -->
  <g transform="translate(920, 42)">
    <path id="bapeArc" d="M 5 65 Q 92 18 180 65" fill="none" />
    <text fill="#0A0A0A" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="52" letter-spacing="3">
      <textPath href="#bapeArc" startOffset="50%" text-anchor="middle">BAPE</textPath>
    </text>
    <!-- Ape head silhouette -->
    <path d="M 92 70 C 72 70 62 84 60 104 C 55 112 54 128 58 142 C 62 162 74 176 92 178 C 110 176 122 162 126 142 C 130 128 129 112 124 104 C 122 84 112 70 92 70 Z" fill="#0A0A0A" />
    <!-- Inner face highlight -->
    <path d="M 80 96 L 100 96 L 98 103 L 82 103 Z" fill="#FFFFFF" />
    <path d="M 88 110 C 80 112 75 120 77 128 C 80 135 95 135 100 126 C 102 118 96 110 88 110 Z" fill="#FFFFFF" />
    <path d="M 83 122 L 95 120 L 93 126 L 83 126 Z" fill="#0A0A0A" />
    <circle cx="123" cy="172" r="5" fill="none" stroke="#0A0A0A" stroke-width="1.5" />
    <text x="123" y="175" text-anchor="middle" fill="#0A0A0A" font-family="Arial, sans-serif" font-weight="700" font-size="7">R</text>
  </g>

  <!-- ROW 2 -->
  <!-- 5. OFF-WHITE chamfered badge -->
  <g transform="translate(52, 232)">
    <polygon points="18,0 280,0 280,38 262,56 0,56 0,18" fill="#0A0A0A" />
    <text x="140" y="39" text-anchor="middle" fill="#FFFFFF" font-family="Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="33" letter-spacing="1.5">OFF-WHITE</text>
  </g>

  <!-- 6. Stüssy signature -->
  <g transform="translate(390, 200)">
    <path d="M 62 5 L 48 115 M 10 42 L 130 42 M 38 78 C 8 85 5 68 35 64 C 65 60 72 95 45 110 C 25 118 18 105 32 95 M 78 58 L 68 112 M 94 65 C 90 95 102 98 108 68 L 102 108 M 125 65 C 110 72 135 88 115 105 M 148 65 C 132 72 158 88 138 105 M 155 68 L 148 98 C 146 108 158 105 166 60 L 160 142" fill="none" stroke="#0A0A0A" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="76" cy="28" r="4.5" fill="#0A0A0A" />
    <circle cx="90" cy="28" r="4.5" fill="#0A0A0A" />
  </g>

  <!-- 7. PALACE Tri-Ferg -->
  <g transform="translate(646, 215)">
    <polygon points="86,0 172,148 0,148" fill="#0A0A0A" />
    <polygon points="86,56 118,112 54,112" fill="#FFFFFF" />
    <line x1="86" y1="0" x2="118" y2="112" stroke="#FFFFFF" stroke-width="3" />
    <line x1="172" y1="148" x2="54" y2="112" stroke="#FFFFFF" stroke-width="3" />
    <line x1="0" y1="148" x2="86" y2="56" stroke="#FFFFFF" stroke-width="3" />
    <text x="86" y="140" text-anchor="middle" fill="#FFFFFF" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="19" letter-spacing="1">PALACE</text>
    <text x="42" y="85" text-anchor="middle" transform="rotate(-60 42 85)" fill="#FFFFFF" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="18" letter-spacing="1">PALACE</text>
    <text x="128" y="85" text-anchor="middle" transform="rotate(60 128 85)" fill="#FFFFFF" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="18" letter-spacing="1">PALACE</text>
  </g>

  <!-- 8. VETEMENTS -->
  <g transform="translate(874, 272)">
    <text x="130" y="42" text-anchor="middle" fill="#0A0A0A" font-family="Arial Narrow, Helvetica Neue, sans-serif" font-weight="800" font-size="46" letter-spacing="0.5">VETEMENTS</text>
  </g>

  <!-- ROW 3 -->
  <!-- 9. ANTI SOCIAL SOCIAL CLUB -->
  <g transform="translate(95, 368)">
    <text x="95" y="25" text-anchor="middle" transform="rotate(-6 95 25)" fill="#0A0A0A" font-family="Georgia, Times New Roman, serif" font-weight="900" font-size="39" letter-spacing="1.5">ANTI</text>
    <text x="95" y="70" text-anchor="middle" transform="rotate(-4 95 70)" fill="#0A0A0A" font-family="Georgia, Times New Roman, serif" font-weight="900" font-size="39" letter-spacing="1.5">SOCIAL</text>
    <text x="95" y="115" text-anchor="middle" transform="rotate(-2 95 115)" fill="#0A0A0A" font-family="Georgia, Times New Roman, serif" font-weight="900" font-size="39" letter-spacing="1.5">SOCIAL</text>
    <text x="95" y="160" text-anchor="middle" transform="rotate(2 95 160)" fill="#0A0A0A" font-family="Georgia, Times New Roman, serif" font-weight="900" font-size="37" letter-spacing="1.5">CLUB</text>
  </g>

  <!-- 10. WTAPS -->
  <g transform="translate(366, 428)">
    <text x="104" y="42" text-anchor="middle" fill="#0A0A0A" font-family="Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="60" letter-spacing="-1">WTAPS</text>
  </g>

  <!-- 11. STONE ISLAND -->
  <g transform="translate(614, 405)">
    <!-- Compass Rose -->
    <g transform="translate(124, 38)">
      <circle cx="0" cy="0" r="11" fill="none" stroke="#0A0A0A" stroke-width="1.8" />
      <polygon points="0,-38 5,-6 0,0 -5,-6" fill="#0A0A0A" />
      <polygon points="0,48 5,6 0,0 -5,6" fill="#0A0A0A" />
      <polygon points="-38,0 -6,5 0,0 -6,-5" fill="#0A0A0A" />
      <polygon points="38,0 6,5 0,0 6,-5" fill="#0A0A0A" />
    </g>
    <text x="58" y="96" text-anchor="middle" fill="#0A0A0A" font-family="Times New Roman, Georgia, serif" font-weight="800" font-size="33" letter-spacing="-0.5">STONE</text>
    <text x="195" y="96" text-anchor="middle" fill="#0A0A0A" font-family="Times New Roman, Georgia, serif" font-weight="800" font-size="33" letter-spacing="-0.5">ISLAND</text>
  </g>

  <!-- 12. KITH -->
  <g transform="translate(922, 405)">
    <rect x="0" y="0" width="178" height="72" fill="#0A0A0A" />
    <text x="89" y="55" text-anchor="middle" fill="#FFFFFF" font-family="Helvetica Neue, Arial, sans-serif" font-weight="900" font-size="58" letter-spacing="2">KITH</text>
  </g>

  <!-- ROW 4 -->
  <!-- 13. A-COLD-WALL* -->
  <g transform="translate(65, 616)">
    <text x="0" y="36" fill="#0A0A0A" font-family="Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="35" letter-spacing="0.5">A-COLD-WALL*</text>
  </g>

  <!-- 14. YEEZY -->
  <g transform="translate(366, 575)">
    <text x="0" y="52" fill="#0A0A0A" font-family="Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="64" letter-spacing="1.5">YEEZY</text>
  </g>

  <!-- 15. UNDERCOVER -->
  <g transform="translate(630, 582)">
    <text x="0" y="30" fill="#0A0A0A" font-family="Helvetica Neue, Arial, sans-serif" font-weight="900" font-size="33" letter-spacing="1">UNDERCOVER</text>
  </g>

  <!-- 16. AWAKE NY -->
  <g transform="translate(888, 622)">
    <text x="0" y="52" fill="#0A0A0A" font-family="Georgia, Times New Roman, serif" font-weight="700" font-size="62" letter-spacing="1">AWAKE</text>
    <text x="245" y="20" fill="#0A0A0A" font-family="Times New Roman, serif" font-weight="700" font-size="12">NY</text>
  </g>

  <!-- ROW 5 -->
  <!-- 17. UoNDL -->
  <g transform="translate(68, 735)">
    <text x="0" y="42" fill="#0A0A0A" font-family="Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="52" letter-spacing="-0.5">UoNDL</text>
  </g>

  <!-- 18. THEHUNDREDS -->
  <g transform="translate(354, 738)">
    <text x="0" y="38" fill="#0A0A0A" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="32" letter-spacing="-1">THEHUNDREDS</text>
  </g>

  <!-- 19. UNDEFEATED 5-Strike -->
  <g transform="translate(682, 656)">
    <!-- 4 vertical tally bars -->
    <rect x="18" y="0" width="16" height="100" fill="#0A0A0A" />
    <rect x="42" y="0" width="16" height="100" fill="#0A0A0A" />
    <rect x="66" y="0" width="16" height="100" fill="#0A0A0A" />
    <rect x="90" y="0" width="16" height="100" fill="#0A0A0A" />
    <!-- 1 diagonal slash bar -->
    <polygon points="2,74 118,22 124,38 8,90" fill="#0A0A0A" />
    <text x="62" y="132" text-anchor="middle" fill="#0A0A0A" font-family="Impact, Arial Narrow, sans-serif" font-weight="900" font-size="25" letter-spacing="0.5">UNDEFEATED</text>
  </g>
</svg>`;

export const STREETWEAR_BRANDS_WALLPAPER_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  rawSvg
)}`;

export const StreetwearBrandsShowcase: React.FC = () => {
  return (
    <section
      aria-label="Streetwear Culture & Labels Archive"
      className="border-b border-[#0A0A0A] bg-[#FFFFFF]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Top Architectural Spec Strip */}
        <div className="px-5 sm:px-8 py-3.5 border-b border-[#0A0A0A] bg-[#F6F5F0] flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tabular">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#0A0A0A]">
              "STREETWEAR ARCHIVE INDEX"
            </span>
            <span aria-hidden="true" className="text-[#8C8982]">
              ·
            </span>
            <span className="text-[#52514E]">
              Global Streetwear Labels &amp; Silhouettes Available at Mr. J Collections
            </span>
          </div>
          <span className="text-[#9E7B32] font-semibold">
            c/o Tarkwa, Ghana
          </span>
        </div>

        {/* Full-Width Streetwear Brands Logo Wall Image (Matching Uploaded Reference) */}
        <div className="p-4 sm:p-8 lg:p-10 bg-[#FFFFFF] flex items-center justify-center">
          <img
            src={STREETWEAR_BRANDS_WALLPAPER_URI}
            alt="Streetwear brand logos including Supreme, Nike, Adidas, BAPE, Off-White, Stüssy, Palace, Vetements, Anti Social Social Club, WTAPS, Stone Island, KITH, A-Cold-Wall, Yeezy, Undercover, Awake NY, The Hundreds, and Undefeated"
            referrerPolicy="no-referrer"
            className="w-full max-w-[1160px] h-auto object-contain select-none"
          />
        </div>
      </div>
    </section>
  );
};
