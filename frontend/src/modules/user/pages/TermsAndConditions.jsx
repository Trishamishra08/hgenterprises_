import React, { useEffect, useState } from 'react';
import { FileText, ShieldCheck, Scale, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/terms-conditions');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching terms:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultSections = [
        {
            title: "1. Acceptance of Terms",
            icon: <ShieldCheck className="w-6 h-6" />,
            content: "By accessing and using HG Enterprises, you agree to be bound by these Terms and Conditions. Our services are provided to you subject to your compliance with these terms."
        },
        {
            title: "2. Product Information",
            icon: <FileText className="w-6 h-6" />,
            content: "We strive to display products as accurately as possible. However, due to the nature of jewelry (lighting, screen resolution), actual colors and sizes may vary slightly."
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

                <div className="text-center mb-10 md:mb-16">
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Legal Information</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 tracking-tight font-normal uppercase">
                        <span className="italic text-[#D39A9F] normal-case">{pageContent?.title || 'Terms'}</span> & Conditions
                    </h1>
                    <div className="w-16 md:w-20 h-[1px] bg-[#EBCDD0] mx-auto mb-4"></div>
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
                        <div className="space-y-6 md:space-y-8">
                            <p className="text-gray-600 mb-10 md:mb-16 leading-relaxed text-sm md:text-base font-serif text-center max-w-2xl mx-auto">
                                Welcome to HG Enterprises. Before you proceed with your purchase, please read these terms carefully.
                            </p>
                            {defaultSections.map((section, idx) => (
                                <div key={idx} className="flex gap-4 md:gap-8 group p-6 rounded-2xl transition-all hover:bg-gray-50 border border-transparent hover:border-[#F3F4F6]">
                                    <div className="bg-white p-4 rounded-xl h-fit text-black border border-[#EBCDD0] group-hover:bg-[#EBCDD0] transition-all duration-300 flex-shrink-0 shadow-sm">
                                        {section.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg md:text-xl font-display text-black mb-3">{section.title}</h3>
                                        <p className="text-gray-500 leading-relaxed font-serif text-sm md:text-base">{section.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 md:mt-20 p-6 md:p-8 bg-gray-50 rounded-2xl border border-[#F3F4F6]">
                        <h4 className="font-bold text-black mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base font-display">
                            <AlertCircle className="w-5 h-5 text-[#D39A9F]" />
                            Need clarification?
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 font-serif font-bold uppercase tracking-widest">
                            support@hgjewels.com
                        </p>
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

export default TermsAndConditions;
