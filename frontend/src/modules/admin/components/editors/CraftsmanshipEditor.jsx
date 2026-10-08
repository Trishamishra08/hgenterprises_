import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../common/FormControls';
import { getYoutubeId, getYoutubeThumbnail } from '../../../user/data/homepageSectionDefaults';

const CraftsmanshipEditor = ({ sectionData, onSave }) => {
    const [titleLine1, setTitleLine1] = useState(sectionData?.titleLine1 || 'DESIGN &');
    const [titleLine2, setTitleLine2] = useState(sectionData?.titleLine2 || 'CRAFTSMANSHIP');
    const [description, setDescription] = useState(sectionData?.description || '');
    const [videos, setVideos] = useState(sectionData?.videos || []);

    useEffect(() => {
        setTitleLine1(sectionData?.titleLine1 || 'DESIGN &');
        setTitleLine2(sectionData?.titleLine2 || 'CRAFTSMANSHIP');
        setDescription(sectionData?.description || '');
        setVideos(sectionData?.videos || []);
    }, [sectionData]);

    const handleVideoChange = (id, field, value) => {
        setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
    };

    const addVideo = () => {
        setVideos((prev) => [
            ...prev,
            { id: Date.now().toString(), youtubeUrl: '', caption: '', thumbnail: '' },
        ]);
    };

    const removeVideo = (id) => {
        setVideos((prev) => prev.filter((v) => v.id !== id));
    };

    const handleSave = () => {
        onSave({
            id: 'design-craftsmanship',
            label: 'Design & Craftsmanship',
            titleLine1,
            titleLine2,
            description,
            videos: videos.filter((v) => v.youtubeUrl || v.caption),
        });
        toast.success('Design & Craftsmanship section saved');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-black/5 p-6 rounded-none space-y-4">
                <h3 className="font-serif text-lg font-bold uppercase tracking-tight">Section Heading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Title line 1" value={titleLine1} onChange={(e) => setTitleLine1(e.target.value)} />
                    <Input label="Title line 2 (accent)" value={titleLine2} onChange={(e) => setTitleLine2(e.target.value)} />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                        Description paragraph
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold"
                    />
                </div>
            </div>

            <div className="bg-white border border-black/5 p-6 rounded-none space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                        <Youtube size={18} /> YouTube Videos
                    </h3>
                    <button
                        type="button"
                        onClick={addVideo}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-colors"
                    >
                        <Plus size={12} /> Add Video
                    </button>
                </div>
                <p className="text-xs text-gray-500">
                    Paste a full YouTube URL. Thumbnail is auto-fetched; optional custom thumbnail URL overrides it.
                </p>

                {videos.map((video, idx) => {
                    const ytId = getYoutubeId(video.youtubeUrl);
                    const preview = getYoutubeThumbnail(video.youtubeUrl, video.thumbnail);
                    return (
                        <div key={video.id} className="border border-gray-100 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Video {idx + 1}
                                </span>
                                <button type="button" onClick={() => removeVideo(video.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <Input
                                label="YouTube URL"
                                value={video.youtubeUrl}
                                onChange={(e) => handleVideoChange(video.id, 'youtubeUrl', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <Input
                                label="Caption (below video)"
                                value={video.caption}
                                onChange={(e) => handleVideoChange(video.id, 'caption', e.target.value)}
                                placeholder="THE CRAFTSMEN OF HG"
                            />
                            <Input
                                label="Custom thumbnail URL (optional)"
                                value={video.thumbnail || ''}
                                onChange={(e) => handleVideoChange(video.id, 'thumbnail', e.target.value)}
                            />
                            {preview && (
                                <img src={preview} alt="" className="w-full max-w-xs h-auto border border-gray-100" />
                            )}
                            {video.youtubeUrl && !ytId && (
                                <p className="text-xs text-red-500">Invalid YouTube URL — check the link format.</p>
                            )}
                        </div>
                    );
                })}

                {videos.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No videos yet. Add up to 2 for the homepage row.</p>
                )}
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

export default CraftsmanshipEditor;
