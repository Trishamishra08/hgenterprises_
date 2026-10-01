import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import api from '../../../../utils/api';

/**
 * Lets the admin pick, per product, which values of each shared Attribute apply
 * (e.g. Metal Colour → Yellow Gold + Rose Gold; Ring Size → 8, 9, 10).
 * Selections are stored on product.attributeOptions as a snapshot of the attribute values.
 */
const ProductAttributesEditor = ({ value = [], onChange, department = 'jewellery', disabled = false }) => {
    const [attributes, setAttributes] = useState([]);

    useEffect(() => {
        api.get('/attributes', { params: { department } })
            .then((res) => setAttributes(res.data))
            .catch(() => setAttributes([]));
    }, [department]);

    const selectedFor = (key) => value.find((o) => o.key === key)?.values || [];

    const toggle = (attr, val) => {
        if (disabled) return;
        const current = selectedFor(attr.key);
        const exists = current.some((v) => v.label === val.label);
        const nextValues = exists ? current.filter((v) => v.label !== val.label) : [...current, { label: val.label, value: val.value || '', image: val.image || '' }];
        const others = value.filter((o) => o.key !== attr.key);
        onChange(nextValues.length ? [...others, { key: attr.key, name: attr.name, type: attr.type, values: nextValues }] : others);
    };

    const setAll = (attr, all) => {
        if (disabled) return;
        const others = value.filter((o) => o.key !== attr.key);
        onChange(all ? [...others, { key: attr.key, name: attr.name, type: attr.type, values: attr.values.map((v) => ({ label: v.label, value: v.value || '', image: v.image || '' })) }] : others);
    };

    if (attributes.length === 0) {
        return (
            <p className="text-[11px] text-gray-400">
                No attributes defined for this department. <Link to="/admin/attributes" className="text-primary font-bold underline">Create attributes</Link>
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {attributes.map((attr) => {
                const selected = selectedFor(attr.key);
                return (
                    <div key={attr._id}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{attr.name}</span>
                            <span className="text-[10px] text-gray-400">
                                {selected.length}/{attr.values.length} selected ·{' '}
                                <button type="button" className="underline" onClick={() => setAll(attr, true)}>all</button>{' / '}
                                <button type="button" className="underline" onClick={() => setAll(attr, false)}>none</button>
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {attr.values.map((val) => {
                                const on = selected.some((v) => v.label === val.label);
                                return (
                                    <button
                                        type="button"
                                        key={val.label}
                                        onClick={() => toggle(attr, val)}
                                        className={`flex items-center gap-2 px-3 py-1.5 border text-[11px] font-semibold transition-colors ${on ? 'border-gold bg-gold/10 text-gray-900' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                    >
                                        {attr.type === 'color' && <span className="w-4 h-4 rounded-full border border-black/10" style={{ background: val.value }} />}
                                        {val.label}
                                        {on && <Check size={12} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <p className="text-[10px] text-gray-400">
                Need another option (e.g. Finish, Polish)? <Link to="/admin/attributes" className="text-primary font-bold underline">Add a new attribute</Link> — it appears here automatically.
            </p>
        </div>
    );
};

export default ProductAttributesEditor;
