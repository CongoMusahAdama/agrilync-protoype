import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const faqs = [
  { question: "How does AgriLync Nexus ensure the safety of my investment?", answer: "We employ a rigorous vetting process for all farmers and implement strict monitoring protocols. Additionally, we work with insurance partners to provide coverage for crops against unforeseen weather events and pests." },
  { question: "How accurate is the AI crop consultation?", answer: "Our AI model is trained on a vast database of plant pathology and continuously updated by agricultural experts. It currently boasts a 95% accuracy rate in early disease detection, though we always recommend verifying with our human experts for critical issues." },
  { question: "Can I choose which specific farm to invest in?", answer: "Yes! Our platform provides detailed profiles for each farm, including their crop history, risk assessment, and projected yield. You can browse and select the partnerships that align with your financial goals and values." },
  { question: "Is AgriLync Nexus available to small-scale farmers?", answer: "Absolutely. Our core mission is to empower smallholder farmers. The platform is designed to be accessible even on basic smartphones, and we have local agents to assist farmers with limited digital literacy." },
  { question: "What is the minimum amount required to start investing?", answer: "We believe in democratizing agricultural investment. You can start supporting a farm with as little as GHS 500. We offer various tiers to suit different investment capacities." },
  { question: "Do you support livestock farming as well?", answer: "Yes! We support livestock sectors including poultry and small ruminants. Our health monitoring protocols are adapted to ensure animal welfare and secure returns for investors." }
];

export const FAQSection: React.FC = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [faqRef, faqVisible] = useScrollReveal();
  const toggleFaq = (index: number) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left: Branded card */}
          <div ref={faqRef} className={`bg-[#7ede56] rounded-[3rem] p-6 md:p-10 text-[#002f37] flex flex-col justify-between shadow-2xl transition-all duration-1000 ${faqVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div>
              <span className="font-bold uppercase tracking-[0.2em] text-sm mb-4 block opacity-80">FAQ</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight text-[#002f37] mb-6">
                Frequently Asked <br />
                <span className="relative inline-block text-white">Questions?
                  <svg className="absolute -bottom-4 left-0 w-full h-4 text-white opacity-60" viewBox="0 0 200 20" fill="none"><path d="M5 15C50 5 150 5 195 15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg>
                </span>
              </h2>
              <div className="w-16 h-1 bg-[#002f37]/20 rounded-full mb-6 mt-4"></div>
              <p className="text-[#002f37]/80 text-base md:text-lg font-medium leading-relaxed mb-6 max-w-md">Discover how AgriLync Nexus is bridging the gap in agricultural finance, offering effective, secure solutions for everyone involved.</p>
            </div>
            <div className="mt-auto rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white/20">
              <img src="/lovable-uploads/countryside-workers-together-field.jpg" alt="AgriLync FAQ" loading="lazy" className="w-full h-56 md:h-72 object-cover" />
            </div>
          </div>

          {/* Right: Accordion */}
          <div className={`bg-[#f9fafb] rounded-[3rem] p-6 md:p-10 shadow-xl flex flex-col transition-all duration-1000 delay-300 ${faqVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex flex-col gap-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0">
                  <button onClick={() => toggleFaq(index)} className="w-full py-4 text-left flex items-center justify-between gap-6 focus:outline-none group" aria-expanded={openFaqIndex === index}>
                    <span className={`text-base md:text-lg font-bold font-montserrat transition-colors leading-tight ${openFaqIndex === index ? 'text-[#7ede56]' : 'text-[#002f37] group-hover:text-[#002f37]/70'}`}>{faq.question}</span>
                    <div className={`transition-transform duration-300 ${openFaqIndex === index ? 'rotate-90 text-[#7ede56]' : 'text-[#002f37]'}`}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaqIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed font-sans border-l-4 border-[#7ede56] pl-6 ml-1">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:text-left">
              <Button onClick={() => navigate('/contact')} className="bg-[#002f37] hover:bg-black text-white px-8 py-5 rounded-xl text-sm font-bold shadow-xl transition-all hover:scale-105 h-auto uppercase">Still have questions? Contact us</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
