import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Save, Trash2, Eye, EyeOff, FileText, ExternalLink, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import { getYouTubeId } from '../../../utils/youtube';

const DEPARTMENTS = [
    { id: 'jewellery', label: 'Jewellery' },
    { id: 'tools', label: 'Tools' },
    { id: 'machines', label: 'Machines' },
];

const VIDEO_DEPARTMENTS = [{ id: 'general', label: 'General' }, ...DEPARTMENTS];

const MODES = {
    policy: {
        title: 'Government Policies',
        subtitle: 'Policies added here appear in the website footer. Clicking one opens its full page.',
        endpoint: '/policies',
        noun: 'Policy',
        publicPath: (item) => `/policies/${item.slug}`,
    },
    guideline: {
        title: 'Guidelines',
        subtitle: 'Guidelines are shown to customers on the Jewellery, Tools and Machines guide pages.',
        endpoint: '/guidelines',
        noun: 'Guideline',
        publicPath: (item) => `/guidelines/${item.department}/${item.slug}`,
    },
    video: {
        title: 'Videos',
        subtitle: 'Paste a YouTube link. Videos appear in the Resource Centre and on the matching Jewellery / Tools / Machines guide page.',
        endpoint: '/videos',
        noun: 'Video',
        publicPath: () => '/resources?tab=videos',
    },
};

const emptyItem = (department, isVideo) => ({ _id: null, title: '', slug: '', content: '', youtubeUrl: '', description: '', order: 0, isActive: true, ...(isVideo ? { department: 'general' } : department ? { department } : {}) });

/**
 * One admin screen for both Policies (flat list) and Guidelines (grouped by department),
 * since both are "titled rich-text pages the admin can add/edit/hide/delete".
 */
const ContentLibraryManager = ({ mode }) => {
    const cfg = MODES[mode];
    const isGuideline = mode === 'guideline';
    const isVideo = mode === 'video';

    const [department, setDepartment] = useState('jewellery');
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(cfg.endpoint, { params: { all: true, ...(isGuideline ? { department } : {}) } });
            setItems(res.data);
        } catch (err) {
            toast.error(`Failed to load ${cfg.noun.toLowerCase()}s`);
        } finally {
            setLoading(false);
        }
    }, [cfg, isGuideline, department]);

    useEffect(() => {
        setSelected(null);
        load();
    }, [load]);

    const startNew = () => setSelected(emptyItem(isGuideline ? department : null, isVideo));

    const save = async () => {
        if (!selected.title.trim()) return toast.error('Title is required');
        if (selected.youtubeUrl?.trim() && !getYouTubeId(selected.youtubeUrl)) return toast.error('Enter a valid YouTube link');
        if (isVideo && !selected.youtubeUrl?.trim()) return toast.error('YouTube link is required');
        try {
            setSaving(true);
            const payload = { ...selected };
            delete payload._id;
            delete payload.createdAt;
            delete payload.updatedAt;
            delete payload.__v;
            if (!payload.slug) delete payload.slug; // server derives it from the title
            if (isVideo) { delete payload.slug; delete payload.content; }
            const res = selected._id
                ? await api.put(`${cfg.endpoint}/${selected._id}`, payload)
                : await api.post(cfg.endpoint, payload);
            toast.success(`${cfg.noun} saved`);
            setSelected(res.data);
            load();
        } catch (err) {
            toast.error(err.response?.data?.error || `Failed to save ${cfg.noun.toLowerCase()}`);
        } finally {
            setSaving(false);
        }
    };

    const remove = async (item) => {
        if (!window.confirm(`Delete "${item.title}"?`)) return;
        try {
            await api.delete(`${cfg.endpoint}/${item._id}`);
            toast.success('Deleted');
            if (selected?._id === item._id) setSelected(null);
            load();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const toggleActive = async (item) => {
        try {
            await api.put(`${cfg.endpoint}/${item._id}`, { isActive: !item.isActive });
            load();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{cfg.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">{cfg.subtitle}</p>
                </div>
                <button
                    onClick={startNew}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:opacity-90"
                >
                    <Plus size={16} /> Add {cfg.noun}
                </button>
            </div>

            {isGuideline && (
                <div className="flex gap-2">
                    {DEPARTMENTS.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setDepartment(d.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${department === d.id ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'}`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-sm text-gray-400">Loading…</p>
                    ) : items.length === 0 ? (
                        <p className="p-6 text-sm text-gray-400">No {cfg.noun.toLowerCase()}s yet. Click “Add {cfg.noun}”.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <li
                                    key={item._id}
                                    className={`flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 ${selected?._id === item._id ? 'bg-primary/5' : ''}`}
                                    onClick={() => setSelected(item)}
                                >
                                    {isVideo ? <PlayCircle size={16} className="text-gray-400 shrink-0" /> : <FileText size={16} className="text-gray-400 shrink-0" />}
                                    <span className={`flex-1 text-sm font-semibold truncate ${item.isActive ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{item.title}</span>
                                    <button title={item.isActive ? 'Hide' : 'Show'} onClick={(e) => { e.stopPropagation(); toggleActive(item); }} className="text-gray-400 hover:text-gray-700">
                                        {item.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button title="Delete" onClick={(e) => { e.stopPropagation(); remove(item); }} className="text-gray-400 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    {!selected ? (
                        <p className="text-sm text-gray-400">Select an item to edit, or add a new {cfg.noun.toLowerCase()}.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <label className="md:col-span-2 block">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Title</span>
                                    <input
                                        value={selected.title}
                                        onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                                        placeholder={isVideo ? 'e.g. How to measure ring size' : isGuideline ? 'e.g. Gemstone Guide' : 'e.g. Lifetime Buyback Policy'}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Display order</span>
                                    <input
                                        type="number"
                                        value={selected.order}
                                        onChange={(e) => setSelected({ ...selected, order: Number(e.target.value) })}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                                    />
                                </label>
                            </div>

                            {isVideo && (
                                <label className="block">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Section</span>
                                    <select
                                        value={selected.department}
                                        onChange={(e) => setSelected({ ...selected, department: e.target.value })}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                                    >
                                        {VIDEO_DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                                    </select>
                                </label>
                            )}

                            <label className="block">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">YouTube link{isVideo ? '' : ' (optional)'}</span>
                                <input
                                    value={selected.youtubeUrl || ''}
                                    onChange={(e) => setSelected({ ...selected, youtubeUrl: e.target.value })}
                                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </label>
                            {getYouTubeId(selected.youtubeUrl) && (
                                <img
                                    src={`https://img.youtube.com/vi/${getYouTubeId(selected.youtubeUrl)}/mqdefault.jpg`}
                                    alt="Video thumbnail"
                                    className="w-60 rounded-lg border border-gray-200"
                                />
                            )}

                            {isVideo ? (
                                <label className="block">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Description (optional)</span>
                                    <textarea
                                        rows={3}
                                        value={selected.description || ''}
                                        onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                                    />
                                </label>
                            ) : (
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Content</span>
                                    <div className="mt-1 bg-white">
                                        <ReactQuill theme="snow" value={selected.content} onChange={(v) => setSelected((s) => ({ ...s, content: v }))} />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={selected.isActive}
                                        onChange={(e) => setSelected({ ...selected, isActive: e.target.checked })}
                                    />
                                    Visible on website
                                </label>
                                <div className="flex items-center gap-3">
                                    {selected._id && (
                                        <a href={cfg.publicPath(selected)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary font-semibold">
                                            <ExternalLink size={14} /> View page
                                        </a>
                                    )}
                                    <button
                                        onClick={save}
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
                                    >
                                        <Save size={16} /> {saving ? 'Saving…' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentLibraryManager;
