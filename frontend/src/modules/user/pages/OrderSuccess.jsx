import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const OrderSuccess = () => {
    // We might want to clear the cart here, but typically that should happen upon successful order placement logic.
    // For now, let's just assume the cart clearing happens elsewhere or let the user do it manually if it's a mock.

    // Confetti effect removed due to installation issues.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-white animate-in fade-in duration-700">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FDF5F6] border border-[#EBCDD0] rounded-full flex items-center justify-center mb-6 md:mb-8 animate-in zoom-in duration-500 shadow-sm">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-[#D39A9F]" strokeWidth={1.5} />
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-black mb-4 tracking-wide">Order Placed Successfully!</h1>
            <p className="text-gray-500 mb-8 md:mb-10 max-w-lg text-sm md:text-base font-serif leading-relaxed">
                Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Link to="/shop" className="flex-1 bg-black text-white px-8 py-4 rounded-xl hover:bg-[#D39A9F] transition-all font-bold uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/profile/orders" className="flex-1 bg-white border border-gray-200 text-black px-8 py-4 rounded-xl hover:border-black hover:bg-gray-50 transition-all font-bold uppercase tracking-widest text-xs md:text-sm flex items-center justify-center active:scale-95">
                        View My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
