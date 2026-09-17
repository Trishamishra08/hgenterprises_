import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Users, User, Image as ImageIcon,
    Bell, ChevronRight, ChevronDown, Star, HelpCircle, LogOut, Menu, X, ListTree,
    FileText, MessageSquare, Ticket, Settings, Plus, List, BookOpen,
    Clock, RefreshCw, RefreshCcw, RotateCcw, Boxes, ClipboardList, MapPin, Truck, CheckCircle2, XCircle,
<<<<<<< HEAD
    AlertTriangle, FileBarChart, Percent, Video, Calendar
=======
    AlertTriangle, FileBarChart, Percent, Video
>>>>>>> dd7ddac858fbee0fccffc2de9ac0fb6323d953f9
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import api from '../../../utils/api';
import { getSocket } from '../../../utils/socket';
import { playAdminIncomingRing, unlockAdminRingtone } from '../../../utils/adminRingtone';
import logo from '../../user/assets/logo_final.jpg';
import logoName from '../../user/assets/logo_final.jpg';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const [vcPendingCount, setVcPendingCount] = useState(0);
    const [incomingAlert, setIncomingAlert] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { orders } = useShop();

    const allOrders = orders || [];
    const getCount = (status) => allOrders.filter(o => o.status?.toLowerCase() === status.toLowerCase()).length;

    useEffect(() => {
        let alive = true;
        const fetchPending = async () => {
            try {
                const { data } = await api.get('/video-calls/bookings/pending-count');
                if (alive) setVcPendingCount(data.count || 0);
            } catch (_) {
                /* ignore */
            }
        };
        fetchPending();
        const id = setInterval(fetchPending, 20000);
        return () => {
            alive = false;
            clearInterval(id);
        };
    }, [location.pathname]);

    // Unlock audio after first admin gesture (required by browsers / production)
    useEffect(() => {
        const unlock = () => unlockAdminRingtone();
        window.addEventListener('pointerdown', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        return () => {
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
    }, []);

    // Realtime ringtone whenever any admin is logged into the panel
    useEffect(() => {
        let socket;
        try {
            socket = getSocket();
        } catch (_) {
            return undefined;
        }

        const onNewRequest = (payload) => {
            setVcPendingCount((c) => c + 1);
            setIncomingAlert(payload || { contactName: 'Customer' });
            playAdminIncomingRing();
        };

        socket.on('video-call:new-request', onNewRequest);
        return () => {
            socket.off('video-call:new-request', onNewRequest);
        };
    }, []);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        {
            name: 'Categories',
            icon: ImageIcon,
            path: '/admin/categories',
            subItems: [
                { name: 'Jewellery', path: '/admin/categories?department=jewellery', icon: List },
                { name: 'Machines', path: '/admin/categories?department=machine', icon: List },
                { name: 'Tools', path: '/admin/categories?department=tools', icon: List },
                { name: 'Visual Assets', path: '/admin/category-assets', icon: ImageIcon },
            ]
        },
        {
            name: 'Products',
            icon: Package,
            path: '/admin/products',
            subItems: [
                { name: 'Add Product', path: '/admin/products/new', icon: Plus },
                { name: 'Product List', path: '/admin/products', icon: List }
            ]
        },
        { name: 'Coupons', icon: Ticket, path: '/admin/coupons' },
        {
            name: 'Orders',
            icon: ShoppingCart,
            path: '/admin/orders',
            subItems: [
                { name: `All Orders (${allOrders.length})`, path: '/admin/orders?status=all', icon: ShoppingCart },
                { name: `Pending (${getCount('Pending')})`, path: '/admin/orders?status=pending', icon: Clock },
                { name: `Processing (${getCount('Processing')})`, path: '/admin/orders?status=processing', icon: ClipboardList },
                { name: `Shipped (${getCount('Shipped')})`, path: '/admin/orders?status=shipped', icon: Truck },
                { name: `Delivered (${getCount('Delivered')})`, path: '/admin/orders?status=delivered', icon: CheckCircle2 },
                { name: `Cancelled (${getCount('Cancelled')})`, path: '/admin/orders?status=cancelled', icon: XCircle },
            ]
        },
        { name: 'Returns', icon: RotateCcw, path: '/admin/returns' },
        { name: 'Replacements', icon: RefreshCw, path: '/admin/replacements' },
        {
            name: 'Inventory',
            icon: Boxes,
            path: '/admin/inventory',
            subItems: [
                { name: 'Stock Adjustment', path: '/admin/inventory/adjust', icon: RefreshCcw },
                { name: 'Stock History', path: '/admin/inventory/history', icon: Clock },
                { name: 'Low Stock Alerts', path: '/admin/inventory/alerts', icon: AlertTriangle },
                { name: 'Reports', path: '/admin/inventory/reports', icon: FileBarChart }
            ]
        },
        { name: 'Users', icon: Users, path: '/admin/users' },
<<<<<<< HEAD
        {
            name: 'Video Call',
            icon: Video,
            path: '/admin/video-calls',
            badge: vcPendingCount,
            subItems: [
                { name: 'Add Time Slots', path: '/admin/video-calls?tab=slots', icon: Calendar },
                {
                    name: vcPendingCount > 0 ? `User Requests (${vcPendingCount})` : 'User Requests',
                    path: '/admin/video-calls?tab=requests',
                    icon: Bell,
                },
            ],
        },
=======
        { name: 'Video Call', icon: Video, path: '/admin/video-calls' },
>>>>>>> dd7ddac858fbee0fccffc2de9ac0fb6323d953f9
        { name: 'Suggestions', icon: MessageSquare, path: '/admin/suggestions' },
        { name: 'Reviews', icon: Star, path: '/admin/reviews' },
        { name: 'Banners', icon: ImageIcon, path: '/admin/banners' },
        { name: 'Offers', icon: Ticket, path: '/admin/offers' },
        { name: 'Notifications', icon: Bell, path: '/admin/notifications' },

        { name: 'FAQ', icon: MessageSquare, path: '/admin/faq' },
        {
            name: 'Pages',

            icon: FileText,
            path: '/admin/pages',
            subItems: [
                { name: 'Privacy Policy', path: '/admin/pages/privacy-policy', icon: FileText },
                { name: 'Terms & Conditions', path: '/admin/pages/terms-conditions', icon: FileText },
                { name: 'Return & Refund', path: '/admin/pages/return-refund-policy', icon: FileText },
                { name: 'Shipping Policy', path: '/admin/pages/shipping-policy', icon: FileText },
                { name: 'Cancellation Policy', path: '/admin/pages/cancellation-policy', icon: FileText },
                { name: 'Jewelry Care', path: '/admin/pages/jewelry-care', icon: FileText },
                { name: 'Warranty Info', path: '/admin/pages/warranty-info', icon: FileText },
                { name: 'Our Craftsmanship', path: '/admin/pages/our-craftsmanship', icon: FileText },
                { name: 'Customization', path: '/admin/pages/customization', icon: FileText },
                { name: 'About Us', path: '/admin/about-us', icon: FileText },
            ]
        },
        { name: 'Blogs', icon: BookOpen, path: '/admin/blogs' },
        { name: 'Sections', icon: LayoutDashboard, path: '/admin/sections' },
        { name: 'Platform Config', icon: LayoutDashboard, path: '/admin/platform-settings' },
        { name: 'Global Settings', icon: Settings, path: '/admin/settings' },

    ];

    // State for expanded menus
    const [expandedMenu, setExpandedMenu] = useState(() => {
        // Auto-expand if current path matches a subitem
        const activeItem = menuItems.find(item =>
            item.subItems?.some(sub => location.pathname === sub.path)
        );
        return activeItem ? activeItem.name : null;
    });

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    const handleMenuClick = (item) => {
        if (item.subItems) {
            setExpandedMenu(expandedMenu === item.name ? null : item.name);
            if (!isSidebarOpen) setIsSidebarOpen(true); // Auto-open sidebar if expanding menu
        } else {
            navigate(item.path);
            if (window.innerWidth <= 1024) {
                setIsSidebarOpen(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF5F6] text-gray-900 font-outfit admin-font-reset relative flex">
            <style>{`
                .admin-font-reset, .admin-font-reset * {
                    font-family: 'Outfit', sans-serif !important;
                }
                .font-serif {
                    font-family: 'Playfair Display', serif !important;
                }
                .sidebar-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.5);
                    border-radius: 0px;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 0.8);
                }
                .sidebar-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(212, 175, 55, 0.5) transparent;
                    -ms-overflow-style: auto;
                    overflow-y: auto !important;
                }
            `}</style>
            {/* Sidebar Backdrop (Mobile only) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar / Mobile Menu Drawer - Premium Black Theme */}
            <aside
                className={`
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    fixed inset-y-0 left-0 z-[100] bg-black text-white transition-all duration-500 flex flex-col
                    w-[230px] lg:z-50 border-r border-white/5 shadow-2xl h-full
                    ${isSidebarOpen ? 'lg:w-[230px]' : 'lg:w-20'}
                `}
            >
                {/* Header Section */}
                <div className="h-16 flex items-center justify-center px-4 border-b border-white/5 shrink-0 relative bg-black">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <img src={logoName} alt="HG" className="h-10 w-auto object-contain mix-blend-screen" />
                            <div className="flex flex-col">
                                <span className="font-serif font-black text-[10px] tracking-[0.2em] uppercase text-white leading-none">HG Enterprises</span>
                                <span className="text-[7px] text-gold font-bold uppercase tracking-[0.4em] mt-1 italic">Administrative Portal</span>
                            </div>
                        </div>
                    ) : (
                        <img src={logo} alt="HG" className="h-8 w-8 mx-auto object-contain mix-blend-screen" />
                    )}
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors absolute right-2"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Scrollable Container for Nav */}
                <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll bg-black">
                    <nav className="py-4 space-y-0.5 pb-20">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.subItems && location.pathname.startsWith(item.path));
                            const isExpanded = expandedMenu === item.name;

                            return (
                                <div key={item.name} className="flex flex-col px-2">
                                    <button
                                        onClick={() => handleMenuClick(item)}
                                        className={`relative flex items-center gap-3 px-4 py-2 transition-all w-full text-left rounded-none group ${isActive
                                            ? 'bg-white/5 text-gold border-r-2 border-gold font-black'
                                            : 'text-white/50 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-gold' : 'group-hover:text-gold transition-colors'}`} />
                                        {(isSidebarOpen || window.innerWidth <= 1024) && (
                                            <>
                                                <span className={`text-[10px] uppercase tracking-widest flex-1 font-outfit ${isActive ? 'text-gold' : ''}`}>{item.name}</span>
                                                {item.badge > 0 && (
                                                    <span className="min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                                                        {item.badge > 9 ? '9+' : item.badge}
                                                    </span>
                                                )}
                                                {item.subItems && (
                                                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <ChevronDown className="w-3 h-3 text-white/30" />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {!isSidebarOpen && window.innerWidth > 1024 && item.badge > 0 && (
                                            <span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-red-500" />
                                        )}
                                    </button>

                                    {/* Submenu */}
                                    {item.subItems && isExpanded && (isSidebarOpen || window.innerWidth <= 1024) && (
                                        <div className="bg-white/5 overflow-hidden animate-in slide-in-from-top-1 duration-200 mt-0.5">
                                            {item.subItems.map((subItem) => {
                                                const currentPath = location.pathname + location.search;
                                                const isSubActive = currentPath === subItem.path ||
                                                    (subItem.path.includes('?status=all') && location.pathname === subItem.path.split('?')[0] && !location.search);

                                                return (
                                                    <button
                                                        key={subItem.path}
                                                        onClick={() => navigate(subItem.path)}
                                                        className={`flex items-center gap-3 pl-10 pr-4 py-1 w-full text-left transition-all ${isSubActive
                                                            ? 'text-gold font-bold bg-white/5'
                                                            : 'text-white/40 hover:text-gold hover:bg-white/5'
                                                            }`}
                                                    >
                                                        <subItem.icon className="w-3 h-3" />
                                                        <span className="text-[9px] uppercase tracking-widest font-black font-outfit">{subItem.name}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Section - Premium Black Theme */}
                <div className="p-4 border-t border-white/10 shrink-0 bg-black">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 text-white/30 hover:text-red-400 transition-colors w-full px-4 py-2"
                    >
                        <LogOut className="w-4 h-4" />
                        {(isSidebarOpen || window.innerWidth <= 1024) && <span className="text-[10px] uppercase tracking-widest font-black font-outfit">Logout Session</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-grow flex flex-col min-h-screen bg-[#FDF5F6] transition-all duration-500 ease-in-out ${isSidebarOpen ? 'lg:ml-[230px]' : 'lg:ml-20'}`}>
                {/* Topbar */}
                <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0 shadow-sm">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-50 rounded-none transition-all border border-gray-100 lg:border-none"
                        >
                            <Menu className="w-4 h-4 text-gray-500" />
                        </button>
                        <h2 className="text-xs font-serif font-black text-black uppercase tracking-widest line-clamp-1">
                            {menuItems.find(i => i.path === location.pathname)?.name || 'Platform Config'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="text-right hidden sm:block font-serif">
                            <p className="text-[10px] text-black font-black uppercase tracking-tight">Admin Portal</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] italic">Super User</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-50 rounded-none border border-gray-100 flex items-center justify-center text-black font-serif font-black shadow-sm italic">
                            A
                        </div>
                    </div>
                </header>

                {incomingAlert && (
                    <div className="sticky top-14 z-30 mx-3 lg:mx-5 mt-3 rounded-xl border border-[#C5A059] bg-[#3E2723] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Incoming video call request</p>
                            <p className="text-sm mt-0.5">
                                {incomingAlert.contactName || 'Customer'}
                                {incomingAlert.when ? ` · ${incomingAlert.when}` : ''}
                                {incomingAlert.productCount ? ` · ${incomingAlert.productCount} designs` : ''}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIncomingAlert(null);
                                    navigate('/admin/video-calls?tab=requests');
                                }}
                                className="px-4 py-2 rounded-full bg-[#C5A059] text-[#3E2723] text-xs font-bold"
                            >
                                View request
                            </button>
                            <button
                                type="button"
                                onClick={() => setIncomingAlert(null)}
                                className="px-3 py-2 rounded-full border border-white/20 text-xs"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* Sequential Page Content */}
                <div className="bg-[#FDF5F6]">
                    <div className="p-3 lg:p-5 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
