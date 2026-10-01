import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, ScrollText, PlayCircle } from 'lucide-react';
import api from '../../../utils/api';
import YouTubeEmbed from '../components/YouTubeEmbed';

const DEPARTMENTS = [
    { id: 'jewellery', label: 'Jewellery' },
    { id: 'tools', label: 'Tools' },
    { id: 'machines', label: 'Machines' },
];

const TABS = [
    { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
    { id: 'policies', label: 'Govt. Policies', icon: ScrollText },
    { id: 'videos', label: 'Videos', icon: PlayCircle },
];

/** Public hub for everything the admin publishes under Admin → Resource Centre. */
const ResourceCentre = () => {
    const [params, setParams] = useSearchParams();
    const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'guidelines';
    const [guidelines, setGuidelines] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/guidelines').then((r) => setGuidelines(r.data)).catch(() => {}),
            api.get('/policies').then((r) => setPolicies(r.data)).catch(() => {}),
            api.get('/videos').then((r) => setVideos(r.data)).catch(() => {}),
        ]).finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white min-h-[70vh]">
            <div className="max-w-6xl mx-auto px-5 py-10">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Resource Centre</h1>
                <p className="text-zinc-500 text-sm mt-2">Guides, government policies and videos to help you buy and use with confidence.</p>

                <div className="flex gap-2 mt-8 border-b border-zinc-200 overflow-x-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setParams({ tab: id })}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === id ? 'border-[#8B4356] text-[#8B4356]' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
                        >
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>

                <div className="mt-8">
                    {loading && <p className="text-zinc-400 text-sm">Loading…</p>}

                    {!loading && tab === 'guidelines' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {DEPARTMENTS.map((d) => {
                                const items = guidelines.filter((g) => g.department === d.id);
                                return (
                                    <div key={d.id}>
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">{d.label}</h2>
                                        {items.length === 0 ? <p className="text-sm text-zinc-400">Coming soon.</p> : (
                                            <ul className="space-y-2">
                                                {items.map((g) => (
                                                    <li key={g._id}><Link className="text-zinc-800 hover:text-[#8B4356] font-medium" to={`/guidelines/${d.id}/${g.slug}`}>{g.title}</Link></li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {!loading && tab === 'policies' && (
                        policies.length === 0 ? <p className="text-sm text-zinc-400">No policies published yet.</p> : (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {policies.map((p) => (
                                    <li key={p._id}>
                                        <Link to={`/policies/${p.slug}`} className="flex items-center gap-3 border border-zinc-200 rounded-lg px-4 py-3 hover:border-[#8B4356] hover:text-[#8B4356] transition-colors font-medium text-zinc-800">
                                            <ScrollText size={18} className="shrink-0" /> {p.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}

                    {!loading && tab === 'videos' && (
                        videos.length === 0 ? <p className="text-sm text-zinc-400">No videos published yet.</p> : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map((v) => (
                                    <div key={v._id}>
                                        <YouTubeEmbed url={v.youtubeUrl} title={v.title} />
                                        <p className="mt-2 font-semibold text-zinc-900">{v.title}</p>
                                        <p className="text-[11px] uppercase tracking-widest text-zinc-400">{v.department}</p>
                                        {v.description && <p className="text-sm text-zinc-500 mt-1">{v.description}</p>}
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceCentre;
