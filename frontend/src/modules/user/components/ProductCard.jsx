import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Layers, Play } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Link } from 'react-router-dom';
import { resolveCatalogImage } from '../data/catalogImages';

const ProductCard = ({ product, isWishlistPage = false }) => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist, cart, updateQuantity, removeFromCart } = useShop();
    const [flying, setFlying] = useState(false);
    const [flyingType, setFlyingType] = useState('cart');

    const cartItem = cart.find(item => item.id === product.id);

    const isWishlisted = wishlist.some(item => item.id === product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFlyingType('cart');
        setFlying(true);
        addToCart(product);
        setTimeout(() => setFlying(false), 800);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isWishlisted) {
            setFlyingType('heart');
            setFlying(true);
            addToWishlist(product);
            setTimeout(() => setFlying(false), 800);
        } else {
            removeFromWishlist(product.id);
        }
    };

    const primaryImage = resolveCatalogImage(
        product.image || (product.images && product.images[0]),
        product.name,
        product.department || product.category
    );
    const secondaryImage = resolveCatalogImage(
        product.hoverImage || (product.images && product.images[1]),
        product.name,
        product.department || product.category
    ) || primaryImage;

    return (
        <div className="group relative w-full flex flex-col bg-[#FAF8F5] rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <style>
                {`
                    @keyframes flyToCart {
                        0% { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); opacity: 1; border-radius: 20px; }
                        50% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.4); }
                        100% { top: 30px; left: 92%; transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-radius: 50%; }
                    }
                    @keyframes flyToHeart {
                        0% { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); opacity: 1; border-radius: 20px; }
                        50% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.4); }
                        100% { top: 30px; left: 88%; transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-radius: 50%; }
                    }
                    .animate-fly-cart { animation: flyToCart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                    .animate-fly-heart { animation: flyToHeart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                `}
            </style>

            {flying && (
                <img
                    src={primaryImage}
                    alt=""
                    className={`fixed z-[9999] w-32 h-32 object-cover shadow-2xl pointer-events-none border-2 border-white ${flyingType === 'cart' ? 'animate-fly-cart' : 'animate-fly-heart'}`}
                    style={{ left: '50%', top: '50%' }}
                />
            )}

            {/* Image Container */}
            <Link to={`/product/${product.id}`} className="relative w-full aspect-square bg-white overflow-hidden flex items-center justify-center">
                
                {/* Primary Image */}
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain bg-white transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                />

                {/* Secondary Hover Image */}
                <img
                    src={secondaryImage}
                    alt={`${product.name} alternate`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = primaryImage;
                    }}
                    className="absolute inset-0 w-full h-full object-contain bg-white transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                />

                {/* Wishlist Icon (Top Left Circle) */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-2 left-2 md:top-3 md:left-3 z-30 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 transition-transform hover:scale-110 active:scale-95"
                >
                    <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isWishlisted ? 'fill-[#124935] text-[#124935]' : 'text-gray-400 hover:text-[#124935]'}`} strokeWidth={2} />
                </button>
                
                {/* Play Icon (Top Right Circle - decorative) */}
                <div className="absolute top-2 right-2 md:top-3 md:right-3 z-30 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <Play className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 pl-0.5" strokeWidth={2} />
                </div>
            </Link>

            {/* Content Container */}
            <div className="p-2.5 md:p-3.5 flex flex-col bg-[#FAF8F5]">
                
                {/* Title & Rating Row */}
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <h3 className="font-sans text-gray-500 text-xs md:text-sm font-medium capitalize truncate pr-2">
                        {product.name.toLowerCase()}
                    </h3>
                    
                    {/* Rating Pill */}
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1.5 py-0.5 shadow-sm flex-shrink-0">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[9px] md:text-[10px] font-bold text-gray-700">{product.rating || 4.5}</span>
                    </div>
                </div>

                {/* Price, Offer & ADD Button Row */}
                <div className="flex justify-between items-end mt-1">
                    <div className="flex flex-col">
                        <div className="flex items-end gap-1.5 mb-0.5">
                            <span className="text-[#111111] font-bold text-sm md:text-base font-sans tracking-tight leading-none">
                                ₹{(product?.price || 0).toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-gray-400 line-through text-[10px] md:text-xs font-medium leading-none mb-0.5">
                                    ₹{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                        
                        {/* Red Offer Text (Image 3 Style) */}
                        {hasDiscount ? (
                            <span className="text-[#ED6B5A] text-[9.5px] md:text-[11px] font-semibold mt-0.5">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off on Making Charges
                            </span>
                        ) : (
                             <span className="text-transparent text-[9.5px] md:text-[11px] font-semibold mt-0.5">
                                Spacer
                             </span>
                        )}
                    </div>

                    {/* ADD Button or Quantity Controls */}
                    {cartItem ? (
                        <div className="flex items-center bg-[#111111] text-white rounded text-[10px] md:text-xs font-bold overflow-hidden h-7 md:h-8 flex-shrink-0">
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (cartItem.quantity === 1) removeFromCart(product.id); else updateQuantity(product.id, cartItem.quantity - 1); }} 
                                className="px-2.5 md:px-3 hover:bg-white/20 h-full flex items-center justify-center transition-colors"
                            >−</button>
                            <span className="px-1 w-4 md:w-5 text-center">{cartItem.quantity}</span>
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product.id, cartItem.quantity + 1); }} 
                                className="px-2.5 md:px-3 hover:bg-white/20 h-full flex items-center justify-center transition-colors"
                            >+</button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleAddToCart}
                            className="bg-white border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white rounded text-[10px] md:text-xs font-bold px-4 py-1.5 md:px-5 md:py-1.5 transition-colors flex-shrink-0 h-7 md:h-8 flex items-center justify-center"
                        >
                            ADD
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

