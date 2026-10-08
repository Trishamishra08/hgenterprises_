import React, { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck, Mail, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const ReturnsPolicy = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/return-refund-policy');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching returns policy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultPolicies = [
        {
            title: "7-Day Window",
            icon: <RefreshCw className="w-5 h-5 text-[#4A1015]" />,
            content: "We offer a seven-day return window for all standard products from the date of delivery."
        },
        {
            title: "Full Refund",
            icon: <ShoppingBag className="w-5 h-5 text-[#4A1015]" />,
            content: "Once approved, a full refund of the product value will be credited to your original payment method."
        }
    ];

    return (
        <div className="bg-white min-h-screen py-8 md:py-20 selection:bg-[#4A1015] selection:text-white">
            <div className="container mx-auto px-4 max-w-4xl text-left">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-black hover:text-[#4A1015] transition-all group font-bold uppercase tracking-widest text-[10px] mb-8 md:mb-12">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-center mb-12">
                    <span className="text-[#4A1015] text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] mb-4 block">Our Promise</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 tracking-tight font-normal uppercase">
                        {pageContent?.title?.includes('Return') ? (
                            <>Easy <span className="italic text-[#4A1015] normal-case">Returns</span></>
                        ) : (
                            pageContent?.title || 'Returns Policy'
                        )}
                    </h1>
                </div>

                <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-xl border border-gray-100">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            {defaultPolicies.map((p, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 h-fit shrink-0">
                                        {p.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg text-black mb-2 tracking-tight">{p.title}</h3>
                                        <p className="text-[11px] md:text-xs text-gray-400 font-serif leading-relaxed italic">{p.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-16 p-8 bg-[#FDF5F6] rounded-2xl border-l-4 border-l-[#4A1015]">
                        <h4 className="font-display text-sm text-[#4A1015] font-bold uppercase tracking-widest mb-3">Questions?</h4>
                        <p className="text-[11px] md:text-xs text-black/60 font-serif italic mb-2 leading-relaxed uppercase tracking-widest font-bold">concierge@hgjewels.com</p>
                    </div>
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

export default ReturnsPolicy;
