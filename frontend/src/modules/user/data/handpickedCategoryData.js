/** Jewellery category thumbnails — white packshots so jewellery reads clearly in Handpicked. */
import jewRing from '../assets/jew_ring_white.png';
import jewEarrings from '../assets/jew_earrings_white.png';
import jewPendant from '../assets/jew_pendant_white.png';
import jewNecklace from '../assets/jew_necklace_white.png';
import jewBracelet from '../assets/jew_bracelet_white.png';
import jewAnklet from '../assets/jew_anklet_white.png';

export const HANDPICKED_CATEGORY_DEFS = [
    { key: 'rings', name: 'Rings', image: jewRing },
    { key: 'earrings', name: 'Earrings', image: jewEarrings },
    { key: 'pendants', name: 'Pendants', image: jewPendant },
    { key: 'chains', name: 'Chains', image: jewNecklace },
    { key: 'necklaces', name: 'Necklaces', image: jewNecklace },
    { key: 'bangles', name: 'Bangles', image: jewBracelet },
    { key: 'bracelets', name: 'Bracelets', image: jewBracelet },
    { key: 'mangalsutra', name: 'Mangalsutra', image: jewNecklace },
    { key: 'nose-pins', name: 'Nose Pins', image: jewPendant },
    { key: 'solitaires', name: 'Solitaires', image: jewRing },
    { key: 'kids-jewellery', name: "Kids' Jewellery", image: jewRing },
    { key: 'kada', name: 'Kada', image: jewBracelet },
    { key: 'mens-jewellery', name: "Men's Jewellery", image: jewRing },
    { key: 'watch-accessories', name: 'Watch Accessories', image: jewBracelet },
    { key: 'anklets', name: 'Anklets', image: jewAnklet },
];

const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export function buildHandpickedCategories(dbCategories = []) {
    const jewelleryDb = dbCategories.filter(
        (c) =>
            c.department?.toLowerCase() === 'jewellery' &&
            c.status === 'Active'
    );

    return HANDPICKED_CATEGORY_DEFS.map((def) => {
        const dbMatch = jewelleryDb.find(
            (c) =>
                normalize(c.name) === normalize(def.name) ||
                normalize(c.id || c._id) === normalize(def.key) ||
                normalize(c.name).includes(normalize(def.key))
        );

        return {
            id: dbMatch?.id || dbMatch?._id || def.key,
            name: def.name,
            image: def.image,
            fallbackImage: def.image,
            slug: def.key,
        };
    });
}
