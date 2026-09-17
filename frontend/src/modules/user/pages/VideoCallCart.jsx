import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Trash2, Heart, Plus, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import LoginPopup from '../components/video-call/LoginPopup';
import {
    readGuestVcCart,
    removeGuestVcItem,
    clearGuestVcCart,
    groupVcItemsByDepartment,
} from '../../../utils/videoCallCart';

function CartSection({ title, items, onRemove, onSchedule }) {
    if (!items.length) return null;
    return (
        <div className="mb-10">
            <h2 className="font-serif text-xl md:text-2xl text-[#3E2723] mb-5">
                {title}{' '}
                <span className="text-base font-sans text-[#C5A059]">({items.length})</span>
            </h2>
            <div className="space-y-5">
                {items.map((item) => (
                    <div
                        key={item.product}
                        className="bg-white border border-[#EBCDD0] rounded-2xl p-4 flex gap-4 shadow-sm"
                    >
                        <img
                            src={item.image || '/placeholder.png'}
                            alt={item.name}
                            className="w-24 h-24 md:w-28 md:h-28 object-contain bg-[#FDF5F6] rounded-xl border border-[#EBCDD0]/60"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-serif text-lg text-[#3E2723]">{item.name}</h3>
                            <p className="text-xs text-[#3E2723]/45 mt-0.5">Product Code: {item.code}</p>
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs text-[#3E2723]/70">
                                {item.metal && (
                                    <p>
                                        <span className="font-semibold text-[#3E2723]">Metal:</span> {item.metal}
                                    </p>
                                )}
                                {item.stone && (
                                    <p>
                                        <span className="font-semibold text-[#3E2723]">Stone:</span> {item.stone}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3 flex gap-4 text-[11px] font-semibold tracking-wide">
                                <button
                                    type="button"
                                    onClick={() => onRemove(item.product)}
                                    className="text-[#6b252c] hover:underline inline-flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" /> REMOVE
                                </button>
                                <Link
                                    to="/wishlist"
                                    className="text-[#3E2723]/50 hover:text-[#C5A059] hover:underline inline-flex items-center gap-1"
                                >
                                    <Heart className="w-3 h-3" /> MOVE TO WISHLIST
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Link
                    to="/shop"
                    className="flex-1 text-center py-3 border border-[#3E2723]/25 rounded-full text-sm font-semibold tracking-wide text-[#3E2723] hover:bg-white inline-flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> ADD MORE
                </Link>
                <button
                    type="button"
                    onClick={onSchedule}
                    className="flex-1 py-3 rounded-full text-sm font-bold tracking-wide text-white bg-[#3E2723] hover:bg-[#4a322c] transition-colors"
                >
                    SCHEDULE VIDEO CALL
                </button>
            </div>
        </div>
    );
}

export default function VideoCallCart() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loginOpen, setLoginOpen] = useState(false);
    const [pendingDept, setPendingDept] = useState('jewellery');

    const load = async () => {
        setLoading(true);
        try {
            if (user && user.role !== 'admin') {
                const guest = readGuestVcCart();
                if (guest.length) {
                    await api.post('/video-calls/cart/sync', {
                        productIds: guest.map((g) => g.product),
                    });
                    clearGuestVcCart();
                }
                const { data } = await api.get('/video-calls/cart');
                setItems(data.items || []);
            } else {
                setItems(readGuestVcCart());
            }
        } catch (err) {
            setItems(readGuestVcCart());
            if (user && user.role !== 'admin') {
                toast.error(err.response?.data?.message || 'Failed to load cart');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        load();
    }, [user, authLoading]);

    const { jewellery, toolsMachines } = useMemo(
        () => groupVcItemsByDepartment(items),
        [items]
    );

    const removeItem = async (productId) => {
        try {
            if (user && user.role !== 'admin') {
                const { data } = await api.delete(`/video-calls/cart/${productId}`);
                setItems(data.items || []);
            } else {
                setItems(removeGuestVcItem(productId));
            }
            toast.success('Removed');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not remove');
        }
    };

    const goSchedule = (department) => {
        const path = `/video-call/schedule?department=${department}`;
        // Not logged in OR admin session → show login popup (no harsh toast)
        if (!user || user.role === 'admin') {
            setPendingDept(department);
            setLoginOpen(true);
            return;
        }
        navigate(path);
    };

    const onLoginSuccess = () => {
        navigate(`/video-call/schedule?department=${pendingDept}`);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-[#3E2723]/50 text-sm bg-[#FDF5F6]">
                Loading video call cart...
            </div>
        );
    }

    return (
        <div className="bg-[#FDF5F6] min-h-[70vh]">
            <LoginPopup
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSuccess={onLoginSuccess}
                title="Login to schedule"
            />

            <div className="border-b border-[#EBCDD0] bg-white">
                <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-center gap-3 text-[11px] md:text-xs font-semibold tracking-wide uppercase">
                    <span className="flex items-center gap-2 text-[#3E2723]">
                        <span className="w-6 h-6 rounded-full bg-[#3E2723] text-[#C5A059] flex items-center justify-center text-[10px]">
                            1
                        </span>
                        Cart
                    </span>
                    <span className="w-10 h-px bg-[#EBCDD0]" />
                    <span className="flex items-center gap-2 text-[#3E2723]/35">
                        <span className="w-6 h-6 rounded-full border border-[#EBCDD0] flex items-center justify-center text-[10px]">
                            2
                        </span>
                        Book Video Call
                    </span>
                    <span className="w-10 h-px bg-[#EBCDD0]" />
                    <span className="flex items-center gap-2 text-[#3E2723]/35">
                        <span className="w-6 h-6 rounded-full border border-[#EBCDD0] flex items-center justify-center text-[10px]">
                            3
                        </span>
                        Confirmation
                    </span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="rounded-2xl bg-white border border-[#EBCDD0] px-5 py-4 mb-8 flex gap-4 items-start shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#FDF5F6] border border-[#EBCDD0] flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5 text-[#C5A059]" />
                    </div>
                    <div>
                        <p className="font-medium text-[#3E2723] text-sm md:text-base">
                            Browse exquisite jewellery through personalized video consultations.
                        </p>
                        <p className="text-xs md:text-sm text-[#3E2723]/60 mt-1">
                            Explore up to 5 of your favourite designs with a dedicated HG representative.
                        </p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-[#EBCDD0] rounded-2xl bg-white">
                        <p className="text-sm text-[#3E2723]/55 mb-4">
                            No designs yet. Tap Book Now on a product page.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex px-6 py-2.5 rounded-full bg-[#3E2723] text-white text-sm font-medium"
                        >
                            Browse designs
                        </Link>
                    </div>
                ) : (
                    <>
                        <CartSection
                            title="Jewellery Video Call Cart"
                            items={jewellery}
                            onRemove={removeItem}
                            onSchedule={() => goSchedule('jewellery')}
                        />
                        <CartSection
                            title="Tools & Machines Video Call Cart"
                            items={toolsMachines}
                            onRemove={removeItem}
                            onSchedule={() => goSchedule('tools-machines')}
                        />
                    </>
                )}

                <div className="pt-2">
                    <h3 className="text-sm font-semibold text-[#3E2723] mb-4">How does it work?</h3>
                    <div className="grid grid-cols-3 gap-4 text-center text-[11px] text-[#3E2723]/55">
                        <div>
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white border border-[#EBCDD0] flex items-center justify-center text-[#C5A059]">
                                ◆
                            </div>
                            Add up to 5 designs
                        </div>
                        <div>
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white border border-[#EBCDD0] flex items-center justify-center">
                                <Video className="w-4 h-4 text-[#C5A059]" />
                            </div>
                            Schedule & enter details
                        </div>
                        <div>
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white border border-[#EBCDD0] flex items-center justify-center">
                                <Lock className="w-4 h-4 text-[#C5A059]" />
                            </div>
                            Admin + you approve
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
