import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { DEFAULT_HOMEPAGE_SECTIONS, getYoutubeId, getYoutubeThumbnail } from '../data/homepageSectionDefaults';

const VideoCard = ({ video, onPlay }) => {
    const thumb = getYoutubeThumbnail(video.youtubeUrl, video.thumbnail);
    const videoId = getYoutubeId(video.youtubeUrl);

    return (
        <div className="craft-video-card">
            <button
                type="button"
                className="craft-video-thumb-wrap"
                onClick={() => videoId && onPlay(videoId)}
                aria-label={`Play ${video.caption}`}
            >
                {thumb ? (
                    <img src={thumb} alt={video.caption} className="craft-video-thumb" />
                ) : (
                    <div className="craft-video-thumb craft-video-thumb--empty" />
                )}
                <span className="craft-video-play">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                </span>
            </button>
            {video.caption && (
                <p className="craft-video-caption">{video.caption}</p>
            )}
        </div>
    );
};

const DesignCraftsmanshipSection = () => {
    const { homepageSections } = useShop();
    const sectionData = {
        ...DEFAULT_HOMEPAGE_SECTIONS['design-craftsmanship'],
        ...(homepageSections?.['design-craftsmanship'] || {}),
    };

    const [activeVideoId, setActiveVideoId] = useState(null);
    const videos = (sectionData.videos || []).filter((v) => getYoutubeId(v.youtubeUrl));

    if (!videos.length && !sectionData.description) return null;

    return (
        <section className="craft-section bg-white" aria-label="Design and craftsmanship">
            <div className="craft-inner">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="craft-header"
                >
                    <h2 className="craft-title">
                        <span>{sectionData.titleLine1 || 'DESIGN &'}</span>{' '}
                        <span className="craft-title-accent">{sectionData.titleLine2 || 'CRAFTSMANSHIP'}</span>
                    </h2>
                </motion.div>

                {videos.length > 0 && (
                    <div className={`craft-video-grid craft-video-grid--${Math.min(videos.length, 2)}`}>
                        {videos.slice(0, 2).map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onPlay={setActiveVideoId}
                            />
                        ))}
                    </div>
                )}

                {sectionData.description && (
                    <p className="craft-description">{sectionData.description}</p>
                )}
            </div>

            {activeVideoId && (
                <div
                    className="craft-video-modal-backdrop"
                    onClick={() => setActiveVideoId(null)}
                    role="presentation"
                >
                    <div
                        className="craft-video-modal"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="YouTube video player"
                    >
                        <button
                            type="button"
                            className="craft-video-modal-close"
                            onClick={() => setActiveVideoId(null)}
                            aria-label="Close video"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="craft-video-modal-frame">
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                                title="Craftsmanship video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DesignCraftsmanshipSection;
