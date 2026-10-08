import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Edit2, Star, ShoppingBag,
    RefreshCcw, User, Calendar,
    Package, Info, Tag, Layers,
    Truck, CheckCircle2, Ruler, BookOpen
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            {Icon && <Icon className="w-4 h-4 text-[#8D6E63]" />}
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const ProductView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product] = useState({
        id: id,
        name: 'Classic Solitaire Diamond Ring',
        category: 'Rings',
        subcategory: 'Solitaire',
        material: '925 Sterling Silver',
        price: '3,999',
        originalPrice: '5,000',
        discount: '20',
        stock: 15,
        soldCount: 142,
        rating: 4.8,
        status: 'Active',
        description: 'A masterpiece created with precision and care, representing timeless beauty. This sterling silver ring features a brilliant 1-carat equivalent stone that catches light from every angle.',
        specifications: 'Weight: 4.5g, Purity: 92.5%, Stone: Cubic Zirconia',
        supplierInfo: 'Everlast Jewelry Wholesalers',
        returns: 3,
        replacements: 1,
        sizes: ['7', '8', 'Adjustable'],
        tags: {
            isNewArrival: true,
            isTrending: true,
            isFeatured: false
        },
        images: [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'
        ]
    });

    const [reviews] = useState([
        { id: 1, user: 'Aditi Singh', rating: 5, comment: 'Absolutely beautiful! The polish is amazing and it feels very premium.', date: 'Dec 20, 2025' },
        { id: 2, user: 'Rahul V.', rating: 4, comment: 'Great product, but delivery took an extra day.', date: 'Dec 15, 2025' }
    ]);

    const stats = [
        { label: 'Total Sold', value: product.soldCount, icon: ShoppingBag, color: 'text-blue-600' },
        { label: 'Avg Rating', value: `${product.rating} / 5`, icon: Star, color: 'text-amber-500' },
        { label: 'In Stock', value: product.stock, icon: Package, color: 'text-green-600' },
        { label: 'Active Status', value: product.status, icon: CheckCircle2, color: 'text-[#8D6E63]' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full p-6 md:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
                <PageHeader
                    title="Product Overview"
                    subtitle={`Product details for: ${product.name}`}
                    backPath="/admin/products"
                    action={{
                        label: "Edit Product",
                        icon: <Edit2 className="w-4 h-4" />,
                        onClick: () => navigate(`/admin/products/edit/${id}`)
                    }}
                />

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div className={`${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-lg font-medium text-gray-800">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left side: Form Data Content */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 1. Main Product Card */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex gap-2 p-1">
                                    {product.images.map((img, i) => (
                                        <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6 flex flex-col justify-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h2>
                                    <div className="flex gap-2">
                                        <span className="text-[9px] font-bold px-2 py-0.5 bg-[#3E2723] text-white rounded uppercase">{product.category}</span>
                                        <span className="text-[9px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase">{product.subcategory}</span>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                                    <span className="text-xs font-bold text-green-600 ml-2">{product.discount}% OFF</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        <span>Primary Material</span>
                                        <span className="text-gray-900">{product.material}</span>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* 3. Product Description Section */}
                        <Section title="Product Description" icon={BookOpen}>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Description</label>
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 min-h-[120px]">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        </Section>

                        {/* 4. After-Sales Performance Section */}
                        <Section title="Returns & Replacements" icon={RefreshCcw}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl">
                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Total Returns</p>
                                    <h4 className="text-2xl font-bold text-red-700">{product.returns}</h4>
                                    <p className="text-[9px] text-red-400 mt-1 uppercase">Items sent back</p>
                                </div>
                                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Replacements</p>
                                    <h4 className="text-2xl font-bold text-amber-700">{product.replacements}</h4>
                                    <p className="text-[9px] text-amber-500 mt-1 uppercase">Sizing/Quality swaps</p>
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* Right side: Reference Sections */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* 2. Specifications Section */}
                        <Section title="Specifications" icon={Layers}>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[80px]">
                                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                    {product.specifications}
                                </p>
                            </div>
                        </Section>

                        {/* 3. Size Availability Section */}
                        <Section title="Size Availability" icon={Ruler}>
                            <div className="flex flex-wrap gap-3">
                                {['5', '6', '7', '8', '9', '10', '2.2', '2.4', '2.6', 'Adjustable'].map(size => {
                                    const isAvailable = product.sizes.includes(size);
                                    return (
                                        <div
                                            key={size}
                                            className={`min-w-[40px] px-3 h-10 flex items-center justify-center rounded-xl text-[11px] font-black border transition-all ${isAvailable
                                                ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md shadow-[#3E2723]/20 ring-2 ring-white'
                                                : 'bg-gray-50 text-gray-300 border-gray-100'
                                                }`}
                                        >
                                            {size}
                                        </div>
                                    );
                                })}
                            </div>
                        </Section>

                        {/* 4. Supplier Reference Section */}
                        <Section title="Supplier Reference" icon={Truck}>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Vendor / Source</label>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-sm font-bold text-gray-800">{product.supplierInfo}</p>
                                </div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                    * Private internal data
                                </p>
                            </div>
                        </Section>

                        {/* Customer Feedback Mini-Section */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                Product Reviews
                            </h3>
                            <div className="space-y-5">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] font-bold text-gray-800 tracking-tighter uppercase">{rev.user}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2.5 h-2.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-100 fill-gray-100'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-gray-500 italic">"{rev.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
