import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { mergeHomepageSections } from '../modules/user/data/homepageSectionDefaults';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const { user } = useAuth();

    // Products and Data State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [packs, setPacks] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [banners, setBanners] = useState([]);
    const [settings, setSettings] = useState(null);
    const [homepageSections, setHomepageSections] = useState({});
    const [users, setUsers] = useState([]);
    const [returns, setReturns] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);



    // Persisted Locally (Cart/Wishlist)
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('hg_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('hg_wishlist');
        return saved ? JSON.parse(saved) : [];
    });
    const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
        const saved = localStorage.getItem('hg_recently_viewed');
        return saved ? JSON.parse(saved) : [];
    });

    // User-specific state from backend (via User object)
    const [orders, setOrders] = useState([]);
    const [supportTickets, setSupportTickets] = useState([]);
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [defaultAddressId, setDefaultAddressId] = useState(user?.addresses?.find(a => a.isDefault)?._id || null);

    const [notification, setNotification] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, packsRes, coupRes, banRes, setRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories'),
                    api.get('/products/packs'),
                    api.get('/coupons'),
                    api.get('/banners'),
                    api.get('/settings')
                ]);


                const normalizedCategories = catRes.data.map(c => ({
                    ...c,
                    id: c.id || c._id
                }));

                // Normalize Data (Ensure products have 'id' and top-level price/mrp)
                const normalizedProducts = prodRes.data.map(p => {
                    const baseItem = { ...p, id: p._id || p.id };
                    // If backend uses variants, extract first variant price for top-level usage
                    if (p.variants && p.variants.length > 0) {
                        baseItem.price = p.variants[0].price || 0;
                        baseItem.originalPrice = p.variants[0].mrp || p.variants[0].price || 0;
                        baseItem.stock = p.variants[0].stock || 0;
                    }
                    
                    // Attach Department for easier filtering
                    const catInfo = normalizedCategories.find(c => 
                        (c.name?.toLowerCase() === p.category?.toLowerCase()) || 
                        (c.id?.toLowerCase() === p.category?.toLowerCase())
                    );
                    baseItem.department = catInfo?.department?.toLowerCase() || 'unknown';
                    
                    return baseItem;
                });

                const normalizedPacks = packsRes.data.map(p => ({
                    ...p,
                    id: p.id || p._id
                }));

                const normalizedBanners = banRes.data.map(b => ({
                    ...b,
                    id: b.id || b._id
                }));

                setProducts(normalizedProducts);
                setCategories(normalizedCategories);
                setPacks(normalizedPacks);
                setCoupons(coupRes.data);
                setBanners(normalizedBanners);
                setSettings(setRes.data);
                setHomepageSections(mergeHomepageSections(setRes.data?.homepageSections || {}));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Private/Admin Data Fetch
    const fetchPrivateData = useCallback(async () => {
        if (!user) {
            setOrders([]);
            setUsers([]);
            setSupportTickets([]);
            return;
        }

        try {
            if (user.role === 'admin') {
                // Decoupled admin fetch for resilience
                try {
                    const [ordRes, userRes, prodRes, tktRes] = await Promise.all([
                        api.get('/orders/admin/all'),
                        api.get('/auth/users'),
                        api.get('/products?adminView=true'),
                        api.get('/support/admin/all').catch(() => ({ data: [] }))
                    ]);
                    setOrders(ordRes.data);
                    setUsers(userRes.data);
                    setSupportTickets(tktRes.data);
                    const normalizedAdminProducts = prodRes.data.map(p => {
                        const baseItem = {
                            ...p, id: p._id || p.id,
                            price: p.variants?.[0]?.price || p.price || 0,
                            originalPrice: p.variants?.[0]?.mrp || p.originalPrice || 0,
                            stock: p.variants?.[0]?.stock || p.stock || 0
                        };

                        // Attach Department for consistency
                        const catInfo = categories.find(c => 
                            (c.name?.toLowerCase() === p.category?.toLowerCase()) || 
                            (c.id?.toLowerCase() === p.category?.toLowerCase())
                        );
                        baseItem.department = catInfo?.department?.toLowerCase() || 'unknown';

                        return baseItem;
                    });
                    setProducts(normalizedAdminProducts);
                } catch (adminErr) {
                    console.warn("Admin fetch failed, falling back to user view:", adminErr);
                    const ordRes = await api.get('/orders');
                    setOrders(ordRes.data);
                }
            } else {
                const [ordRes, retRes, revRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/returns/my'),
                    api.get('/products/reviews/my')
                ]);
                setOrders(ordRes.data);
                setReturns(retRes.data);
                setUserReviews(revRes.data);
            }
        } catch (error) {
            console.error("Critical error in fetchPrivateData:", error);
        }
    }, [user]);

    useEffect(() => {
        fetchPrivateData();
    }, [fetchPrivateData]);

    // Fetch user-specific data when user changes
    useEffect(() => {
        if (user) {
            setAddresses(user.addresses || []);
            setDefaultAddressId(user.addresses?.find(a => a.isDefault)?._id || null);
        } else {
            setOrders([]);
            setSupportTickets([]);
            setAddresses([]);
            setDefaultAddressId(null);
        }
    }, [user]);

    // LocalStorage Persistent Settings for Cart and Wishlist
    useEffect(() => {
        localStorage.setItem('hg_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('hg_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);




    const addToCart = (product, quantity = 1) => {
        setCart((prev) => {
            const isItemInCart = prev.find((item) => item.id === product.id);
            if (isItemInCart) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        showNotification("Added to Cart");
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
        showNotification("Removed from Cart");
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        showNotification("Cart cleared");
    };

    const addToWishlist = (product) => {
        if (wishlist.some(item => item.id === product.id)) {
            showNotification("Item already in wishlist");
            return;
        }
        setWishlist((prev) => [...prev, product]);
        showNotification("Item added to wishlist!");
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => prev.filter(item => item.id !== productId && item._id !== productId));
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    // API-backed Support Tickets
    const createTicket = async (ticketData) => {
        try {
            const res = await api.post('/support/create', ticketData);
            setSupportTickets(prev => [res.data, ...prev]);
            showNotification("Support ticket created!");
            return res.data;
        } catch (error) {
            console.error("Error creating ticket:", error);
            showNotification("Failed to create ticket.");
            return null;
        }
    };

    const toggleMenu = (state) => {
        setIsMenuOpen(state !== undefined ? state : !isMenuOpen);
        if (state !== false && isSearchOpen) setIsSearchOpen(false);
    };

    const toggleSearch = (state) => {
        setIsSearchOpen(state !== undefined ? state : !isSearchOpen);
        if (state !== false && isMenuOpen) setIsMenuOpen(false);
    };

    const getActiveCoupons = () => coupons.filter(c => c.active);

    // Online payment: the order was already created on the server (unpaid). Once payment is verified,
    // reflect it locally and empty the cart.
    const registerPaidOrder = (order) => {
        if (order) setOrders(prev => [order, ...prev.filter(o => o._id !== order._id)]);
        setCart([]);
        showNotification("Payment successful! Order placed.");
    };

    const placeOrder = async (orderDetails) => {
        try {
            // Only items, address, payment method and coupon are sent; the server prices the order itself
            const res = await api.post('/orders/place', {
                items: orderDetails.items || cart,
                shippingAddress: orderDetails.shippingAddress,
                paymentMethod: orderDetails.paymentMethod,
                couponCode: orderDetails.couponCode
            });
            const newOrder = res.data.order;
            setOrders(prev => [newOrder, ...prev]);
            setCart([]);
            showNotification("Order placed successfully!");
            return newOrder.orderId;
        } catch (error) {
            console.error("Error placing order:", error);
            showNotification(error.response?.data?.message || "Failed to place order.");
            return null;
        }
    };

    const addAddress = async (addressData) => {
        try {
            const res = await api.post('/auth/address/add', addressData);
            setAddresses(res.data.addresses);
            showNotification("Address added!");
        } catch (error) {
            console.error("Error adding address:", error);
            showNotification("Failed to add address.");
        }
    };

    const setDefaultAddress = (addressId) => {
        setDefaultAddressId(addressId);
        showNotification("Marked as default address");
    };

    const removeAddress = (addressId) => {
        setAddresses(prev => prev.filter(a => a._id !== addressId));
        showNotification("Address removed");
    };

    const updateSection = async (id, data) => {
        const updatedSections = {
            ...homepageSections,
            [id]: { ...homepageSections[id], ...data }
        };
        setHomepageSections(updatedSections);

        try {
            const res = await api.post('/settings', { ...settings, homepageSections: updatedSections });
            setSettings(res.data);
            showNotification("Homepage section updated!");
        } catch (error) {
            console.error("Error updating section:", error);
            showNotification("Failed to update section.");
        }
    };



    // Support userNotifications for Navbar (placeholder or from user object)
    const userNotifications = user?.notifications || [];

    const { login, logout, signup } = useAuth();

    const toggleUserStatus = async (userId) => {
        try {
            const res = await api.patch(`/auth/users/${userId}/status`);
            setUsers(prev => prev.map(u => (u._id === userId || u.id === userId) ? res.data.user : u));
            showNotification(res.data.message);
        } catch (error) {
            console.error("Error toggling user status:", error);
            showNotification("Failed to update user status");
        }
    };

    const updateCategory = async (id, data) => {
        try {
            const res = await api.patch(`/categories/${id}`, data);
            setCategories(prev => prev.map(c => (c.id === id || c._id === id) ? res.data : c));
            showNotification('Category updated successfully');
        } catch (error) {
            console.error('Error updating category:', error);
            showNotification('Failed to update category');
        }
    };

    const deleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id && c._id !== id));
            showNotification('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification('Failed to delete category');
        }
    };

    const createCoupon = async (data) => {
        try {
            const res = await api.post('/coupons', data);
            setCoupons(prev => [res.data, ...prev]);
            showNotification('Coupon created successfully');
            return res.data;
        } catch (error) {
            console.error('Error creating coupon:', error);
            showNotification('Failed to create coupon');
            return null;
        }
    };

    const updateCoupon = async (id, data) => {
        try {
            const res = await api.patch(`/coupons/${id}`, data);
            setCoupons(prev => prev.map(c => (c.id === id || c._id === id) ? res.data : c));
            showNotification('Coupon updated successfully');
            return res.data;
        } catch (error) {
            console.error('Error updating coupon:', error);
            showNotification('Failed to update coupon');
            return null;
        }
    };

    const deleteCoupon = async (id) => {
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(prev => prev.filter(c => c.id !== id && c._id !== id));
            showNotification('Coupon deleted successfully');
        } catch (error) {
            console.error('Error deleting coupon:', error);
            showNotification('Failed to delete coupon');
        }
    };

    const getProductById = useCallback((id) => {
        return products.find(p => p.id === id || p._id === id);
    }, [products]);

    const addProduct = async (productData) => {
        try {
            const res = await api.post('/products', productData);
            const newProduct = { ...res.data, id: res.data._id || res.data.id };
            if (newProduct.variants && newProduct.variants.length > 0) {
                newProduct.price = newProduct.variants[0].price || 0;
                newProduct.originalPrice = newProduct.variants[0].mrp || newProduct.variants[0].price || 0;
                newProduct.stock = newProduct.variants[0].stock || 0;
            }
            setProducts(prev => [newProduct, ...prev]);
            showNotification('Product added successfully!');
            return newProduct;
        } catch (error) {
            console.error('Error adding product:', error);
            showNotification('Failed to add product');
            return null;
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const res = await api.put(`/products/${id}`, productData);
            const updatedProduct = { ...res.data, id: res.data._id || res.data.id };
            if (updatedProduct.variants && updatedProduct.variants.length > 0) {
                updatedProduct.price = updatedProduct.variants[0].price || 0;
                updatedProduct.originalPrice = updatedProduct.variants[0].mrp || updatedProduct.variants[0].price || 0;
                updatedProduct.stock = updatedProduct.variants[0].stock || 0;
            }
            setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? updatedProduct : p));
            showNotification('Product updated successfully!');
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            showNotification('Failed to update product');
            return null;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
            showNotification('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Failed to delete product');
        }
    };

    const bulkSetActive = async (ids, isActive) => {
        try {
            const results = await Promise.all(
                ids.map((id) => api.put(`/products/${id}`, { isActive }).then((res) => res.data).catch(() => null))
            );
            setProducts(prev => prev.map(p => {
                const updated = results.find(r => r && (r._id === p.id || r._id === p._id));
                return updated ? { ...p, ...updated, id: updated._id } : p;
            }));
            const successCount = results.filter(Boolean).length;
            showNotification(`${successCount} product${successCount === 1 ? '' : 's'} ${isActive ? 'made live' : 'hidden'}`);
            return successCount;
        } catch (error) {
            console.error('Error bulk-updating product status:', error);
            showNotification('Bulk update failed');
            return 0;
        }
    };

    const toggleProductStatus = async (id) => {
        try {
            const res = await api.patch(`/products/${id}/status`);
            setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? { ...res.data, id: res.data._id } : p));
            showNotification(`Product status updated to ${res.data.isActive ? 'Active' : 'Inactive'}`);
        } catch (error) {
            console.error('Error toggling product status:', error);
            showNotification('Failed to update product status');
        }
    };

    const getOrderById = (userId, orderId) => {
        return orders.find(o => (o.orderId === orderId || o._id === orderId || o.id === orderId));
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await api.patch(`/orders/${orderId}/status`, { status });
            setOrders(prev => prev.map(o => (o.orderId === orderId || o._id === orderId) ? res.data : o));
            showNotification(`Order status updated to ${status}`);
            return true;
        } catch (error) {
            console.error("Error updating order status:", error);
            showNotification("Failed to update status");
            return false;
        }
    };

    const getReturns = (userId) => {
        return returns.filter(r => r.userId === userId);
    };

    // Notification State
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        const saved = localStorage.getItem('hg_notifications_enabled');
        return saved === 'true';
    });

    const toggleNotificationSettings = async () => {
        if (!notificationsEnabled) {
            // If browser supports notifications, request permission
            if ("Notification" in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setNotificationsEnabled(true);
                    localStorage.setItem('hg_notifications_enabled', 'true');
                    showNotification("Notifications Enabled");
                } else {
                    showNotification("Permission Denied");
                }
            } else {
                setNotificationsEnabled(true);
                localStorage.setItem('hg_notifications_enabled', 'true');
                showNotification("Notifications Enabled");
            }
        } else {
            setNotificationsEnabled(false);
            localStorage.setItem('hg_notifications_enabled', 'false');
            showNotification("Notifications Disabled");
        }
    };

    const deleteUserNotification = (id) => {
        // Since user object is read-only here, we mock it or handle via API in real app
        showNotification("Notification removed");
    };

    const addToRecentlyViewed = useCallback((productId) => {
        if (!productId) return;
        setRecentlyViewedIds((prev) => {
            const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, 12);
            localStorage.setItem('hg_recently_viewed', JSON.stringify(next));
            return next;
        });
    }, []);

    const getRecentlyViewed = useCallback(() => {
        return recentlyViewedIds
            .map((pid) => products.find((p) => p.id === pid || p._id === pid))
            .filter(Boolean);
    }, [recentlyViewedIds, products]);

    return (
        <ShopContext.Provider value={{
            products, categories, packs, coupons, banners, cart, wishlist, orders, addresses, supportTickets,
            users, returns,
            loading, notification, isMenuOpen, isSearchOpen, user, login, logout, signup, userNotifications,
            notificationsEnabled, toggleNotificationSettings, deleteUserNotification,
            settings, setSettings,
            addToCart, removeFromCart, updateQuantity, clearCart,
            addToWishlist, removeFromWishlist,
            placeOrder, registerPaidOrder, addAddress, removeAddress, setDefaultAddress, defaultAddressId,
            createTicket, toggleMenu, toggleSearch, getActiveCoupons, showNotification,
            homepageSections, updateSection, toggleUserStatus, updateCategory, deleteCategory,
            createCoupon, updateCoupon, deleteCoupon, deleteProduct, toggleProductStatus, bulkSetActive,
            getProductById, addProduct, updateProduct,
            getOrderById, updateOrderStatus, getReturns, userReviews,
            refreshOrders: fetchPrivateData,
            addToRecentlyViewed, getRecentlyViewed, recentlyViewedIds
        }}>
            {children}
            {/* Custom Toast Notification */}
            {notification && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-[#3E2723] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 min-w-[300px] justify-center">
                        <div className="bg-white/20 p-1 rounded-full">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-sm tracking-wide">{notification}</span>
                    </div>
                </div>
            )}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
