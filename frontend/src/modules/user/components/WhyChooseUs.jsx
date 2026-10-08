import React from 'react';
import { Truck, Star, Gift, Shield } from 'lucide-react';

const WhyChooseUs = () => {
    return (
        <section className="py-10 bg-white border-t border-[#EBCDD0]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-normal text-black mb-3 uppercase tracking-[0.05em]">Why Choose Us</h2>
                    <p className="text-[#D39A9F] font-serif italic text-sm md:text-base">Experience the difference of authentic craftsmanship</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: Truck, title: "Free Shipping", text: "On all orders over ₹2000" },
                        { icon: Star, title: "Pure Silver", text: "Hallmarked 925 Sterling" },
                        { icon: Gift, title: "Gift Ready", text: "Premium packaging included" },
                        { icon: Shield, title: "Secure Payment", text: "100% secure checkout" }
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-[#EBCDD0] rounded-full flex items-center justify-center text-black mb-4 group-hover:bg-[#D39A9F] group-hover:text-white transition-colors duration-300 shadow-sm">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-lg font-normal text-black mb-1 uppercase tracking-wide">{item.title}</h3>
                            <p className="text-sm text-gray-500 font-serif italic">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
