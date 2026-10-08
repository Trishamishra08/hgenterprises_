import React, { useEffect, useState } from 'react';
import { XCircle, Clock, CreditCard, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const CancellationPolicy = () => {
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get('/pages/cancellation-policy');
                setPageContent(res.data);
            } catch (error) {
                console.error("Error fetching cancellation policy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const defaultSections = [
        {
            title: "Cancellation Window",
            icon: <Clock className="w-6 h-6" />,
            content: "Orders can be cancelled within 12 hours of placement. Since our pieces are handcrafted with precision."
        },
        {
            title: "Refund Process",
            icon: <CreditCard className="w-6 h-6" />,
            content: "Once a cancellation is approved, the refund will be initiated to your original payment method."
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

                <div className="text-center mb-12 md:mb-16">
                    <span className="text-[#D39A9F] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Terms of Service</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 tracking-tight font-normal uppercase">
                        {pageContent?.title || (
                            <><span className="italic text-[#D39A9F] normal-case">Cancellation</span> & Refund Policy</>
                        )}
                    </h1>
                    <div className="w-16 md:w-20 h-[1px] bg-[#EBCDD0] mx-auto mb-4"></div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl border border-[#F3F4F6]">
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
                            {defaultSections.map((section, idx) => (
                                <div key={idx} className="p-4 md:p-6 rounded-2xl border border-[#F3F4F6] hover:shadow-md transition-all hover:border-[#EBCDD0] group bg-white">
                                    <div className="text-black mb-3 bg-gray-50 w-fit p-2.5 rounded-xl group-hover:bg-[#EBCDD0] transition-colors">
                                        <div className="w-5 h-5">{section.icon}</div>
                                    </div>
                                    <h3 className="text-base md:text-lg font-serif italic text-black mb-1.5 tracking-tight group-hover:text-[#4A1015] transition-colors">{section.title}</h3>
                                    <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed font-serif">{section.content}</p>
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

export default CancellationPolicy;
