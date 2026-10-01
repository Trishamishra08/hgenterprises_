import React from 'react';
import { getYouTubeId } from '../../../utils/youtube';

const YouTubeEmbed = ({ url, title = 'Video', className = '' }) => {
    const id = getYouTubeId(url);
    if (!id) return null;
    return (
        <div className={`relative w-full aspect-video overflow-hidden rounded-lg bg-black ${className}`}>
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
            />
        </div>
    );
};

export default YouTubeEmbed;
