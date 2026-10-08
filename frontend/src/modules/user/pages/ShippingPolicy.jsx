import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Package, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const ShippingPolicy = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/shipping-policy');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching shipping policy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultDetails = [
        {
            title: "Pan India Delivery",
            icon: <Truck className="w-6 h-6" />,
            content: "We provide safe, express delivery across all India-based pincodes through our premium delivery partners."
        },
        {
            title: "Real-time Tracking",
            icon: <MapPin className="w-6 h-6" />,
            content: "Once dispatched, you will receive a tracking link via SMS and Email to monitor your handcrafted pieces."
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
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Service Commitment</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 tracking-tight font-normal uppercase">
                        {pageContent?.title || (
                            <>Shipping & <span className="italic text-[#D39A9F] normal-case">Delivery</span></>
                        )}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 text-left">
                            {defaultDetails.map((item, i) => (
                                <div key={i} className="p-4 md:p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all hover:shadow-md group">
                                    <div className="text-black mb-3 bg-white w-fit p-2.5 rounded-xl group-hover:bg-[#EBCDD0] transition-colors border border-gray-100 shadow-sm">
                                        <div className="w-5 h-5">{item.icon}</div>
                                    </div>
                                    <h3 className="font-serif italic text-base md:text-lg text-black mb-1.5 tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-[10px] md:text-xs text-gray-400 font-serif leading-relaxed italic">{item.content}</p>
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

export default ShippingPolicy;
