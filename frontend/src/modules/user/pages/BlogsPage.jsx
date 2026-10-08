import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Search, Calendar, User, ArrowRight, X, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Local assets for fragments - ensuring they load
import item3 from '../../../assets/editorial/item3.png';
import item4 from '../../../assets/editorial/item4.png';
import item5 from '../../../assets/editorial/item5.png';
import item6 from '../../../assets/editorial/item6.png';

import api from '../../../utils/api';

const BlogModal = ({ blog, onClose }) => {
    if (!blog) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 50, scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-30 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-lg hover:bg-[#8B4356] hover:text-white transition-all group"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="overflow-y-auto scrollbar-hide">
                    {/* Hero Image inside Modal */}
                    <div className="w-full aspect-[16/10] md:aspect-[21/9] relative bg-gray-100">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=1200'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="p-8 md:p-16">
                        <div className="max-w-2xl mx-auto">
                            <div className="flex items-center gap-3 text-[10px] md:text-sm font-bold text-[#8B4356] uppercase tracking-[0.3em] mb-6">
                                <span>{blog.category}</span>
                                <span className="opacity-30">|</span>
                                <span>{blog.date}</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-display font-bold text-black mb-10 tracking-tight leading-[1.1] uppercase">
                                {blog.title}
                            </h2>

                            {/* Dynamic Content from Editor */}
                            <div className="prose prose-pink max-w-none prose-p:font-serif prose-p:text-gray-700 prose-p:leading-relaxed blog-content-view">
                                <div dangerouslySetInnerHTML={{ __html: blog.content || blog.description }} />
                            </div>

                            <div className="mt-16 pt-8 border-t border-black/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-display font-bold text-[#8B4356]">HG</div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black">{blog.author || 'Editorial Team'}</p>
                                        <p className="text-xs text-gray-400 font-serif">Harshad Gauri Collective</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const BlogsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const { data } = await api.get('/blogs');
            setBlogs(data);
        } catch (error) {
            console.error('Failed to load journals', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        if (selectedBlog) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedBlog]);

    // Constant local fragments to avoid load issues
    const floatingShards = [
        { src: item3, top: '10%', left: '5%', rotate: '6deg' },
        { src: item4, top: '50%', left: '10%', rotate: '-6deg' },
        { src: item5, top: '15%', right: '5%', rotate: '-6deg' },
        { src: item6, top: '60%', right: '8%', rotate: '6deg' }
    ];

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fdf2f8] via-[#eecad5] to-[#fdf2f8] font-body pb-20 selection:bg-[#8B4356] selection:text-white relative overflow-hidden">
            <style>{`
                .blog-content-view p {
                    margin-bottom: 1.5rem;
                }
                .blog-content-view h1, .blog-content-view h2, .blog-content-view h3 {
                    font-family: inherit;
                    color: black;
                    text-transform: uppercase;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 800;
                }
            `}</style>

            <AnimatePresence>
                {selectedBlog && (
                    <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
                )}
            </AnimatePresence>

            {/* Header / Journal Hero */}
            <div className="relative pt-12 md:pt-24 pb-16 md:pb-32 px-4 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {floatingShards.map((shard, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.8, scale: 1, y: [0, (i % 2 === 0 ? -20 : 20), 0] }}
                            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                            className="absolute w-20 h-24 md:w-32 md:h-40 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-white shadow-2xl transition-all"
                            style={{
                                top: shard.top,
                                left: shard.left || 'auto',
                                right: shard.right || 'auto',
                                transform: `rotate(${shard.rotate})`
                            }}
                        >
                            <img src={shard.src} className="w-full h-full object-cover" alt="jewelry fragment" />
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10 pt-10">
                    <span className="text-[#8B4356] text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] mb-4 block">Harshad Gauri</span>
                    <h1 className="text-6xl md:text-9xl font-serif italic text-[#4a1d1d]/90 tracking-tighter mb-6 select-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        Journal
                    </h1>
                    <p className="text-sm md:text-base font-serif italic text-gray-600 max-w-sm mx-auto leading-relaxed border-t border-black/5 pt-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Stories of silver, craftsmanship, <br className="hidden md:block" />
                        and the sparkle in-between.
                    </p>
                </div>
            </div>

            {/* Articles List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#8B4356] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-y-20 md:gap-x-12">
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog, idx) => (
                                <motion.article
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8 }}
                                    className="group flex flex-col items-center text-center w-full"
                                >
                                    <div className="w-full relative mb-4 md:mb-6 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-white/40 group bg-white/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
                                        <div className="aspect-[1.1] md:aspect-[1.4/1] overflow-hidden relative">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?auto=format&fit=crop&q=80&w=1200'}
                                            />
                                            <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-[#8B4356]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-[0.2em] shadow-lg">
                                                {blog.category}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full px-4">
                                        <div className="flex items-center justify-center gap-3 text-[9px] font-bold text-[#8B4356] uppercase tracking-[0.3em] mb-2 opacity-70">
                                            <span>{blog.date}</span>
                                            <span className="opacity-30">|</span>
                                            <span>5 MIN</span>
                                        </div>
                                        <h2 className="text-xl md:text-xl font-serif font-normal text-black mb-3 tracking-tight leading-[1.2] group-hover:text-[#8B4356] transition-colors duration-500 uppercase">
                                            {blog.title}
                                        </h2>
                                        <p className="text-xs md:text-xs text-gray-500 font-serif italic mb-6 leading-relaxed max-w-sm mx-auto line-clamp-2">
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => setSelectedBlog(blog)}
                                                className="text-black font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs border-b border-black/10 pb-1 hover:border-[#8B4356] hover:text-[#8B4356] transition-all duration-300"
                                            >
                                                Read Story
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white/40 backdrop-blur-md rounded-[3rem] border border-dashed border-black/10">
                                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-black/40 uppercase tracking-widest">Journal Archive Empty</h3>
                                <p className="text-gray-500 font-serif italic">Try searching for another masterpiece.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Newsletter Anchor */}
            <div className="mt-32 max-w-5xl mx-auto px-4 overflow-hidden pb-10">
                <div className="bg-[#0a0a0a] text-white p-12 md:p-20 rounded-[3rem] md:rounded-[5rem] relative overflow-hidden text-center group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B4356]/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 max-w-xl mx-auto">
                        <span className="text-[#8B4356] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">The Inner Circle</span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 tracking-tighter text-white">
                            Stay in <span className="italic font-serif font-normal text-[#8B4356]">the loop.</span>
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base font-serif italic mb-10 leading-relaxed text-center">
                            Be the first to hear about our new collections, exclusive events, and the stories behind our craft.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input type="email" placeholder="Your email address" className="flex-grow bg-white/5 border border-white/10 rounded-full px-8 py-4 text-sm focus:outline-none focus:border-[#8B4356] transition-all" />
                            <button className="bg-[#8B4356] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#a64e66] transition-all shadow-xl hover:shadow-[#8B4356]/20">Join</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogsPage;


