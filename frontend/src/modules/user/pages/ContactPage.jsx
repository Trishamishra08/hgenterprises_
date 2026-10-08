import React from 'react';
import { Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChitChatSection from '../components/ChitChatSection';
import contactImg from '../../../assets/editorial/item7.png';

const ContactPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen selection:bg-[#D39A9F] selection:text-white">
            <div className="flex flex-col md:flex-row min-h-[calc(100vh-104px)]">
                
                {/* Left Side: Content Column - Ultra Compact & Centered */}
                <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-24 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-black hover:text-[#D39A9F] transition-all group font-bold uppercase tracking-widest text-[10px] mb-8">
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>

                        <div className="text-left mb-10">
                            <span className="text-[#D39A9F] text-[10px] font-bold uppercase tracking-[0.4em] mb-3 block">Personal Assistance</span>
                            <h1 className="text-3xl md:text-5xl font-serif text-black mb-4 tracking-tight font-normal">
                                Contact & <span className="italic text-[#D39A9F]">Concierge</span>
                            </h1>
                            <p className="text-gray-400 text-xs md:text-sm italic font-serif leading-relaxed">
                                Whether you seek styling advice or have a query about your order, our dedicated team is at your service.
                            </p>
                        </div>

                        {/* Direct Contact List - Maximum Compactness */}
                        <div className="space-y-3 mb-10">
                            <div className="p-4 rounded-2xl border border-gray-100 bg-[#FDF5F6] flex items-center gap-4 group hover:bg-white transiton-all duration-500">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-[#EBCDD0] shrink-0">
                                    <Mail className="w-4 h-4 text-[#D39A9F]" />
                                </div>
                                <div className="flex flex-col">
                                     <h3 className="font-serif text-[14px] font-normal text-black leading-none mb-1">Email Concierge</h3>
                                    <a href="mailto:concierge@hgjewels.com" className="text-[10px] font-bold tracking-wider uppercase text-gray-500 hover:text-black transition-all">concierge@hgjewels.com</a>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl border border-gray-100 bg-[#FDF5F6] flex items-center gap-4 group hover:bg-white transiton-all duration-500">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-[#EBCDD0] shrink-0">
                                    <Phone className="w-4 h-4 text-[#D39A9F]" />
                                </div>
                                <div className="flex flex-col">
                                     <h3 className="font-serif text-[14px] font-normal text-black leading-none mb-1">Direct Line</h3>
                                    <a href="tel:+919076062592" className="text-[10px] font-bold tracking-wider uppercase text-gray-500 hover:text-black transition-all">+91 90760 62592</a>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl border border-gray-100 bg-[#FDF5F6] flex items-center gap-4 group hover:bg-white transiton-all duration-500">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-[#EBCDD0] shrink-0">
                                    <MapPin className="w-4 h-4 text-[#D39A9F]" />
                                </div>
                                <div className="flex flex-col">
                                     <h3 className="font-serif text-[14px] font-normal text-black leading-none mb-1">Main Office</h3>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Kandivali East, Mumbai</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Integration */}
                        <div className="mt-8 scale-95 origin-left">
                             <ChitChatSection />
                        </div>
                    </div>
                </div>

                {/* Right Side: Image Column - Full Space Image (Desktop Only) */}
                <div className="hidden md:block md:w-1/2 relative bg-gray-50">
                    <img 
                        src={contactImg} 
                        alt="Harshad Gauri Collective" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-end p-16">
                        <div className="text-white">
                            <p className="text-[10px] uppercase tracking-[0.5em] mb-2 font-bold opacity-80">Heritage Jewellery</p>
                            <h2 className="text-4xl font-display leading-tight">Your Journey to <br/>Brilliance Starts Here</h2>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
