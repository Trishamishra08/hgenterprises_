import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { getPopularSearchConfig } from '../data/popularSearchData';

const PopularSearchTags = ({
    department = 'jewellery',
    subCategory = null,
    className = '',
    variant = 'default',
    onLinkClick,
}) => {
    const [tagsOpen, setTagsOpen] = useState(true);
    const config = getPopularSearchConfig(department, subCategory);
    const isMega = variant === 'mega';

    if (!config.tags.length) return null;

    const tags = isMega ? config.tags.slice(0, 14) : config.tags;
    const exploreLinks = isMega ? config.exploreLinks.slice(0, 10) : config.exploreLinks;

    const handleLinkClick = () => {
        onLinkClick?.();
    };

    if (isMega) {
        return (
            <div className={`mega-explore-guide ${className}`.trim()} aria-label="Popular searches">
                <div className="mega-explore-tags-row">
                    <span className="mega-explore-heading">Tags</span>
                    <p className="mega-explore-tags-text">
                        {tags.map((tag, idx) => (
                            <span key={tag.label}>
                                <Link to={tag.href} className="mega-explore-link" onClick={handleLinkClick}>
                                    {tag.label}
                                </Link>
                                {idx < tags.length - 1 && ', '}
                            </span>
                        ))}
                    </p>
                </div>
                <div className="mega-explore-explore-row">
                    <span className="mega-explore-heading">{config.exploreTitle}</span>{' '}
                    {exploreLinks.map((item, idx) => (
                        <span key={item.label}>
                            <Link to={item.href} className="mega-explore-link" onClick={handleLinkClick}>
                                {item.label}
                            </Link>
                            {idx < exploreLinks.length - 1 && ' '}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className={`popular-search-section ${className}`.trim()} aria-label="Popular searches">
            <div className="popular-search-tags-box">
                <button
                    type="button"
                    className="popular-search-tags-header"
                    onClick={() => setTagsOpen((o) => !o)}
                    aria-expanded={tagsOpen}
                >
                    <span>{config.tagsTitle}</span>
                    {tagsOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
                {tagsOpen && (
                    <p className="popular-search-tags-body">
                        {config.tags.map((tag, idx) => (
                            <span key={tag.label}>
                                <Link to={tag.href} className="popular-search-link" onClick={handleLinkClick}>
                                    {tag.label}
                                </Link>
                                {idx < config.tags.length - 1 && ', '}
                            </span>
                        ))}
                    </p>
                )}
            </div>

            <div className="popular-search-explore">
                <span className="popular-search-explore-label">{config.exploreTitle}</span>{' '}
                {config.exploreLinks.map((item, idx) => (
                    <span key={item.label}>
                        <Link to={item.href} className="popular-search-link" onClick={handleLinkClick}>
                            {item.label}
                        </Link>
                        {idx < config.exploreLinks.length - 1 && ' '}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default PopularSearchTags;
