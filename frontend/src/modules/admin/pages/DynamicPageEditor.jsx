import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, ArrowLeft, Layout, Type, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

import api from '../../../utils/api';
import toast from 'react-hot-toast';

// Page configuration map to handle titles and keys dynamically
const PAGE_CONFIG = {
    'privacy-policy': { title: 'Privacy Policy', subtitle: 'Manage your privacy policy content' },
    'terms-conditions': { title: 'Terms & Conditions', subtitle: 'Update terms of service' },
    'return-refund-policy': { title: 'Return & Refund Policy', subtitle: 'Edit return and refund processing details' },
    'shipping-policy': { title: 'Shipping Policy', subtitle: 'Manage shipping zones and delivery times' },
    'cancellation-policy': { title: 'Cancellation Policy', subtitle: 'Update order cancellation rules' },
    'jewelry-care': { title: 'Jewelry Care Instructions', subtitle: 'Guide customers on how to care for their jewelry' },
    'warranty-info': { title: 'Warranty Information', subtitle: 'Details about product warranty and coverage' },
    'our-craftsmanship': { title: 'Our Craftsmanship', subtitle: 'Share the story of your artisans' },
    'customization': { title: 'Customization Services', subtitle: 'Details about custom jewelry options' },
    'about-us': { title: 'About Us', subtitle: 'Company history and mission' },
};

const DynamicPageEditor = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();
    const config = PAGE_CONFIG[pageId];

    const [content, setContent] = useState('');
    const [title, setTitle] = useState(config?.title || '');
    const [loading, setLoading] = useState(false);

    // Fetch data from backend
    useEffect(() => {
        const fetchPage = async () => {
            if (!config) return;
            try {
                setLoading(true);
                const res = await api.get(`/pages/${pageId}`);
                setTitle(res.data.title);
                setContent(res.data.content);
            } catch (error) {
                console.error('Error fetching page:', error);
                // If not found, use default title from config
                setTitle(config.title);
                setContent('<p>Write something beautiful...</p>');
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [pageId, config]);

    const handleSave = async () => {
        try {
            toast.loading('Saving changes...', { id: 'save-page' });
            await api.put(`/pages/${pageId}`, { title, content });
            toast.success('Page content updated successfully!', { id: 'save-page' });
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error('Failed to save page content.', { id: 'save-page' });
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];

    if (!config) return null;

    return (
        <div className="max-w-[1200px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <PageHeader
                        title={config.title}
                        subtitle={config.subtitle}
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3E2723] text-white rounded-xl text-sm font-bold hover:bg-[#5D4037] transition-all shadow-lg shadow-[#3E2723]/20 active:scale-95"
                >
                    <Save className="w-5 h-5" />
                    Save Changes
                </button>
            </div>

            {/* Editor Container */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="max-w-3xl space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <Type className="w-3 h-3" /> Page Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:border-[#3E2723] focus:ring-0 outline-none transition-all"
                                placeholder="Enter page title"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-2">
                            <Layout className="w-3 h-3" /> Page Content
                        </label>
                        <div className="prose-admin">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                formats={formats}
                                className="h-[500px] mb-12 bg-white rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Helper Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Pro Tip</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        You can drag and drop images directly into the editor. Use the toolbar to format headers, lists, and links.
                        Changes will be reflected on the live website immediately after saving.
                    </p>
                </div>
            </div>

            {/* Custom Styles for Quill */}
            <style>{`
                .ql-toolbar.ql-snow {
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                    border-color: #e5e7eb;
                    background-color: #f9fafb;
                    padding: 12px;
                }
                .ql-container.ql-snow {
                    border-bottom-left-radius: 0.75rem;
                    border-bottom-right-radius: 0.75rem;
                    border-color: #e5e7eb;
                    font-family: inherit;
                    font-size: 1rem;
                }
                .ql-editor {
                    min-height: 300px;
                    padding: 1.5rem;
                }
            `}</style>
        </div>
    );
};

export default DynamicPageEditor;
