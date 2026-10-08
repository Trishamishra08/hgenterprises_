import React, { useState } from 'react';
import { Send } from 'lucide-react';
import sandsLogo from '../assets/sands-logo.png';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const ChitChatSection = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/suggestions', {
                ...formData,
                userId: user?.id
            });
            toast.success("Thank you for your suggestion! We value your feedback.");
            setFormData({ ...formData, message: '' });
        } catch (error) {
            toast.error("Failed to send suggestion. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-6 md:py-12 bg-gradient-to-br from-[#4A1015] to-[#2A0505] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A1015] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A24D] rounded-full blur-[100px] opacity-10 -translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-2 md:px-4 relative z-10">
                <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-xl md:shadow-2xl">
                    <div className="flex flex-col md:flex-row">

                        {/* Text Content Side */}
                        <div className="w-full md:w-5/12 p-5 md:p-10 bg-[#4A1015] relative flex flex-col justify-center">
                            <div className="mb-3 md:mb-5 text-left">
                                <h2 className="font-display text-2xl md:text-3xl text-white mb-2 md:mb-3 font-serif italic">Help Us Improve</h2>
                                <p className="text-gray-200 font-serif text-xs md:text-base leading-relaxed opacity-90">
                                    Have a suggestion? A new idea?
                                    Tell us what you'd like to see next on HG Enterprises!
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-white/80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></div>
                                    <span className="text-[10px] md:text-xs tracking-wide">Direct to Admin Panel</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="w-full md:w-7/12 p-5 md:p-10 bg-white">
                            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-[10px] font-bold text-[#4A1015] uppercase tracking-wider mb-1">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-[#F5F5F5] border border-transparent rounded-lg focus:bg-white focus:border-[#4A1015] transition-all outline-none text-[#4A1015] placeholder-gray-400 text-xs md:text-sm"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-[10px] font-bold text-[#4A1015] uppercase tracking-wider mb-1">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-[#F5F5F5] border border-transparent rounded-lg focus:bg-white focus:border-[#4A1015] transition-all outline-none text-[#4A1015] placeholder-gray-400 text-xs md:text-sm"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-[10px] font-bold text-[#4A1015] uppercase tracking-wider mb-1">Suggestion</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-3 py-2 bg-[#F5F5F5] border border-transparent rounded-lg focus:bg-white focus:border-[#4A1015] transition-all outline-none text-[#4A1015] placeholder-gray-400 resize-none text-xs md:text-sm"
                                        placeholder="Enter your suggestion here..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-[#4A1015] text-white font-bold py-2.5 md:py-3.5 rounded-lg hover:bg-[#2F0005] transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-widest disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : (
                                        <>
                                            <span>Send Suggestion</span>
                                            <Send className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChitChatSection;
