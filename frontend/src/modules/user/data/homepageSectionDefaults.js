import { DEFAULT_SERVICES_SECTION, mergeServicesSection } from './servicesData';

export const DEFAULT_HOMEPAGE_SECTIONS = {
    'design-craftsmanship': {
        id: 'design-craftsmanship',
        label: 'Design & Craftsmanship',
        titleLine1: 'DESIGN &',
        titleLine2: 'CRAFTSMANSHIP',
        description:
            'We take careful note of prevailing jewellery trends and customer feedback to bring you the best. With our made-to-order model, each individually crafted piece goes through several quality checks before reaching your doorstep. Whether it is plain gold, diamond or gemstone jewellery that you desire, we have a design to suit every mood, budget and occasion.',
        videos: [
            {
                id: '1',
                youtubeUrl: '',
                caption: 'THE CRAFTSMEN OF HG',
                thumbnail: '',
            },
            {
                id: '2',
                youtubeUrl: '',
                caption: 'JEWELLERY CRAFTED WITH LOVE',
                thumbnail: '',
            },
        ],
    },
    'hg-advantage': {
        id: 'hg-advantage',
        label: 'The HG Advantage',
        titleLine1: 'THE HG',
        titleLine2: 'ADVANTAGE',
        introTitleLine1: 'DESIGN &',
        introTitleLine2: 'CRAFTSMANSHIP',
        introDescription:
            'We take careful note of prevailing jewellery trends and customer feedback to bring you the best. With our made-to-order model, each individually crafted piece goes through several quality checks before reaching your doorstep. Whether it is plain gold, diamond or gemstone jewellery that you desire, we have a design to suit every mood, budget and occasion.',
        tiles: [
            { id: '1', titleBold: 'A WORLD', titleItalic: 'Of Designs', description: 'We have over 8,000 unique designs for you to choose from.', bg: 'pink', layout: 'tall-left', icon: 'gem' },
            { id: '2', titleBold: 'CERTIFIED', titleItalic: 'Trustworthy', description: 'High benchmark of purity and authenticity.', bg: 'yellow', layout: 'wide-top', icon: 'award' },
            { id: '3', titleBold: 'CUSTOMIZED', titleItalic: 'By You', description: "Decide what's perfect for you!", bg: 'green', layout: 'tall-right', icon: 'sparkles' },
            { id: '4', titleBold: '100%', titleItalic: 'Transparency', description: 'What you see is what you get.', bg: 'purple', layout: 'small-mid', icon: 'search' },
            { id: '5', titleBold: 'NO COMPROMISE', titleItalic: 'on Ethics', description: 'Strong code of social, environmental and business ethics.', bg: 'mauve', layout: 'wide-mid', icon: 'thumbs-up' },
            { id: '6', titleBold: 'EXCLUSIVE', titleItalic: 'Stores', description: 'Our stores are located in major cities of India.', bg: 'pink', layout: 'tall-mid', icon: 'map-pin' },
            { id: '7', titleBold: 'Try', titleItalic: 'AT HOME', description: 'Try it before you buy it!', bg: 'purple', layout: 'small-right', icon: 'home' },
            { id: '8', titleBold: 'LIFETIME', titleItalic: 'Exchange', description: 'We believe in lifelong relations.', bg: 'green', layout: 'wide-bottom', icon: 'refresh' },
            { id: '9', titleBold: 'Next Day', titleItalic: 'DELIVERY', description: 'Last minute gifting made easy!', bg: 'yellow', layout: 'small-bottom', icon: 'truck' },
            { id: '10', titleBold: 'Shipped', titleItalic: 'TO YOU', description: 'We ship across countries!', bg: 'grey', layout: 'tall-bottom', icon: 'plane' },
        ],
    },
    services: DEFAULT_SERVICES_SECTION,
};

export const mergeHomepageSections = (fromDb = {}) => ({
    ...DEFAULT_HOMEPAGE_SECTIONS,
    ...fromDb,
    'design-craftsmanship': {
        ...DEFAULT_HOMEPAGE_SECTIONS['design-craftsmanship'],
        ...(fromDb['design-craftsmanship'] || {}),
    },
    'hg-advantage': {
        ...DEFAULT_HOMEPAGE_SECTIONS['hg-advantage'],
        ...(fromDb['hg-advantage'] || {}),
        tiles: fromDb['hg-advantage']?.tiles?.length
            ? fromDb['hg-advantage'].tiles
            : DEFAULT_HOMEPAGE_SECTIONS['hg-advantage'].tiles,
    },
    services: mergeServicesSection(fromDb.services || {}),
});

export const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
};

export const getYoutubeThumbnail = (url, customThumb) => {
    if (customThumb) return customThumb;
    const id = getYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};
