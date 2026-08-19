"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageCircle, Clock, Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Are Lapzen laptops brand new or refurbished?",
    answer: "At Lapzen, we offer both brand new and used laptops. Each used laptop is tested thoroughly to ensure quality.",
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    question: "How long is the warranty on Lapzen laptops?",
    answer: "We provide warranty on all laptops. Warranty duration depends on the product and condition.",
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    question: "Which cities in Pakistan do you deliver to and how long does delivery take?",
    answer: "We offer free delivery all over Pakistan (wherever courier service is available). Standard delivery time is 2–5 working days (usually within 2 days in major cities). In case of any delay or inconvenience, our support team is always ready to assist you.",
    icon: <Truck className="w-5 h-5" />
  },
  {
    question: "What payment methods are available?",
    answer: "We accept multiple payment methods for your convenience: Cash on Delivery (COD), Bank Transfer (advance payment before delivery), Online Wallets (JazzCash, Easypaisa, etc.), and Cash in Hand (for direct collection from our shop).",
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    question: "Will I receive a box-packed laptop upon delivery, unopened during transit?",
    answer: "Yes. The laptop's screen will be wrapped in protective plastic, and the laptop will be placed in a shopping bag, then in a carton or box to ensure safety during delivery. The bill will also be included inside.",
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    question: "Can I return or replace my laptop if I am not satisfied?",
    answer: "Yes, you can return or replace your laptop if it is in the same condition as delivered. Please note that return delivery charges may apply as per our policy.",
    icon: <Clock className="w-5 h-5" />
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach our support team through multiple channels: Website Chat, WhatsApp, Facebook Messenger, Phone, Email, and In-Person Meetup (appointment required).",
    icon: <Headphones className="w-5 h-5" />
  },
  {
    question: "What is the claim process if the laptop is defective on delivery?",
    answer: "If you receive a defective laptop upon delivery, please contact our support team immediately. You can return it to our delivery address, and we will provide a replacement to ensure you receive a correct and fully working laptop.",
    icon: <ShieldCheck className="w-5 h-5" />
  }
];

const FAQsFullContent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-white py-20 px-4 text-center border-b border-zinc-100">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-black mb-6 uppercase tracking-tighter italic">
            HELP CENTER
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to know about shopping with Lapzen. Find answers to common questions about products, shipping, and warranty.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="space-y-4">
            {FAQ_DATA.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-black ring-1 ring-black/5 shadow-lg bg-zinc-50' : 'border-zinc-200 hover:border-black/30 bg-white'}`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-6 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl transition-colors duration-300 ${isOpen ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                        {item.icon || <HelpCircle className="w-5 h-5" />}
                      </div>
                      <span className={`text-lg md:text-xl font-bold transition-colors ${isOpen ? 'text-black' : 'text-zinc-700'}`}>
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 transition-transform duration-500 ${isOpen ? "rotate-180 text-black" : "text-zinc-300"}`}
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="px-6 pb-8 pl-16">
                      <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Still have questions? */}
          <div className="mt-20 p-8 md:p-12 bg-zinc-50 rounded-[2rem] text-center border border-dashed border-zinc-200">
            <h3 className="text-2xl font-bold text-black mb-4">Still have questions?</h3>
            <p className="text-zinc-600 mb-8 max-w-md mx-auto">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/923090009022" 
                target="_blank"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <a 
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 bg-white text-black border border-black px-8 py-4 rounded-full font-bold hover:bg-zinc-50 transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQsFullContent;
