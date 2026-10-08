import React, { useEffect, useState } from 'react';
import { Hammer, Sparkles, Shield, Heart, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const CraftsmanshipPage = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/our-craftsmanship');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching craftsmanship content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultSteps = [
        {
            title: "Traditional Forging",
            icon: <Hammer className="w-6 h-6 text-[#4A1015]" />,
            content: "We use ancient techniques handed down through generations, ensuring each piece is as unique as the artisan who crafted it."
        },
        {
            title: "Ethical Sourcing",
            icon: <Heart className="w-6 h-6 text-[#4A1015]" />,
            content: "Every diamond and gemstone in our collection is conflict-free and sourced with respect for nature."
        }
    ];

    return (
        <div className="bg-white min-h-screen py-8 md:py-20 selection:bg-[#4A1015] selection:text-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-5xl text-left">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-black hover:text-[#4A1015] transition-all group font-bold uppercase tracking-widest text-[10px] mb-8 md:mb-12">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-center mb-16 md:mb-24">
                    <span className="text-[#4A1015] text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] mb-4 block">Handcrafted Excellence</span>
                    <h1 className="text-4xl md:text-7xl font-display text-black mb-6 tracking-tight uppercase">
                        {pageContent?.title || 'Our Craft & Heritage'}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 md:mb-32">
                    <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl group">
                        <img src="/assets/craft_process.jpg" alt="Crafting Process" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000"; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 text-white">
                            <h4 className="font-serif italic text-2xl">The Artist's Touch</h4>
                            <p className="text-gray-300 text-sm mt-1">Manual forging ensures heirloom quality.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl border border-gray-100">
                        {loading ? (
                            <div className="flex justify-center p-20">
                                <RefreshCw className="w-8 h-8 animate-spin text-[#4A1015]" />
                            </div>
                        ) : pageContent ? (
                            <div
                                className="prose prose-lg max-w-none font-serif text-gray-700 dynamic-content"
                                dangerouslySetInnerHTML={{ __html: pageContent.content }}
                            />
                        ) : (
                            <div className="space-y-6 md:space-y-10">
                                {defaultSteps.map((step, i) => (
                                    <div key={i} className="flex gap-6 group text-left">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FDF5F6] rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-[#4A1015] transition-all duration-500 shrink-0">
                                            <div className="group-hover:text-white transition-colors">
                                                {step.icon}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg md:text-xl text-black mb-2 tracking-tight">{step.title}</h3>
                                            <p className="text-[11px] md:text-sm text-gray-500 font-serif leading-relaxed italic">{step.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center py-20 border-t border-gray-100">
                    <h3 className="font-display text-2xl md:text-4xl text-black mb-8 italic">"A jewellery piece should not just be worn, it should be witnessed."</h3>
                    <div className="w-16 h-0.5 bg-[#4A1015] mx-auto"></div>
                </div>
            </div>
            <style>{`
                .dynamic-content h1, .dynamic-content h2, .dynamic-content h3 {
                    color: black;
                    font-family: serif;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .dynamic-content p {
                    margin-bottom: 1.5rem;
                    line-height: 1.8;
                }
                .dynamic-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                }
            `}</style>
        </div>
    );
};

export default CraftsmanshipPage;
