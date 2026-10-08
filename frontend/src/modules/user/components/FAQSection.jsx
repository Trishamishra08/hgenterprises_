import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        {
            question: "Is your jewellery made of real silver?",
            answer: "Yes, all our jewellery is crafted from high-quality 925 Sterling Silver. Each piece comes with a hallmark stamp of authenticity so you can shop with confidence."
        },
        {
            question: "How do I take care of my silver jewellery?",
            answer: "To keep your silver shining, store it in the provided zip-lock bag when not in use. Avoid direct contact with perfumes, lotions, and harsh chemicals. You can gently clean it with a soft cloth."
        },
        {
            question: "Do you offer a warranty on the plating?",
            answer: "Absolutely! We offer a 6-month warranty on the gold and rose gold plating of our silver jewellery. If you face any issues, just reach out to us."
        },
        {
            question: "What is your return and exchange policy?",
            answer: "We offer a hassle-free 7-day return and exchange policy. If you are not completely satisfied with your purchase, you can return it in its original condition within 7 days."
        }
    ];

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <section className="py-8 bg-[#FAF9F6] relative overflow-hidden">
            <div className="container mx-auto px-2 md:px-4 max-w-4xl relative z-10">
                {/* Header - Matched to Shop by Recipient Style */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-[#c1a05b] font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-1 block">
                        COMMON QUESTIONS
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-dark mb-2 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Frequently Asked <span className="italic text-[#8c2a3e] font-normal">Questions</span>
                    </h2>
                    <div className="h-[1px] w-12 bg-[#c1a05b] mx-auto mt-2"></div>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl md:rounded-2xl border transition-all duration-300 ${activeFaq === index
                                ? 'border-[#722F37] shadow-[0_10px_30px_rgba(114,47,55,0.1)]'
                                : 'border-transparent shadow-sm hover:shadow-md'
                                }`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full text-left px-4 py-4 md:px-8 md:py-6 flex justify-between items-center gap-4"
                            >
                                <span className={`font-serif text-sm md:text-xl font-normal ${activeFaq === index ? 'text-[#722F37]' : 'text-[#2F0A0F]'}`}>
                                    {faq.question}
                                </span>
                                <span className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${activeFaq === index ? 'bg-[#722F37] text-white' : 'bg-[#F5F5F5] text-gray-500'
                                    }`}>
                                    {activeFaq === index ? <Minus size={14} className="md:w-4 md:h-4" /> : <Plus size={14} className="md:w-4 md:h-4" />}
                                </span>
                            </button>
                            <AnimatePresence>
                                {activeFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 md:px-8 md:pb-8 pt-0">
                                            <p className="text-gray-600 font-serif leading-relaxed text-sm md:text-base">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
