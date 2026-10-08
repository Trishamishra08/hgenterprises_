import React, { useEffect, useState } from 'react';
import { Wind, Droplets, Sun, Shield, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const CareGuidePage = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/jewelry-care');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching care guide:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultTips = [
        {
            title: "Store Separately",
            icon: <Shield className="w-5 h-5 text-[#D39A9F]" />,
            content: "Store your ornaments in independent pouches or boxes. Contact between hardware can cause micro-scratches."
        },
        {
            title: "Avoid Moisture",
            icon: <Droplets className="w-5 h-5 text-[#D39A9F]" />,
            content: "Remove jewellery before bathing, swimming, or intense workouts. Chlorine and salt water accelerate tarnishing."
        }
    ];

    return (
        <div className="bg-white min-h-screen py-8 md:py-20 selection:bg-[#D39A9F] selection:text-white">
            <div className="container mx-auto px-4 max-w-4xl text-left">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-black hover:text-[#D39A9F] transition-all group font-bold uppercase tracking-widest text-[10px] mb-8">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-center mb-12">
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Heirloom Maintenance</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-6 tracking-tight uppercase">
                        {pageContent?.title || 'Jewellery Care Guide'}
                    </h1>
                </div>

                <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-xl border border-gray-100">
                    {loading ? (
                        <div className="flex justify-center p-20">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#D39A9F]" />
                        </div>
                    ) : pageContent ? (
                        <div
                            className="prose prose-lg max-w-none font-serif text-gray-700 dynamic-content"
                            dangerouslySetInnerHTML={{ __html: pageContent.content }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
                            {defaultTips.map((tip, i) => (
                                <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all hover:shadow-md group">
                                    <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-gray-100 group-hover:border-[#EBCDD0]">
                                        {tip.icon}
                                    </div>
                                    <h3 className="font-display text-lg text-black mb-2">{tip.title}</h3>
                                    <p className="text-[11px] md:text-xs text-gray-400 font-serif leading-relaxed italic">{tip.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
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

export default CareGuidePage;
