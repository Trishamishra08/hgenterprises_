import React from 'react';
import { useShop } from '../../../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Gift, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, settings, orders } = useShop();
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    // First Order Free Logic
    const isFirstOrder = orders && orders.length === 0;
    const shipping = isFirstOrder ? 0 : (settings?.shippingCharge || 0);

    const gstRate = (settings?.gstPercentage || 18) / 100;
    const gstAmount = Math.round(subtotal - (subtotal / (1 + gstRate)));
    const total = subtotal + shipping;

    if (cart.length === 0) {
        return (
            <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6 md:space-y-8 bg-[#FDF5F6] p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-[#EBCDD0]"
                >
                    <div className="relative inline-block">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-[#EBCDD0]/20 rounded-full flex items-center justify-center border border-[#EBCDD0] shadow-inner">
                            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-[#D39A9F]" strokeWidth={1.5} />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-[#D39A9F] rounded-full border-4 border-white"
                        />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                        <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-black">Your Bag is Empty</h2>
                        <p className="text-xs md:text-base text-gray-500 leading-relaxed px-2 md:px-0">
                            Fine jewelry deserves a home. Explore our collection and find pieces that resonate with your soul.
                        </p>
                    </div>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 md:gap-3 bg-black text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full hover:bg-[#D39A9F] transition-all duration-300 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-lg shadow-black/10 active:scale-95"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /> Start Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-24 md:pb-12">
            {/* Back Button */}
            <div className="container mx-auto px-4 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#D39A9F] hover:text-black transition-all group font-bold uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
            </div>
            {/* Header */}
            <div className="bg-[#FDF5F6]/50 border-b border-[#EBCDD0] mb-4 md:mb-8">
                <div className="container mx-auto px-4 py-6 md:py-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-2"
                    >
                        <h1 className="text-2xl md:text-4xl font-serif font-extrabold text-black">Shopping Bag</h1>
                        <p className="text-[#D39A9F] text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold opacity-70">
                            {cart.length} {cart.length === 1 ? 'Design' : 'Designs'} Selected
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    {/* Items Section */}
                    <div className="flex-grow space-y-4 md:space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative bg-[#FDF5F6] p-2.5 md:p-6 rounded-2xl md:rounded-3xl border border-[#EBCDD0] shadow-sm hover:shadow-md transition-all flex gap-3 md:gap-8 overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-24 md:w-32 md:h-40 flex-shrink-0 bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden border border-gray-50">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow flex flex-col py-0.5 md:py-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="space-y-0.5 md:space-y-1">
                                                <h3 className="font-serif font-extrabold text-sm md:text-2xl text-black leading-tight group-hover:text-[#D39A9F] transition-colors line-clamp-1 md:line-clamp-2">{item.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] md:text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                                                        {item.category}
                                                    </span>
                                                    {item.selectedSize && (
                                                        <span className="text-[8px] md:text-xs font-bold uppercase tracking-wider text-black bg-white border border-[#EBCDD0] px-1.5 py-0.5 rounded-md">
                                                            Size: {item.selectedSize}
                                                        </span>
                                                    )}
                                                    <span className="text-[8px] md:text-xs font-mono text-gray-300">#SO-{item.originalId || item.id}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 md:w-5 md:h-5" strokeWidth={1.5} />
                                            </button>
                                        </div>

                                        <div className="mt-auto flex items-end justify-between">
                                            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5 w-fit">
                                                <button
                                                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                                    disabled={(item.quantity || 1) <= 1}
                                                    className="w-6 h-6 md:w-9 md:h-9 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent active:scale-90 transition-all"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-6 md:w-10 text-center font-bold text-[12px] md:text-base text-black">
                                                    {item.quantity || 1}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                    className="w-6 h-6 md:w-9 md:h-9 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 active:scale-90 transition-all"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] uppercase tracking-[0.1em] font-bold text-gray-400 mb-0">Total</p>
                                                <p className="text-sm md:text-lg font-bold text-black">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Gift Wrap Offer */}
                        <div className="bg-[#EBCDD0]/20 border border-[#EBCDD0] rounded-3xl p-4 md:p-6 flex items-center gap-4 md:gap-6 mt-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#D39A9F]">
                                <Gift className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-bold text-sm md:text-base text-black">Complementary Lux Packaging</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Every order arrives in our signature velvet-lined storage box.</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="w-full lg:w-[420px] shrink-0">
                        <div className="bg-[#FDF5F6] p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-[#EBCDD0] shadow-sm sticky top-28 space-y-6 md:space-y-8">
                            <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-black pb-4 border-b border-gray-50 flex items-center justify-between">
                                Summary
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm md:text-base font-semibold text-gray-500">
                                    <span className="uppercase tracking-widest text-[10px] md:text-xs">Subtotal</span>
                                    <span className="text-black">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base font-semibold text-gray-500">
                                    <span className="font-serif">Shipping</span>
                                    {shipping === 0 ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">Free Shipping</span>
                                            {isFirstOrder && <span className="text-[8px] text-emerald-500 font-bold uppercase">First Order Special</span>}
                                        </div>
                                    ) : (
                                        <span className="text-black">₹{shipping}</span>
                                    )}
                                </div>
                                <div className="flex justify-between text-sm md:text-base font-semibold text-gray-500">
                                    <span className="uppercase tracking-widest text-[10px] md:text-xs">GST ({settings?.gstPercentage || 18}% Included)</span>
                                    <span className="text-black">₹{gstAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Grand Total</span>
                                    <span className="text-xl md:text-2xl font-bold text-black">₹{total.toLocaleString()}</span>
                                </div>
                                <p className="text-[10px] md:text-xs text-gray-400 font-medium italic">* Includes {settings?.gstPercentage || 18}% GST and all applicable charges</p>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Link
                                    to="/checkout"
                                    className="w-full bg-black text-white py-4 md:py-5 rounded-[1.25rem] md:rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-[#D39A9F] transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-95 group"
                                >
                                    Secure Checkout
                                    <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </Link>
                                <Link
                                    to="/shop"
                                    className="w-full flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-[#D39A9F] hover:text-black py-2 transition-colors group"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
