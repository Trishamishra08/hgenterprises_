import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Layers,
    Package,
    Boxes,
    ShoppingBag,
    RefreshCcw,
    Ticket,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    Plus,
    List,
    Share2,
    Monitor,
    Bell,
    Headphones,
    MessageSquare,
    Phone,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    RotateCcw,
    ClipboardList,
    MapPin,
    RefreshCw,
    AlertTriangle,
    FileBarChart,
    Percent,
    Zap,
    SlidersHorizontal,
    ScrollText,
    BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useShop } from '../../../context/ShopContext';
import logo from '../../user/assets/logo_final.jpg';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [combosExpanded, setCombosExpanded] = useState(location.pathname.startsWith('/admin/combo'));
    const [comboProductsExpanded, setComboProductsExpanded] = useState(location.pathname.startsWith('/admin/combo-products'));
    const [productsExpanded, setProductsExpanded] = useState(location.pathname.startsWith('/admin/products'));
    const [notificationsExpanded, setNotificationsExpanded] = useState(location.pathname.startsWith('/admin/notifications'));
    const [inventoryExpanded, setInventoryExpanded] = useState(location.pathname.startsWith('/admin/inventory'));
    const [categoriesExpanded, setCategoriesExpanded] = useState(location.pathname.startsWith('/admin/categories') || location.search.includes('category='));

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const { orders } = useShop();
    const [ordersExpanded, setOrdersExpanded] = useState(location.pathname.startsWith('/admin/orders'));

    // Calculate order counts
    const allOrders = Object.values(orders || {}).flat();
    const orderCounts = {
        all: allOrders.length,
        pending: allOrders.filter(o => o.status === 'Processing').length,
        received: allOrders.filter(o => o.status === 'Received').length,
        processed: allOrders.filter(o => o.status === 'Processed').length,
        shipped: allOrders.filter(o => o.status === 'Shipped').length,
        outForDelivery: allOrders.filter(o => o.status === 'Out For Delivery').length,
        delivered: allOrders.filter(o => o.status === 'Delivered').length,
        cancelled: allOrders.filter(o => o.status === 'Cancelled').length,
    };

    const mainMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Clock, label: 'Subscriptions', path: '/admin/subscriptions' },
    ];

    const secondaryMenuItems = [
        { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
        { icon: Monitor, label: 'Banners', path: '/admin/banners' },
        { icon: Zap, label: 'Offers', path: '/admin/offers' },
        { icon: LayoutDashboard, label: 'Platform Config', path: '/admin/platform-settings' },
        { icon: Share2, label: 'Referrals', path: '/admin/referrals' },
        { icon: SlidersHorizontal, label: 'Attributes', path: '/admin/attributes' },
        { icon: ScrollText, label: 'Policies', path: '/admin/policies' },
        { icon: BookOpen, label: 'Guidelines', path: '/admin/guidelines' },
    ];

    const isActive = (path) => location.pathname.startsWith(path);
    const isCombosActive = location.pathname.startsWith('/admin/combo');
    const isProductsActive = location.pathname.startsWith('/admin/products');
    const isOrdersActive = location.pathname.startsWith('/admin/orders');
    const isNotificationsActive = location.pathname.startsWith('/admin/notifications');
    const isInventoryActive = location.pathname.startsWith('/admin/inventory');

    return (
        <div className="w-64 h-screen bg-primary text-white flex flex-col fixed left-0 top-0 z-50 border-r border-white/5">
            {/* Logo Section with Gold Gradient */}
            <div className="p-8 border-b border-white/5 flex flex-col items-center gap-4 shrink-0 bg-gold-dark/40">
                <img src={logo} alt="HG Admin" className="h-12 w-auto object-contain mix-blend-screen drop-shadow-lg" />
                <div className="flex flex-col items-center">
                    <span className="font-serif font-black text-xs tracking-[0.3em] uppercase text-gold">HG Enterprises</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-1 italic">Administrative Portal</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 min-h-0 overflow-y-auto py-8 px-4 space-y-1 custom-scrollbar scrollbar-hide">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 px-4">Workspace Overview</p>

                {/* Main Items */}
                {mainMenuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive(item.path)
                            ? 'bg-gold/10 text-gold border border-gold/20 shadow-xl shadow-black/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={18} strokeWidth={isActive(item.path) ? 2.5 : 2} className={isActive(item.path) ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
                        <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
                        {isActive(item.path) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(197,160,89,0.8)]" />}
                    </Link>
                ))}

                {/* Categories Dropdown Section - High Density Geometric */}
                <div className="mt-1">
                    <button
                        onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${location.pathname.startsWith('/admin/categories') || location.pathname.startsWith('/admin/sub-categories')
                            ? 'bg-gold/10 text-gold border border-gold/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Layers size={18} strokeWidth={2} className={location.pathname.startsWith('/admin/categories') || location.pathname.startsWith('/admin/sub-categories') ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
                        <span className="font-bold text-[11px] uppercase tracking-wider flex-1 text-left">Categories</span>
                        <div className={`transition-transform duration-300 ${categoriesExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={14} />
                        </div>
                    </button>

                    {categoriesExpanded && (
                        <div className="mt-2 ml-4 pl-4 border-l border-gold/20 space-y-1 animate-in slide-in-from-top-1 duration-200 font-outfit">
                            {[
                                { name: 'Jewellery', slug: 'jewellery' },
                                { name: 'Machines', slug: 'machines' },
                                { name: 'Tools', slug: 'tools' }
                            ].map((cat) => (
                                <Link
                                    key={cat.slug}
                                    to={`/admin/categories?department=${cat.slug}`}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${location.search.includes(`department=${cat.slug}`)
                                        ? 'text-white bg-white/5 shadow-inner border border-white/5'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Layers size={14} />
                                    <span>{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Products Section - Expandable */}
                <div className="mt-1">
                    <button
                        onClick={() => setProductsExpanded(!productsExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isProductsActive
                            ? 'bg-gold/10 text-gold border border-gold/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Package size={18} strokeWidth={isProductsActive ? 2.5 : 2} className={isProductsActive ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
                        <span className="font-bold text-[11px] uppercase tracking-wider flex-1 text-left">Products</span>
                        <div className={`transition-transform duration-300 ${productsExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={14} />
                        </div>
                    </button>

                    {productsExpanded && (
                        <div className="mt-2 ml-4 pl-4 border-l border-gold/20 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            <Link
                                to="/admin/products/new"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${location.pathname === '/admin/products/new'
                                    ? 'text-white bg-white/5 shadow-inner'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <Plus size={14} />
                                <span>Add Product</span>
                            </Link>
                            <Link
                                to="/admin/products"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${location.pathname === '/admin/products'
                                    ? 'text-white bg-white/5 shadow-inner'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <List size={14} />
                                <span>Product List</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Combos Section */}
                <div className="mt-1">
                    <button
                        onClick={() => setCombosExpanded(!combosExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isCombosActive
                            ? 'bg-gold/10 text-gold border border-gold/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Boxes size={18} strokeWidth={isCombosActive ? 2.5 : 2} className={isCombosActive ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
                        <span className="font-bold text-[11px] uppercase tracking-wider flex-1 text-left">Combos</span>
                        {combosExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {combosExpanded && (
                        <div className="mt-2 ml-4 pl-4 border-l border-gold/20 space-y-1">
                            <Link
                                to="/admin/combo-categories"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${location.pathname === '/admin/combo-categories'
                                    ? 'text-white bg-white/5 shadow-inner'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <List size={14} />
                                <span>Combo Categories</span>
                            </Link>
                            {/* Combo Sub-menu Items */}
                            <div>
                                <button
                                    onClick={() => setComboProductsExpanded(!comboProductsExpanded)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${location.pathname.startsWith('/admin/combo-products')
                                        ? 'text-white'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    <Package size={14} />
                                    <span className="flex-1 text-left">Combo Products</span>
                                    {comboProductsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                </button>
                                {comboProductsExpanded && (
                                    <div className="mt-1 ml-4 pl-4 border-l border-gold/10 space-y-1">
                                        <Link
                                            to="/admin/combo-products"
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest ${location.pathname === '/admin/combo-products'
                                                ? 'text-gold'
                                                : 'text-gray-500 hover:text-white'
                                                }`}
                                        >
                                            <span>Product List</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications Section - Expandable */}
                <div className="mt-1">
                    <button
                        onClick={() => setNotificationsExpanded(!notificationsExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isNotificationsActive
                            ? 'bg-gold/10 text-gold border border-gold/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Bell size={18} strokeWidth={isNotificationsActive ? 2.5 : 2} className={isNotificationsActive ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
                        <span className="font-bold text-[11px] uppercase tracking-wider flex-1 text-left">Notifications</span>
                        <div className={`transition-transform duration-300 ${notificationsExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={14} />
                        </div>
                    </button>

                    {notificationsExpanded && (
                        <div className="mt-2 ml-4 pl-4 border-l border-gold/20 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            <Link
                                to="/admin/notifications/add"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${location.pathname === '/admin/notifications/add'
                                    ? 'text-white bg-white/5 shadow-inner'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <Plus size={14} />
                                <span>Create Notification</span>
                            </Link>
                            <Link
                                to="/admin/notifications"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${location.pathname === '/admin/notifications'
                                    ? 'text-white bg-white/5 shadow-inner'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <List size={14} />
                                <span>All Notifications</span>
                            </Link>
                        </div>
                    )}
                </div>



                {/* Order Management Section */}
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 mt-10 px-4">Fulfillment Core</p>

                <div className="mt-1">
                    <button
                        onClick={() => setOrdersExpanded(!ordersExpanded)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${isOrdersActive
                            ? 'bg-gold/10 text-gold border border-gold/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingBag size={18} strokeWidth={isOrdersActive ? 2.5 : 2} className={isOrdersActive ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
                            <span className="font-bold text-[11px] uppercase tracking-wider">Order List</span>
                        </div>
                        <div className={`transition-transform duration-300 ${ordersExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={14} />
                        </div>
                    </button>

                    {ordersExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            {/* All Orders */}
                            <Link
                                to="/admin/orders?status=all"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=all' || location.pathname === '/admin/orders' && !location.search
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={14} />
                                    <span className="font-bold">All Order</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${location.search === '?status=all' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>{orderCounts.all}</span>
                            </Link>

                            {/* Pending Orders */}
                            <Link
                                to="/admin/orders?status=pending"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=pending'
                                    ? 'bg-amber-500/20 text-amber-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-amber-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span className="font-bold">Pending Order</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${location.search === '?status=pending' ? 'bg-amber-500 text-white' : 'bg-white/10 text-gray-400 group-hover:bg-amber-500/50 group-hover:text-white'}`}>{orderCounts.pending}</span>
                            </Link>

                            {/* Received Orders */}
                            <Link
                                to="/admin/orders?status=received"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=received'
                                    ? 'bg-blue-400/20 text-blue-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-blue-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} />
                                    <span className="font-bold">Received Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-blue-400/50 group-hover:text-white">{orderCounts.received}</span>
                            </Link>

                            {/* Processed Orders */}
                            <Link
                                to="/admin/orders?status=processed"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=processed'
                                    ? 'bg-indigo-500/20 text-indigo-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-indigo-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <ClipboardList size={14} />
                                    <span className="font-bold">Processed Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-indigo-500/50 group-hover:text-white">{orderCounts.processed}</span>
                            </Link>

                            {/* Shipped Orders */}
                            <Link
                                to="/admin/orders?status=shipped"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=shipped'
                                    ? 'bg-blue-600/20 text-blue-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-blue-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Truck size={14} />
                                    <span className="font-bold">Shipped Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-blue-600/50 group-hover:text-white">{orderCounts.shipped}</span>
                            </Link>

                            {/* Out For Delivery */}
                            <Link
                                to="/admin/orders?status=out-for-delivery"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=out-for-delivery'
                                    ? 'bg-purple-500/20 text-purple-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-purple-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    <span className="font-bold">Out For Delivery</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-purple-500/50 group-hover:text-white">{orderCounts.outForDelivery}</span>
                            </Link>

                            {/* Delivered */}
                            <Link
                                to="/admin/orders?status=delivered"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=delivered'
                                    ? 'bg-green-500/20 text-green-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-green-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} />
                                    <span className="font-bold">Delivered Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-green-500/50 group-hover:text-white">{orderCounts.delivered}</span>
                            </Link>

                            {/* Cancelled */}
                            <Link
                                to="/admin/orders?status=cancelled"
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs group ${location.search === '?status=cancelled'
                                    ? 'bg-red-500/20 text-red-200'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-red-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <XCircle size={14} />
                                    <span className="font-bold">Cancelled Order</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 group-hover:bg-red-500/50 group-hover:text-white">{orderCounts.cancelled}</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Returns */}
                <Link
                    to="/admin/returns"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${location.pathname === '/admin/returns'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <RotateCcw size={20} strokeWidth={location.pathname === '/admin/returns' ? 2.5 : 2} />
                    <span className="font-bold text-sm">Returns</span>
                </Link>

                {/* Replacements */}
                <Link
                    to="/admin/replacements"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${location.pathname === '/admin/replacements'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <RefreshCw size={20} strokeWidth={location.pathname === '/admin/replacements' ? 2.5 : 2} />
                    <span className="font-bold text-sm">Replacements</span>
                </Link>

                {/* Inventory Management */}
                {/* Inventory Management Section - Expandable */}
                <div className="mt-1">
                    <button
                        onClick={() => setInventoryExpanded(!inventoryExpanded)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isInventoryActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Boxes size={20} strokeWidth={isInventoryActive ? 2.5 : 2} />
                            <span className="font-bold text-sm">Inventory</span>
                        </div>
                        <div className={`transition-transform duration-200 ${inventoryExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>

                    {inventoryExpanded && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-1 duration-200">
                            <Link
                                to="/admin/inventory"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <LayoutDashboard size={14} />
                                <span className="font-semibold">Overview</span>
                            </Link>
                            <Link
                                to="/admin/inventory/adjust"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory/adjust'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <RefreshCcw size={14} />
                                <span className="font-semibold">Stock Adjustment</span>
                            </Link>
                            <Link
                                to="/admin/inventory/history"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory/history'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Clock size={14} />
                                <span className="font-semibold">Stock History</span>
                            </Link>
                            <Link
                                to="/admin/inventory/alerts"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory/alerts'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <AlertTriangle size={14} />
                                <span className="font-semibold">Low Stock Alerts</span>
                            </Link>
                            <Link
                                to="/admin/inventory/reports"
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${location.pathname === '/admin/inventory/reports'
                                    ? 'bg-primary/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <FileBarChart size={14} />
                                <span className="font-semibold">Reports</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Secondary Items */}
                {secondaryMenuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive(item.path)
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                        <span className="font-bold text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 space-y-1 shrink-0">
                <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                    <Settings size={20} />
                    <span className="font-bold text-sm">Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-left"
                >
                    <LogOut size={20} />
                    <span className="font-bold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
