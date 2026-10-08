import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../common/FormControls';

const BG_OPTIONS = [
    { value: 'pink', label: 'Pink' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'mauve', label: 'Mauve' },
    { value: 'grey', label: 'Grey' },
];

const LAYOUT_OPTIONS = [
    { value: 'tall-left', label: 'Tall left' },
    { value: 'wide-top', label: 'Wide top' },
    { value: 'tall-right', label: 'Tall right' },
    { value: 'small-mid', label: 'Small mid' },
    { value: 'wide-mid', label: 'Wide mid' },
    { value: 'tall-mid', label: 'Tall mid' },
    { value: 'small-right', label: 'Small right' },
    { value: 'wide-bottom', label: 'Wide bottom' },
    { value: 'small-bottom', label: 'Small bottom' },
    { value: 'tall-bottom', label: 'Tall bottom' },
];

const ICON_OPTIONS = [
    'gem', 'award', 'sparkles', 'search', 'thumbs-up', 'map-pin', 'home', 'refresh', 'truck', 'plane',
];

const AdvantageEditor = ({ sectionData, onSave }) => {
    const [titleLine1, setTitleLine1] = useState(sectionData?.titleLine1 || 'THE HG');
    const [titleLine2, setTitleLine2] = useState(sectionData?.titleLine2 || 'ADVANTAGE');
    const [introTitleLine1, setIntroTitleLine1] = useState(sectionData?.introTitleLine1 || 'DESIGN &');
    const [introTitleLine2, setIntroTitleLine2] = useState(sectionData?.introTitleLine2 || 'CRAFTSMANSHIP');
    const [introDescription, setIntroDescription] = useState(sectionData?.introDescription || '');
    const [tiles, setTiles] = useState(sectionData?.tiles || []);

    useEffect(() => {
        setTitleLine1(sectionData?.titleLine1 || 'THE HG');
        setTitleLine2(sectionData?.titleLine2 || 'ADVANTAGE');
        setIntroTitleLine1(sectionData?.introTitleLine1 || 'DESIGN &');
        setIntroTitleLine2(sectionData?.introTitleLine2 || 'CRAFTSMANSHIP');
        setIntroDescription(sectionData?.introDescription || '');
        setTiles(sectionData?.tiles || []);
    }, [sectionData]);

    const handleTileChange = (id, field, value) => {
        setTiles((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
    };

    const addTile = () => {
        setTiles((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                titleBold: 'NEW',
                titleItalic: 'Tile',
                description: 'Description here.',
                bg: 'pink',
                layout: 'small-mid',
                icon: 'gem',
            },
        ]);
    };

    const removeTile = (id) => {
        setTiles((prev) => prev.filter((t) => t.id !== id));
    };

    const handleSave = () => {
        onSave({
            id: 'hg-advantage',
            label: 'The HG Advantage',
            titleLine1,
            titleLine2,
            introTitleLine1,
            introTitleLine2,
            introDescription,
            tiles,
        });
        toast.success('HG Advantage section saved');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-black/5 p-6 rounded-none space-y-4">
                <h3 className="font-serif text-lg font-bold uppercase tracking-tight">Intro — Design & Craftsmanship</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Intro title line 1" value={introTitleLine1} onChange={(e) => setIntroTitleLine1(e.target.value)} />
                    <Input label="Intro title line 2 (accent)" value={introTitleLine2} onChange={(e) => setIntroTitleLine2(e.target.value)} />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                        Intro paragraph
                    </label>
                    <textarea
                        value={introDescription}
                        onChange={(e) => setIntroDescription(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                    />
                </div>
            </div>

            <div className="bg-white border border-black/5 p-6 rounded-none space-y-4">
                <h3 className="font-serif text-lg font-bold uppercase tracking-tight">Section Heading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Title line 1" value={titleLine1} onChange={(e) => setTitleLine1(e.target.value)} />
                    <Input label="Title line 2 (accent)" value={titleLine2} onChange={(e) => setTitleLine2(e.target.value)} />
                </div>
            </div>

            <div className="bg-white border border-black/5 p-6 rounded-none space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight">Advantage Tiles</h3>
                    <button
                        type="button"
                        onClick={addTile}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-colors"
                    >
                        <Plus size={12} /> Add Tile
                    </button>
                </div>

                {tiles.map((tile, idx) => (
                    <div key={tile.id} className="border border-gray-100 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Tile {idx + 1}
                            </span>
                            <button type="button" onClick={() => removeTile(tile.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                label="Bold title"
                                value={tile.titleBold}
                                onChange={(e) => handleTileChange(tile.id, 'titleBold', e.target.value)}
                            />
                            <Input
                                label="Italic title"
                                value={tile.titleItalic}
                                onChange={(e) => handleTileChange(tile.id, 'titleItalic', e.target.value)}
                            />
                        </div>
                        <Input
                            label="Description"
                            value={tile.description}
                            onChange={(e) => handleTileChange(tile.id, 'description', e.target.value)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Background</label>
                                <select
                                    value={tile.bg}
                                    onChange={(e) => handleTileChange(tile.id, 'bg', e.target.value)}
                                    className="w-full border border-gray-200 px-2 py-2 text-sm"
                                >
                                    {BG_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Grid layout</label>
                                <select
                                    value={tile.layout}
                                    onChange={(e) => handleTileChange(tile.id, 'layout', e.target.value)}
                                    className="w-full border border-gray-200 px-2 py-2 text-sm"
                                >
                                    {LAYOUT_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Icon</label>
                                <select
                                    value={tile.icon}
                                    onChange={(e) => handleTileChange(tile.id, 'icon', e.target.value)}
                                    className="w-full border border-gray-200 px-2 py-2 text-sm"
                                >
                                    {ICON_OPTIONS.map((icon) => (
                                        <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-black transition-colors"
            >
                <Save size={14} /> Save Section
            </button>
        </div>
    );
};

export default AdvantageEditor;
