import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../utils/api';
import YouTubeEmbed from '../components/YouTubeEmbed';

const PolicyPage = () => {
    const { slug } = useParams();
    const [policy, setPolicy] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');
        api.get(`/policies/${slug}`)
            .then((res) => { if (!cancelled) { setPolicy(res.data); setStatus('ready'); } })
            .catch(() => { if (!cancelled) setStatus('missing'); });
        return () => { cancelled = true; };
    }, [slug]);

    return (
        <div className="bg-white min-h-[60vh]">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-[#8B4356] mb-6">
                    <ArrowLeft size={14} /> Home
                </Link>

                {status === 'loading' && <p className="text-zinc-400 text-sm">Loading…</p>}
                {status === 'missing' && (
                    <div className="py-16 text-center">
                        <h1 className="text-2xl font-serif font-bold mb-2">Policy not found</h1>
                        <p className="text-zinc-500 text-sm">This policy is unavailable or has been removed.</p>
                    </div>
                )}
                {status === 'ready' && policy && (
                    <article>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-2">{policy.title}</h1>
                        <p className="text-[11px] uppercase tracking-widest text-zinc-400 mb-8">
                            Last updated {new Date(policy.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        {policy.youtubeUrl && <YouTubeEmbed url={policy.youtubeUrl} title={policy.title} className="mb-8" />}
                        <div className="rich-content text-zinc-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: policy.content }} />
                    </article>
                )}
            </div>
        </div>
    );
};

export default PolicyPage;
