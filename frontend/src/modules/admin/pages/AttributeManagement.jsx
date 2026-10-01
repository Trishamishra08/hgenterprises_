import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const DEPARTMENTS = ['jewellery', 'tools', 'machines'];
const TYPES = [
    { id: 'color', label: 'Colour swatches' },
    { id: 'size', label: 'Size' },
    { id: 'text', label: 'Text options' },
];

const emptyAttribute = () => ({ _id: null, key: '', name: '', type: 'text', departments: ['jewellery'], values: [], order: 0, isActive: true });

/**
 * Admin-defined product attributes (Colour, Size, Finish, ...). Anything added here becomes
 * selectable in the product editor and is rendered on the storefront product page automatically.
 */
const AttributeManagement = () => {
    const [attributes, setAttributes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [newValue, setNewValue] = useState({ label: '', value: '#C9A227' });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await api.get('/attributes', { params: { all: true } });
            setAttributes(res.data);
        } catch (err) {
            toast.error('Failed to load attributes');
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const isColor = selected?.type === 'color';

    const addValue = () => {
        const label = newValue.label.trim();
        if (!label) return;
        if (selected.values.some((v) => v.label.toLowerCase() === label.toLowerCase())) return toast.error('Value already exists');
        setSelected({ ...selected, values: [...selected.values, { label, value: isColor ? newValue.value : '' }] });
        setNewValue({ label: '', value: newValue.value });
    };

    const save = async () => {
        if (!selected.name.trim()) return toast.error('Name is required');
        try {
            setSaving(true);
            const { _id, createdAt, updatedAt, __v, ...payload } = selected;
            if (!payload.key) delete payload.key;
            const res = _id ? await api.put(`/attributes/${_id}`, payload) : await api.post('/attributes', payload);
            toast.success('Attribute saved');
            setSelected(res.data);
            load();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save attribute');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (attr) => {
        if (!window.confirm(`Delete attribute "${attr.name}"? Products keep their saved values.`)) return;
        try {
            await api.delete(`/attributes/${attr._id}`);
            if (selected?._id === attr._id) setSelected(null);
            load();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Attributes</h1>
                    <p className="text-sm text-gray-500 mt-1">Define colours, sizes and any other option once — reuse them on every product.</p>
                </div>
                <button onClick={() => setSelected(emptyAttribute())} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow">
                    <Plus size={16} /> Add Attribute
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {attributes.length === 0 ? (
                        <p className="p-6 text-sm text-gray-400">No attributes yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {attributes.map((a) => (
                                <li key={a._id} onClick={() => setSelected(a)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${selected?._id === a._id ? 'bg-primary/5' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{a.name}</p>
                                        <p className="text-[11px] text-gray-400">{a.type} · {a.values.length} values · {a.departments.join(', ') || 'all'}</p>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); remove(a); }} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    {!selected ? (
                        <p className="text-sm text-gray-400">Select an attribute to edit, or add a new one.</p>
                    ) : (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Name</span>
                                    <input value={selected.name} onChange={(e) => setSelected({ ...selected, name: e.target.value })} placeholder="e.g. Metal Colour" className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                                </label>
                                <label className="block">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Type</span>
                                    <select value={selected.type} onChange={(e) => setSelected({ ...selected, type: e.target.value })} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
                                        {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </select>
                                </label>
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Applies to</span>
                                <div className="flex gap-4 mt-2">
                                    {DEPARTMENTS.map((d) => (
                                        <label key={d} className="flex items-center gap-2 text-sm capitalize text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={selected.departments.includes(d)}
                                                onChange={(e) => setSelected({
                                                    ...selected,
                                                    departments: e.target.checked ? [...selected.departments, d] : selected.departments.filter((x) => x !== d),
                                                })}
                                            />
                                            {d}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Values</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selected.values.map((v, i) => (
                                        <span key={`${v.label}-${i}`} className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-2 pr-1 py-1 text-xs font-semibold text-gray-700">
                                            {isColor && <span className="w-4 h-4 rounded-full border border-black/10" style={{ background: v.value }} />}
                                            {v.label}
                                            <button onClick={() => setSelected({ ...selected, values: selected.values.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    {isColor && (
                                        <input type="color" value={newValue.value} onChange={(e) => setNewValue({ ...newValue, value: e.target.value })} className="w-10 h-10 rounded border border-gray-200 p-0.5 cursor-pointer" />
                                    )}
                                    <input
                                        value={newValue.label}
                                        onChange={(e) => setNewValue({ ...newValue, label: e.target.value })}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addValue(); } }}
                                        placeholder={isColor ? 'Colour name, e.g. Rose Gold' : 'Add a value and press Enter'}
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                                    />
                                    <button onClick={addValue} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-bold">Add</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" checked={selected.isActive} onChange={(e) => setSelected({ ...selected, isActive: e.target.checked })} />
                                    Active
                                </label>
                                <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">
                                    <Save size={16} /> {saving ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttributeManagement;
