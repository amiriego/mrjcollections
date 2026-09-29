import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { BUSINESS_INFO, getGenericWhatsAppLink } from '../types';
import { useStore } from '../context/StoreContext';

export const Contact: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submittedLink, setSubmittedLink] = useState<string | null>(null);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanPhone || !cleanMessage) {
      showToast('Please fill in your name, phone number, and message.', 'error');
      return;
    }

    const formattedEnquiry = `Hello Mr. J Collections, I have an enquiry:\n\nName: ${cleanName}\nPhone: ${cleanPhone}\nMessage: ${cleanMessage}`;
    const waUrl = getGenericWhatsAppLink(formattedEnquiry);
    setSubmittedLink(waUrl);
    showToast('Enquiry prepared! Click below to send via WhatsApp.');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-14 lg:py-20 space-y-12">
      {/* Header */}
      <div className="border-b border-[#0A0A0A] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-mono-tabular text-[#9E7B32]">
            "{BUSINESS_INFO.tagline}"
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#0A0A0A]">
            "CONTACT DESK"
          </h1>
        </div>
        <div className="hidden sm:block w-24 h-4 offwhite-stripes" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Business Info Block + Prominent WhatsApp CTA */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#0A0A0A] p-7 sm:p-8 rounded-none space-y-8">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-[#0A0A0A]">
              "STORE &amp; DIRECT LINE"
            </h2>
            <p className="text-sm text-[#52514E] leading-relaxed">
              Reach out directly on WhatsApp or phone for sizing verification,
              product availability, and nationwide dispatch across Ghana.
            </p>
          </div>

          <dl className="space-y-5 text-sm border-t border-b border-[#0A0A0A] py-6">
            <div>
              <dt className="text-xs font-mono-tabular text-[#686662]">Business Name</dt>
              <dd className="text-base font-bold text-[#0A0A0A] mt-0.5">
                {BUSINESS_INFO.name}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-mono-tabular text-[#686662]">Location</dt>
              <dd className="text-base font-semibold text-[#0A0A0A] mt-0.5">
                {BUSINESS_INFO.location}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-mono-tabular text-[#686662]">Delivery Coverage</dt>
              <dd className="text-base font-semibold text-[#0A0A0A] mt-0.5">
                {BUSINESS_INFO.delivery}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-mono-tabular text-[#686662]">WhatsApp / Phone</dt>
              <dd className="text-base font-bold text-[#9E7B32] font-mono-tabular mt-0.5">
                <a
                  href={getGenericWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-xs font-mono-tabular text-[#686662]">Social Handle</dt>
              <dd className="text-base font-semibold text-[#0A0A0A] mt-0.5">
                {BUSINESS_INFO.socialHandle}
              </dd>
            </div>
          </dl>

          {/* Prominent Chat on WhatsApp Button */}
          <div>
            <a
              href={getGenericWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs font-bold tracking-wider bg-[#0A0A0A] hover:bg-[#C5A059] text-[#F6F5F0] hover:text-[#0A0A0A] border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
            >
              <MessageCircle className="w-5 h-5" />
              <span>"CHAT ON WHATSAPP" ({BUSINESS_INFO.phone})</span>
            </a>
          </div>
        </div>

        {/* Right: Simple Enquiry Form */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#0A0A0A] p-7 sm:p-8 rounded-none space-y-6">
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-bold text-[#0A0A0A]">
              "SEND AN ENQUIRY"
            </h2>
            <p className="text-xs text-[#52514E]">
              Complete the fields below to prepare a pre-filled WhatsApp dispatch
              message to our Tarkwa desk.
            </p>
          </div>

          <form onSubmit={handleEnquirySubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="enquiry-name"
                className="block text-xs font-bold text-[#0A0A0A]"
              >
                Your Name
              </label>
              <input
                id="enquiry-name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kwame Mensah"
                className="w-full px-4 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] placeholder-[#686662] focus:outline-none focus:bg-[#FFFFFF]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="enquiry-phone"
                className="block text-xs font-bold text-[#0A0A0A]"
              >
                Phone / WhatsApp Number
              </label>
              <input
                id="enquiry-phone"
                type="tel"
                required
                maxLength={30}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 059 000 0000"
                className="w-full px-4 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] placeholder-[#686662] focus:outline-none focus:bg-[#FFFFFF]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="enquiry-message"
                className="block text-xs font-bold text-[#0A0A0A]"
              >
                Message
              </label>
              <textarea
                id="enquiry-message"
                required
                rows={4}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us which product, size, or delivery location you are enquiring about..."
                className="w-full px-4 py-2.5 text-sm bg-[#F6F5F0] border border-[#0A0A0A] rounded-none text-[#0A0A0A] placeholder-[#686662] focus:outline-none focus:bg-[#FFFFFF]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold tracking-wider bg-[#0A0A0A] text-[#F6F5F0] hover:bg-[#C5A059] hover:text-[#0A0A0A] border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>"SUBMIT ENQUIRY"</span>
              </button>

              {submittedLink && (
                <a
                  href={submittedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-wider bg-[#C5A059] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F6F5F0] border border-[#0A0A0A] transition-colors rounded-none whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>"OPEN PRE-FILLED WHATSAPP MESSAGE"</span>
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
