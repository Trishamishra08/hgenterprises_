import React, { useState } from 'react';
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../common/FormControls';
import toast from 'react-hot-toast';
import { slugifyService, DEFAULT_SERVICES_SECTION } from '../../../user/data/servicesData';

const ServicesEditor = ({ sectionData, onSave }) => {
    const [label, setLabel] = useState(sectionData?.label || 'Our Services');
    const [subtitle, setSubtitle] = useState(sectionData?.subtitle || '');
    const [groups, setGroups] = useState(
        sectionData?.groups?.length ? sectionData.groups : DEFAULT_SERVICES_SECTION.groups
    );
    const [expandedGroup, setExpandedGroup] = useState(null);

    const updateGroup = (groupId, field, value) => {
        setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, [field]: value } : g)));
    };

    const updateItem = (groupId, itemId, field, value) => {
        setGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g;
                return {
                    ...g,
                    items: g.items.map((item) => {
                        if (item.id !== itemId) return item;
                        const updated = { ...item, [field]: value };
                        if (field === 'name' && !item.slug?.length) {
                            updated.slug = slugifyService(value);
                        }
                        return updated;
                    }),
                };
            })
        );
    };

    const addItem = (groupId) => {
        setGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g;
                const newId = `new-${Date.now()}`;
                return {
                    ...g,
                    items: [
                        ...g.items,
                        { id: newId, name: 'New Service', slug: 'new-service', description: '', image: '' },
                    ],
                };
            })
        );
    };

    const removeItem = (groupId, itemId) => {
        setGroups((prev) =>
            prev.map((g) =>
                g.id === groupId ? { ...g, items: g.items.filter((i) => i.id !== itemId) } : g
            )
        );
    };

    const handleSave = () => {
        onSave({ id: 'services', label, subtitle, groups });
        toast.success('Services section saved!');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800">Section Header</h3>
                <Input label="Section Title" value={label} onChange={(e) => setLabel(e.target.value)} />
                <Input label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>

            {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                    >
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                            <h3 className="font-bold text-lg text-black">{group.name}</h3>
                            <p className="text-xs text-gray-400">{group.items?.length || 0} services</p>
                        </div>
                        {expandedGroup === group.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {expandedGroup === group.id && (
                        <div className="p-5 pt-0 space-y-4 border-t border-gray-50">
                            <Input
                                label="Category Label"
                                value={group.name}
                                onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                            />

                            {group.items?.map((item) => (
                                <div key={item.id} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(group.id, item.id)}
                                        className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <Input
                                        label="Service Name"
                                        value={item.name}
                                        onChange={(e) => updateItem(group.id, item.id, 'name', e.target.value)}
                                    />
                                    <Input
                                        label="URL Slug"
                                        value={item.slug || ''}
                                        onChange={(e) => updateItem(group.id, item.id, 'slug', e.target.value)}
                                    />
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={item.description || ''}
                                            onChange={(e) => updateItem(group.id, item.id, 'description', e.target.value)}
                                            rows={3}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addItem(group.id)}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold hover:text-black transition-colors"
                            >
                                <Plus size={16} /> Add Service
                            </button>
                        </div>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-black transition-all"
            >
                <Save size={16} /> Save Services Section
            </button>
        </div>
    );
};

export default ServicesEditor;
