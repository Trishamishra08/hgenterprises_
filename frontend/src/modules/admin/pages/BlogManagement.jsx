import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, Image as ImageIcon, X, Save, ArrowLeft, Calendar, FileText, Upload
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import PageHeader from '../components/common/PageHeader';
import api from '../../../utils/api';
import { toast } from 'react-hot-toast';

const BlogManagement = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [blogs, setBlogs] = useState([]);

    // Fetch Blogs from Database
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/blogs');
            setBlogs(data);
        } catch (error) {
            toast.error('Failed to load logs');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const [formData, setFormData] = useState({
        _id: null,
        title: '',
        category: '',
        image: '',
        excerpt: '',
        content: '',
        author: 'Admin'
    });

    // Categories
    const categories = ['Style Guide', 'Care Tips', 'New Collections', 'Trends', 'Behind the Scenes'];

    const handleEdit = (blog) => {
        setFormData(blog);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await api.delete(`/blogs/admin/${id}`);
                toast.success('Blog deleted');
                fetchBlogs();
            } catch (error) {
                toast.error('Failed to delete blog');
            }
        }
    };

    const handleAddNew = () => {
        setFormData({
            _id: null,
            title: '',
            category: categories[0],
            image: '',
            excerpt: '',
            content: '',
            author: 'Admin'
        });
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData._id) {
                await api.put(`/blogs/admin/${formData._id}`, formData);
                toast.success('Blog updated');
            } else {
                await api.post('/blogs/admin/create', formData);
                toast.success('Blog created');
            }
            fetchBlogs();
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to save blog');
        }
    };

    // Quill Modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 pb-10 animate-in fade-in duration-500 font-sans">
            {!isEditing ? (
                <>
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 pb-4">
                        <PageHeader
                            title="Blog Management"
                            subtitle="Manage your blog posts, articles, and updates."
                        />
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all active:scale-95 shadow-sm"
                        >
                            <Plus size={16} />
                            Create New Post
                        </button>
                    </div>

                    {/* Stats/Filter Bar */}
                    <div className="bg-white p-2 rounded-none border border-black/5 shadow-sm flex flex-col md:flex-row gap-2 items-center justify-between">
                        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0 bg-[#FDF5F6] p-1">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                            >
                                All Posts
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-3.5 h-3.5" />
                            <input
                                type="text"
                                placeholder="SEARCH DATASET..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#FDF5F6] border-none rounded-none text-[10px] font-black tracking-widest text-black focus:outline-none placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    {/* Blog Feed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredBlogs.map(blog => (
                            <div key={blog.id} className="group bg-white rounded-none border border-black/5 overflow-hidden hover:border-gold/30 transition-all duration-300 flex flex-col h-full shadow-sm">
                                {/* Image */}
                                <div className="h-40 overflow-hidden relative">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-none text-[7px] font-black uppercase tracking-[0.2em] text-[#3E2723] border border-black/5">
                                        {blog.category}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="p-2 bg-white rounded-none text-black shadow-lg hover:bg-gold transition-colors"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="p-2 bg-red-500 rounded-none text-white shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2 text-[8px] text-gray-400 font-black uppercase tracking-widest">
                                        <Calendar size={10} className="text-gold" />
                                        <span>{blog.date}</span>
                                        <span className="text-gold">•</span>
                                        <span>{blog.author}</span>
                                    </div>
                                    <h3 className="text-base font-serif font-black text-black mb-1 uppercase tracking-tight leading-tight group-hover:text-gold transition-colors">{blog.title}</h3>
                                    <p className="text-[10px] text-gray-400 line-clamp-2 mb-3 flex-1 font-medium tracking-tight h-8 uppercase">{blog.excerpt}</p>

                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="w-full py-2 rounded-none bg-[#FDF5F6] text-black text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white border border-black/5 transition-all"
                                    >
                                        Edit Entry
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredBlogs.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No blogs found</h3>
                            <p className="text-gray-500 text-sm mt-1">Try changing filters or create a new post.</p>
                        </div>
                    )}
                </>
            ) : (
                /* Edit Form */
                <form onSubmit={handleSave} className="bg-white rounded-none shadow-sm border border-black/5 overflow-hidden">
                    <div className="p-4 border-b border-black/5 flex items-center justify-between bg-[#FDF5F6]">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-white rounded-none text-gray-400 transition-colors border border-transparent hover:border-black/5"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <div>
                                <h2 className="text-lg font-serif font-black text-black uppercase tracking-tight">
                                    {formData.id ? 'Entry Edit' : 'New Registry'}
                                </h2>
                                <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] mt-0.5">
                                    Blog Management Protocol
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2 rounded-none text-[10px] font-black uppercase tracking-widest text-black bg-white border border-black/5 hover:bg-gray-50"
                            >
                                Abort
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-none text-[10px] font-black uppercase tracking-widest text-white bg-black hover:bg-gold hover:text-black shadow-sm flex items-center gap-2"
                            >
                                <Save size={14} />
                                Commit
                            </button>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Title */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Article Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ENTER TITLE..."
                                    className="w-full p-3 bg-[#FDF5F6] border border-black/5 rounded-none text-base font-serif font-black text-black placeholder:text-gray-300 focus:border-gold outline-none transition-all uppercase tracking-tight"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Short Abstract</label>
                                <textarea
                                    rows="2"
                                    placeholder="BRIEF SUMMARY..."
                                    className="w-full p-3 bg-[#FDF5F6] border border-black/5 rounded-none text-[10px] font-black tracking-widest text-black placeholder:text-gray-300 focus:border-gold outline-none transition-all resize-none uppercase"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            {/* Content Editor */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Full Content Registry</label>
                                <div className="prose-admin">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        modules={modules}
                                        className="bg-white rounded-none h-[400px] mb-12"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Category */}
                            <div className="space-y-2 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Classification</label>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {categories.map(cat => (
                                        <label key={cat} className={`flex items-center gap-3 p-2.5 rounded-none border-2 cursor-pointer transition-all ${formData.category === cat ? 'border-gold bg-gold/5' : 'border-[#FDF5F6] hover:border-black/5'}`}>
                                            <input
                                                type="radio"
                                                name="category"
                                                className="accent-black w-3.5 h-3.5"
                                                checked={formData.category === cat}
                                                onChange={() => setFormData({ ...formData, category: cat })}
                                            />
                                            <span className="text-[10px] font-black text-black uppercase tracking-widest">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Banner Image */}
                            <div className="space-y-2 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Banner Media</label>
                                <div
                                    className="border border-dashed border-black/10 rounded-none p-3 text-center hover:bg-[#FDF5F6] transition-colors group cursor-pointer relative"
                                    onClick={() => document.getElementById('blog-image-upload').click()}
                                >
                                    {uploading ? (
                                        <div className="py-6 flex flex-col items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gold animate-pulse">Synchronizing...</p>
                                        </div>
                                    ) : formData.image ? (
                                        <div className="relative aspect-video rounded-none overflow-hidden mb-3">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData({ ...formData, image: '' });
                                                }}
                                                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-none shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-6 text-gray-300">
                                            <Upload className="w-8 h-8 mx-auto mb-2 opacity-20 group-hover:opacity-100 group-hover:text-gold transition-all" />
                                            <p className="text-[8px] font-black uppercase tracking-widest">Click to Upload Media</p>
                                        </div>
                                    )}
                                    <input
                                        id="blog-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            setUploading(true);
                                            const uploadData = new FormData();
                                            uploadData.append('image', file);

                                            try {
                                                const { data } = await api.post('/upload/image?removeBg=false', uploadData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                setFormData({ ...formData, image: data.url });
                                                toast.success('Media Synchronized');
                                            } catch (error) {
                                                toast.error('Upload failed');
                                                console.error(error);
                                            } finally {
                                                setUploading(false);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="relative mt-2">
                                    <input
                                        type="text"
                                        placeholder="OR PASTE URL..."
                                        className="w-full p-2.5 bg-[#FDF5F6] border border-black/5 rounded-none text-[9px] font-black tracking-widest focus:border-gold outline-none"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* Custom CSS for Quill similar to DynamicPageEditor */}
            <style>{`
                .ql-toolbar.ql-snow {
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                    border-color: #f3f4f6;
                    border-width: 2px;
                    border-bottom: none;
                    background-color: #f9fafb;
                    padding: 12px;
                }
                .ql-container.ql-snow {
                    border-bottom-left-radius: 0.75rem;
                    border-bottom-right-radius: 0.75rem;
                    border-color: #f3f4f6;
                    border-width: 2px;
                    font-family: inherit;
                    font-size: 1rem;
                }
                .ql-editor {
                    min-height: 300px;
                    padding: 1.5rem;
                    color: #111827; /* Dark text */
                }
                .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default BlogManagement;
