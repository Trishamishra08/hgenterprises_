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

function CartSection({ title, items, onRemove, onSchedule, loggedIn }) {
    if (!items.length) return null;
    return (
        <div className="mb-14">
            <h2 className="text-2xl md:text-[28px] tracking-[0.12em] text-[#2b3a67] mb-5">
                {title} ({items.length})
            </h2>
            <div className="space-y-10">
                {items.map((item) => (
                    <div key={item.product} className="flex flex-col sm:flex-row gap-0 sm:gap-3">
                        <div className="sm:w-[277px] shrink-0 bg-[#f2f2f2] aspect-square flex items-center justify-center">
                            <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 bg-white">
                            <div className="px-6 pt-4 pb-2">
                                <h3 className="text-2xl text-[#1f1f1f]">{item.name}</h3>
                                <p className="text-sm tracking-wide text-zinc-500">Product Code: {item.code}</p>
                            </div>
                            <div>
                                {[['Metal', item.metal], ['Stone', item.stone]].filter(([, v]) => v).map(([label, value]) => (
                                    <div key={label} className="flex border-t border-zinc-100 text-[17px]">
                                        <div className="w-[214px] shrink-0 bg-[#f6f6f8] px-6 py-2.5 text-zinc-600">{label}</div>
                                        <div className="px-6 py-2.5 text-zinc-800">{value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex items-center border-y border-zinc-200 text-[15px] tracking-wide">
                                <button type="button" onClick={() => onRemove(item.product)} className="px-5 py-3 text-zinc-800 hover:text-[#6b252c] border-r border-zinc-200">
                                    REMOVE
                                </button>
                                <Link to="/wishlist" className="px-5 py-3 text-zinc-800 hover:text-[#6b252c]">
                                    MOVE TO WISHLIST{!loggedIn && <span className="text-xs ml-1">(Need login first)</span>}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-12">
                <Link to="/shop" className="px-8 py-4 bg-[#ececec] text-[#444] tracking-[0.2em] text-lg hover:bg-[#e2e2e2] transition-colors">
                    ADD MORE
                </Link>
                <button type="button" onClick={onSchedule} className="px-6 py-4 bg-[#5aa51a] text-white text-lg tracking-wide shadow hover:bg-[#4d9114] transition-colors">
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
                            title="Video Call Cart Items"
                            items={jewellery}
                            onRemove={removeItem}
                            loggedIn={Boolean(user)}
                            onSchedule={() => goSchedule('jewellery')}
                        />
                        <CartSection
                            title="Tools & Machines Video Call Items"
                            items={toolsMachines}
                            onRemove={removeItem}
                            loggedIn={Boolean(user)}
                            onSchedule={() => goSchedule('tools-machines')}
                        />
                    </>
                )}

                <div className="bg-white mt-10 px-6 py-10">
                    <h3 className="text-center text-4xl text-[#1f1f1f] tracking-wide">How does it work?</h3>
                    <div className="w-24 h-0.5 bg-[#2b3a67] mx-auto mt-3 mb-10" />
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 items-start text-center text-sm text-zinc-600">
                        {[
                            { icon: <span className="text-2xl text-[#1f1f1f]">◆</span>, t: 'CURATE YOUR SELECTIONS', d: 'Add 1 to 5 designs that catch your eye' },
                            { icon: <Video className="w-6 h-6 text-[#1f1f1f]" />, t: 'BROWSE YOUR PICKS VIRTUALLY', d: 'Our representative will call you to showcase them live' },
                            { icon: <Lock className="w-6 h-6 text-[#1f1f1f]" />, t: 'MAKE THE PERFECT CHOICE', d: 'Shortlist your favourites and request approval' },
                        ].flatMap((step, i) => [
                            <div key={step.t}>
                                <div className="w-[76px] h-[76px] mx-auto mb-4 rounded-full border border-zinc-800 flex items-center justify-center">{step.icon}</div>
                                <p className="tracking-wide text-[#1f1f1f]">{step.t}</p>
                                <p className="mt-2 text-zinc-500">{step.d}</p>
                            </div>,
                            i < 2 ? <span key={'a' + i} className="hidden md:block self-center text-4xl text-[#ef5f3f] mt-6">→</span> : null,
                        ])}
                    </div>
                </div>
            </div>
        </div>
    );
}
