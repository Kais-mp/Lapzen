"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Are Lapzen laptops brand new or refurbished?",
    answer: "At Lapzen, we offer both brand new and used laptops. Each used laptop is tested thoroughly to ensure quality.",
  },
  {
    question: "How long is the warranty on Lapzen laptops?",
    answer: "We provide warranty on all laptops(Check warranty is 30 days,Conditions applied). Warranty duration depends on the product and condition.",
  },
  {
    question: "Can I return or replace my laptop if I am not satisfied?",
    answer: "Yes, you can return or replace your laptop if it is in the same condition as delivered. Please note that return delivery charges may apply as per our policy.",
  },
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 py-4 md:py-6">
      <div className="container">
          <div 
            className="glass-card rounded-[32px] px-6 py-8 md:px-20 md:py-12 overflow-hidden relative"
          >
            {/* Section Heading */}
            <div className="text-center mb-8">
              <h2 className="text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">
                Everything you need to know about Lapzen
              </p>
            </div>

            {/* Accordion List */}
            <div className="max-w-4xl mx-auto space-y-2">
              {FAQ_DATA.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border-b border-black/5 last:border-0"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between py-6 text-left group transition-all duration-300"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`p-2 rounded-lg transition-colors duration-300 ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-black/5 text-foreground'}`}>
                          <HelpCircle 
                            className="w-5 h-5 shrink-0" 
                            strokeWidth={2}
                          />
                        </div>
                        <span 
                          className="text-foreground text-lg md:text-xl font-medium transition-colors group-hover:text-foreground/70"
                        >
                          {item.question}
                        </span>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-foreground/40 transition-transform duration-500 ease-out shrink-0 ${
                          isOpen ? "rotate-180 text-foreground" : ""
                        }`}
                      />
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-16 pr-4">
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

              {/* See More Button */}
              <div className="flex justify-center mt-12 md:mt-16">
                <a
                  href="/faqs"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-12 py-4 rounded-full text-base font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:scale-95"
                >
                  See More!
                </a>
              </div>
          </div>
      </div>
    </section>
  );
};

export default FAQAccordion;