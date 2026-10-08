import React, { useEffect, useState } from 'react';
import { Shield, Eye, Lock, RefreshCw, UserCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/privacy-policy');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching privacy policy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultPolicies = [
        {
            title: "Data We Collect",
            icon: <Eye className="w-6 h-6" />,
            content: "We collect personal information such as name, email, phone number, and shipping address to process your orders and provide a personalized luxury experience."
        },
        {
            title: "Secure Payments",
            icon: <Lock className="w-6 h-6" />,
            content: "Your payment details are encrypted and processed by Razorpay. HG Enterprises does not store your credit card or bank credentials on our servers."
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
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Your Privacy Matters</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 tracking-tight font-normal uppercase">
                        <span className="italic text-[#D39A9F] normal-case">{pageContent?.title || 'Privacy'}</span> Policy
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
                        <div className="space-y-12">
                            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-[#F3F4F6]">
                                <Shield className="w-8 h-8 text-[#D39A9F] flex-shrink-0" />
                                <p className="text-sm md:text-base font-serif text-gray-600 italic">"HG Enterprises is committed to ensuring that your privacy is protected and your data is used only to enhance your shopping experience."</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {defaultPolicies.map((policy, idx) => (
                                    <div key={idx} className="p-6 md:p-8 rounded-2xl border border-[#F3F4F6] hover:shadow-md transition-all hover:border-[#EBCDD0] group bg-white">
                                        <div className="text-black mb-4 bg-gray-50 w-fit p-3 rounded-xl group-hover:bg-[#EBCDD0] transition-colors">
                                            {policy.icon}
                                        </div>
                                        <h3 className="text-lg md:text-xl font-display text-black mb-3">{policy.title}</h3>
                                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-serif">{policy.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-12 md:mt-20 border-t border-[#F3F4F6] pt-10 md:pt-16">
                        <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border-l-4 border-[#D39A9F]">
                            <p className="text-sm md:text-base text-gray-600 font-serif italic">
                                "We treat your data with the same care and precision we apply to our handcrafted jewelry."
                            </p>
                        </div>
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

export default PrivacyPolicy;
