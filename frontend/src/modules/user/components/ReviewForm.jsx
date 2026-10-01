import React, { useState } from 'react';
import { Star, Upload, X, Check } from 'lucide-react';
import api from '../../../utils/api';

import { useShop } from '../../../context/ShopContext';

const ReviewForm = ({ productId, productName, onClose }) => {
    const { refreshOrders } = useShop();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();
        files.forEach(file => formData.append('image', file));

        try {
            // Reusing the banner upload route for now as it's already set up for Cloudinary
            const res = await api.post('/banners/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImages(prev => [...prev, res.data.imageUrl]);
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/products/reviews', {
                productId,
                rating,
                comment,
                images
            });
            setSubmitted(true);
            if (refreshOrders) refreshOrders();
            setTimeout(() => onClose(), 2000);
        } catch (error) {
            console.error("Failed to submit review", error.response?.data || error);
            alert(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-emerald-600" size={32} />
                </div>
                <h3 className="font-black text-primary text-lg uppercase tracking-tight">Review Submitted!</h3>
                <p className="text-sm text-gray-500 mt-2">Thank you for sharing your feedback. Once approved, it will appear on the product page and home testimonials.</p>
            </div>
        );
    }

    return (
        <div className="p-6 pb-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-black text-primary uppercase tracking-tight">Rate your experience</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{productName}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-primary"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-transform active:scale-90"
                        >
                            <Star
                                size={32}
                                className={`${star <= rating ? 'fill-gold text-gold' : 'text-gray-100'}`}
                                strokeWidth={star <= rating ? 0 : 2}
                            />
                        </button>
                    ))}
                </div>

                {/* Comment */}
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Write your testimony</label>
                    <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 font-bold text-primary outline-none focus:border-primary transition-all text-sm min-h-[100px] resize-none"
                        placeholder="What do you think about the product quality, delivery, and overall service?"
                    />
                </div>

                {/* Photo Upload */}
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Add Visual Evidence (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                        {images.map((img, i) => (
                            <div key={i} className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden relative group">
                                <img src={img} className="w-full h-full object-cover" alt="" />
                                <button
                                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {images.length < 3 && (
                            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all">
                                <Upload size={16} className="text-gray-300" />
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-[#8B4356] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#8B4356]/20 hover:bg-black transition-all disabled:opacity-50 mt-4"
                >
                    {isSubmitting ? 'Submitting Testimony...' : 'Post Quality Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
