import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, getGenericWhatsAppLink } from '../types';
import { BrandBagEmblem } from '../components/BrandLogo';

export const About: React.FC = () => {
  const pillars = [
    {
      index: '01.',
      title: 'Quality',
      description:
        'Every sneaker, slide, handbag, fragrance, wristwatch, and garment in our collection is carefully inspected for durability, clean stitching, and authentic finish before it reaches your wardrobe.',
    },
    {
      index: '02.',
      title: 'Affordable Prices',
      description:
        'Looking sharp should never break the bank. Because we source directly and operate efficiently in Tarkwa, we pass genuine value and transparent GH₵ pricing directly to our customers.',
    },
    {
      index: '03.',
      title: 'Nationwide Delivery',
      description:
        'From Tarkwa to Accra, Kumasi, Takoradi, Cape Coast, Tamale, and every region across Ghana — we package and dispatch orders swiftly through trusted courier and VIP bus networks.',
    },
    {
      index: '04.',
      title: 'Customer Service',
      description:
        'Personal, responsive WhatsApp assistance from sizing advice to delivery tracking. You speak directly with Mr. J Collections so every order is confirmed accurately.',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-14 lg:py-20 space-y-20">
      {/* Editorial Story Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 border border-[#0A0A0A] bg-[#FFFFFF]">
        <div className="lg:col-span-8 p-7 sm:p-10 lg:p-12 space-y-6 border-b lg:border-b-0 lg:border-r border-[#0A0A0A]">
          <div className="flex items-center justify-between gap-4 border-b border-[#0A0A0A]/15 pb-4">
            <p className="text-xs font-mono-tabular text-[#9E7B32]">
              c/o {BUSINESS_INFO.location} · "{BUSINESS_INFO.tagline}"
            </p>
            <div className="hidden sm:block w-14 h-3 offwhite-stripes" />
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl font-extrabold text-[#0A0A0A] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            "ABOUT {BUSINESS_INFO.name.toUpperCase()}"
          </h1>

          <p className="text-base text-[#3D3C39] leading-relaxed max-w-[68ch]">
            Welcome to <strong className="text-[#0A0A0A]">{BUSINESS_INFO.name}</strong>,
            your trusted fashion plug based in{' '}
            <strong className="text-[#0A0A0A]">{BUSINESS_INFO.location}</strong>. We
            specialize in bringing you the freshest male, female, and unisex fashion
            essentials — from statement sneakers, slides, plain tees, jeans, and cross
            bags to luxury handbags, wigs, short gowns, wristwatches, and signature
            perfumes.
          </p>

          <p className="text-base text-[#3D3C39] leading-relaxed max-w-[68ch]">
            Whether you are upgrading your daily rotation in Tarkwa or ordering from
            anywhere across Ghana, our mission is simple: deliver authentic style,
            uncompromising quality, and accessible prices straight to your doorstep via
            seamless WhatsApp checkout.
          </p>
        </div>

        <div className="lg:col-span-4 bg-[#0A0A0A] text-[#F6F5F0] p-10 flex flex-col items-center justify-center text-center space-y-5">
          <BrandBagEmblem className="w-28 h-28" />
          <div>
            <p className="font-display text-2xl font-bold text-[#F6F5F0]">
              {BUSINESS_INFO.name}™
            </p>
            <p className="text-xs font-mono-tabular text-[#C5A059] mt-1">
              "{BUSINESS_INFO.tagline}"
            </p>
          </div>
          <div className="text-xs font-mono-tabular text-[#A8A6A1] pt-4 border-t border-white/15 w-full">
            {BUSINESS_INFO.location} · {BUSINESS_INFO.socialHandle}
          </div>
        </div>
      </section>

      {/* Four Required Core Sections: Quality, Affordable Prices, Nationwide Delivery, Customer Service */}
      <section className="space-y-8">
        <div className="border-b border-[#0A0A0A] pb-4">
          <p className="text-xs font-mono-tabular text-[#9E7B32] mb-1">
            House Pillars
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A0A0A]">
            "THE MR. J STANDARD"
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-[#FFFFFF] border border-[#0A0A0A] p-7 sm:p-8 rounded-none space-y-3"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-tabular text-xs font-bold text-[#9E7B32]">
                  {pillar.index}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#0A0A0A]">
                  "{pillar.title}"
                </h3>
              </div>
              <p className="text-sm text-[#3D3C39] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* High-Contrast CTA Block */}
      <section className="bg-[#0A0A0A] text-[#F6F5F0] border border-[#0A0A0A] p-8 sm:p-12 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F6F5F0]">
            "READY TO ELEVATE YOUR DRIP?"
          </h2>
          <p className="text-sm text-[#D0CEC7]">
            Explore our latest drops or message us directly on WhatsApp ({BUSINESS_INFO.phone}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold bg-[#C5A059] text-[#0A0A0A] hover:bg-[#F6F5F0] transition-colors rounded-none whitespace-nowrap"
          >
            <span>"SHOP NOW"</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={getGenericWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold bg-transparent text-[#F6F5F0] hover:bg-white/10 border border-[#F6F5F0] transition-colors rounded-none whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-[#C5A059]" />
            <span>"CHAT ON WHATSAPP"</span>
          </a>
        </div>
      </section>
    </div>
  );
};
