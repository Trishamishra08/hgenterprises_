import React, { useEffect, useState } from 'react';
import { Shield, Award, Calendar, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const WarrantyInfo = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/warranty-info');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching warranty info:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultFeatures = [
        {
            title: "Authenticity Guarantee",
            icon: <Award className="w-6 h-6 text-[#D39A9F]" />,
            content: "Every HG piece comes with a certificate of authenticity, ensuring the purity of metals and quality of stones."
        },
        {
            title: "Lifetime Plating",
            icon: <Shield className="w-6 h-6 text-[#D39A9F]" />,
            content: "We offer lifetime plating support for our 18k gold-toned pieces to maintain their original brilliance."
        }
    ];

    return (
        <div className="bg-white min-h-screen py-8 md:py-20 selection:bg-[#D39A9F] selection:text-white">
            <div className="container mx-auto px-4 max-w-4xl text-left">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-black hover:text-[#D39A9F] transition-all group font-bold uppercase tracking-widest text-[10px] mb-8"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-center mb-12">
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-3 block">Our Commitment</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 tracking-tight uppercase">
                        {pageContent?.title || 'Warranty Information'}
                    </h1>
                </div>

                <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-xl border border-[#F3F4F6]">
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
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {defaultFeatures.map((feature, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl border border-[#F3F4F6] hover:shadow-md transition-all group bg-white">
                                        <div className="text-[#D39A9F] mb-4 bg-gray-50 w-fit p-3 rounded-xl group-hover:bg-[#EBCDD0] transition-colors">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg md:text-xl font-display text-black mb-3">{feature.title}</h3>
                                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-serif">{feature.content}</p>
                                    </div>
                                ))}
                            </div>
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

export default WarrantyInfo;
