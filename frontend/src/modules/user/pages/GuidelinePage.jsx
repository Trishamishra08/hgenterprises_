import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import YouTubeEmbed from '../components/YouTubeEmbed';

const DEPARTMENT_LABELS = { jewellery: 'Jewellery', tools: 'Tools', machines: 'Machines' };

/**
 * Guide hub: left column lists every guideline for the department (active one highlighted),
 * right column shows the selected guideline. Content is managed from Admin → Guidelines.
 */
const GuidelinePage = () => {
    const { department, slug } = useParams();
    const [list, setList] = useState([]);
    const [guideline, setGuideline] = useState(null);
    const [listLoaded, setListLoaded] = useState(false);
    const [videos, setVideos] = useState([]);
    const [status, setStatus] = useState('loading');

    const validDept = Boolean(DEPARTMENT_LABELS[department]);

    useEffect(() => {
        if (!validDept) return;
        setListLoaded(false);
        api.get('/guidelines', { params: { department } })
            .then((res) => setList(res.data))
            .catch(() => setList([]))
            .finally(() => setListLoaded(true));
    }, [department, validDept]);

    useEffect(() => {
        if (!validDept) return;
        api.get('/videos', { params: { department } }).then((res) => setVideos(res.data)).catch(() => setVideos([]));
    }, [department, validDept]);

    useEffect(() => {
        if (!validDept || !slug) return;
        let cancelled = false;
        setStatus('loading');
        api.get(`/guidelines/${department}/${slug}`)
            .then((res) => { if (!cancelled) { setGuideline(res.data); setStatus('ready'); } })
            .catch(() => { if (!cancelled) setStatus('missing'); });
        return () => { cancelled = true; };
    }, [department, slug, validDept]);

    if (!validDept) return <Navigate to="/" replace />;
    // /guidelines/:department → open the first guideline
    if (!slug && listLoaded && list.length > 0) return <Navigate to={`/guidelines/${department}/${list[0].slug}`} replace />;

    return (
        <div className="min-h-[70vh] bg-[#262a63]">
            <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
                <aside className="md:col-span-4 lg:col-span-3">
                    <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#b9bde6] mb-4">{DEPARTMENT_LABELS[department]} Guide</h2>
                    <nav className="flex flex-col gap-2.5">
                        {list.map((g) => (
                            <Link
                                key={g._id}
                                to={`/guidelines/${department}/${g.slug}`}
                                className={`font-serif text-lg transition-colors ${g.slug === slug ? 'text-white' : 'text-[#9ea3d6] hover:text-white'}`}
                            >
                                {g.title}
                            </Link>
                        ))}
                        {listLoaded && list.length === 0 && <p className="text-[#9ea3d6] text-sm">No guidelines published yet.</p>}
                    </nav>
                    <div className="mt-8 flex flex-col gap-1.5 text-xs text-[#9ea3d6]">
                        {Object.entries(DEPARTMENT_LABELS).filter(([id]) => id !== department).map(([id, label]) => (
                            <Link key={id} to={`/guidelines/${id}`} className="hover:text-white">{label} guides →</Link>
                        ))}
                    </div>
                </aside>

                <section className="md:col-span-8 lg:col-span-9 bg-white rounded-lg p-6 md:p-10 min-h-[320px]">
                    {status === 'loading' && slug && <p className="text-zinc-400 text-sm">Loading…</p>}
                    {status === 'missing' && slug && <p className="text-zinc-500">This guide is unavailable.</p>}
                    {!slug && listLoaded && list.length === 0 && <p className="text-zinc-500">Guides for {DEPARTMENT_LABELS[department]} will appear here soon.</p>}
                    {status === 'ready' && guideline && slug && (
                        <article>
                            <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-6">{guideline.title}</h1>
                            {guideline.youtubeUrl && <YouTubeEmbed url={guideline.youtubeUrl} title={guideline.title} className="mb-6" />}
                            <div className="rich-content text-zinc-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: guideline.content }} />
                        </article>
                    )}
                </section>

                {videos.length > 0 && (
                    <section className="md:col-span-12">
                        <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#b9bde6] mb-4">{DEPARTMENT_LABELS[department]} Videos</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {videos.map((v) => (
                                <div key={v._id} className="bg-white/5 rounded-lg p-3">
                                    <YouTubeEmbed url={v.youtubeUrl} title={v.title} />
                                    <p className="mt-2 text-sm font-semibold text-white">{v.title}</p>
                                    {v.description && <p className="text-xs text-[#9ea3d6] mt-0.5">{v.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default GuidelinePage;
