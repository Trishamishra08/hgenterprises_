import React, { useEffect, useState } from 'react';
import { Edit3, Gem, Layout, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const CustomizationPage = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/customization');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching customization content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultServices = [
        {
            title: "Bespoke Design",
            icon: <Edit3 className="w-6 h-6 text-[#D39A9F]" />,
            content: "Collaborate with our master designers to create a piece that is uniquely yours, from initial sketch to final masterpiece."
        },
        {
            title: "Custom Engraving",
            icon: <MessageSquare className="w-6 h-6 text-[#D39A9F]" />,
            content: "Personalize your jewelry with meaningful dates, names, or messages using our precision laser engraving service."
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
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-3 block">Tailored Excellence</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 tracking-tight uppercase">
                        {pageContent?.title || 'Customization Services'}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {defaultServices.map((service, idx) => (
                                <div key={idx} className="p-6 rounded-2xl border border-[#F3F4F6] hover:shadow-md transition-all group bg-white text-left">
                                    <div className="text-[#D39A9F] mb-4 bg-gray-50 w-fit p-3 rounded-xl group-hover:bg-[#EBCDD0] transition-colors">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-display text-black mb-3">{service.title}</h3>
                                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-serif">{service.content}</p>
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

export default CustomizationPage;
