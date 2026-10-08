import React from 'react';
import { motion } from 'framer-motion';
import {
    Gem, Award, Sparkles, Search, ThumbsUp, MapPin, Home, RefreshCw, Truck, Plane,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { DEFAULT_HOMEPAGE_SECTIONS } from '../data/homepageSectionDefaults';

const ICON_MAP = {
    gem: Gem,
    award: Award,
    sparkles: Sparkles,
    search: Search,
    'thumbs-up': ThumbsUp,
    'map-pin': MapPin,
    home: Home,
    refresh: RefreshCw,
    truck: Truck,
    plane: Plane,
};

const GRID_AREA_MAP = {
    'tall-left': 'a',
    'wide-top': 'b',
    'tall-right': 'c',
    'small-mid': 'd',
    'wide-mid': 'e',
    'tall-mid': 'f',
    'small-right': 'h',
    'wide-bottom': 'i',
    'small-bottom': 'j',
    'tall-bottom': 'k',
};

const AdvantageTile = ({ tile }) => {
    const Icon = ICON_MAP[tile.icon] || Gem;
    const area = GRID_AREA_MAP[tile.layout] || tile.gridArea || 'a';

    return (
        <article className={`hg-adv-tile hg-adv-tile--${tile.bg || 'pink'} hg-adv-area-${area}`}>
            <Icon className="hg-adv-tile-watermark" strokeWidth={1} aria-hidden="true" />
            <div className="hg-adv-tile-content">
                <h3 className="hg-adv-tile-title">
                    <span className="hg-adv-tile-bold">{tile.titleBold}</span>
                    <span className="hg-adv-tile-italic">{tile.titleItalic}</span>
                </h3>
                <p className="hg-adv-tile-desc">{tile.description}</p>
            </div>
        </article>
    );
};

const HGAdvantageSection = () => {
    const { homepageSections } = useShop();
    const designDefaults = DEFAULT_HOMEPAGE_SECTIONS['design-craftsmanship'];
    const sectionData = {
        ...DEFAULT_HOMEPAGE_SECTIONS['hg-advantage'],
        ...(homepageSections?.['hg-advantage'] || {}),
    };

    const introTitle1 = sectionData.introTitleLine1 || designDefaults?.titleLine1;
    const introTitle2 = sectionData.introTitleLine2 || designDefaults?.titleLine2;
    const introText = sectionData.introDescription || designDefaults?.description;

    const tiles = sectionData.tiles || [];
    if (!tiles.length) return null;

    return (
        <section className="hg-adv-section bg-white" aria-label="The HG Advantage">
            <div className="hg-adv-inner">
                {introText && (
                    <div className="hg-adv-intro">
                        <h2 className="hg-adv-intro-title">
                            <span>{introTitle1}</span>{' '}
                            <span className="hg-adv-title-accent">{introTitle2}</span>
                        </h2>
                        <p className="hg-adv-intro-text">{introText}</p>
                    </div>
                )}

                <div className="hg-adv-header">
                    <h2 className="hg-adv-title">
                        <span>{sectionData.titleLine1 || 'THE HG'}</span>{' '}
                        <span className="hg-adv-title-accent">{sectionData.titleLine2 || 'ADVANTAGE'}</span>
                    </h2>
                </div>

                <div className="hg-adv-grid">
                    {tiles.map((tile) => (
                        <AdvantageTile key={tile.id} tile={tile} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HGAdvantageSection;
