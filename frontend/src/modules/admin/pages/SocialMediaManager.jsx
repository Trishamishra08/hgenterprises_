import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import { useShop } from '../../../context/ShopContext';
import { SOCIAL_PLATFORMS } from '../../../utils/socialPlatforms';

/** Admin-managed social pages. Active entries appear as icons in the website footer. */
const SocialMediaManager = () => {
    const { settings } = useShop();
    const [pages, setPages] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        api.get('/settings')
            .then((res) => setPages((res.data.socialPages || []).map(({ platform, label, url, isActive }) => ({ platform, label, url, isActive }))))
            .catch(() => toast.error('Failed to load social pages'))
            .finally(() => setLoaded(true));
    }, []);

    const update = (i, patch) => setPages((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

    const save = async () => {
        const cleaned = pages.map((p) => ({ ...p, url: p.url.trim() }));
        if (cleaned.some((p) => !/^https?:\/\//i.test(p.url))) {
            return toast.error('Every link must start with http:// or https://');
        }
        try {
            setSaving(true);
            await api.post('/settings', { socialPages: cleaned });
            toast.success('Social pages saved — the footer is updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Social Media</h1>
                    <p className="text-sm text-gray-500 mt-1">Add your pages. They show as icons in the website footer, in this order.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPages((prev) => [...prev, { platform: 'instagram', label: '', url: '', isActive: true }])}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                    >
                        <Plus size={16} /> Add page
                    </button>
                    <button
                        onClick={save}
                        disabled={saving || !loaded}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-50"
                    >
                        <Save size={16} /> {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>

            {loaded && pages.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-10 border border-dashed border-gray-300 rounded-xl bg-white">
                    No social pages yet. Click “Add page”.
                </p>
            )}

            <div className="space-y-3">
                {pages.map((p, i) => {
                    const meta = SOCIAL_PLATFORMS[p.platform] || SOCIAL_PLATFORMS.other;
                    return (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-[170px_1fr_auto] gap-3 items-center">
                            <select
                                value={p.platform}
                                onChange={(e) => update(i, { platform: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                {Object.entries(SOCIAL_PLATFORMS).map(([id, m]) => <option key={id} value={id}>{m.label}</option>)}
                            </select>
                            <div className="space-y-2">
                                <input
                                    value={p.url}
                                    onChange={(e) => update(i, { url: e.target.value })}
                                    placeholder={meta.placeholder}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                                {p.platform === 'other' && (
                                    <input
                                        value={p.label}
                                        onChange={(e) => update(i, { label: e.target.value })}
                                        placeholder="Name (shown on hover)"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-1 justify-end">
                                <button title={p.isActive ? 'Visible in footer' : 'Hidden'} onClick={() => update(i, { isActive: !p.isActive })} className="p-2 text-gray-500 hover:text-gray-900">
                                    {p.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button title="Remove" onClick={() => setPages((prev) => prev.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-600">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SocialMediaManager;
