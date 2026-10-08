export const getProductDepartment = (category = '') => {
    const cat = category.toString().toLowerCase();
    if (['machine', 'machines', 'machinery', 'casting', 'laser', 'cnc'].some((k) => cat.includes(k))) {
        return 'machines';
    }
    if (['tool', 'tools', 'equipment', 'measurement', 'optics', 'cutting', 'polishing', 'forging', 'setting', 'calibration', 'loupe'].some((k) => cat.includes(k))) {
        return 'tools';
    }
    return 'jewellery';
};

export const getDepartmentLabel = (department) => {
    if (department === 'machines') return 'Machines';
    if (department === 'tools') return 'Tools';
    return 'Jewellery';
};

export const resolveDepartmentFromCategory = (categoryName = '', categoryRecord = null) => {
    const lower = categoryName.toString().toLowerCase().trim();
    if (['tools', 'tool'].includes(lower)) return 'tools';
    if (['machines', 'machine'].includes(lower)) return 'machines';
    if (['jewellery', 'jewelry'].includes(lower)) return 'jewellery';

    if (categoryRecord?.department) {
        const d = categoryRecord.department.toLowerCase();
        if (d === 'machine' || d === 'machines') return 'machines';
        if (d === 'tool' || d === 'tools') return 'tools';
        if (d === 'jewellery' || d === 'jewelry') return 'jewellery';
    }

    return getProductDepartment(lower);
};

export const buildPopularSearchLink = (department, label, extra = {}) => {
    const category =
        department === 'machines' ? 'Machines' : department === 'tools' ? 'Tools' : 'Jewellery';
    const params = new URLSearchParams({ category, search: label });
    if (extra.subcategory) params.set('subcategory', extra.subcategory);
    if (extra.type) params.set('type', extra.type);
    return `/shop?${params.toString()}`;
};

const JEWELLERY_TAGS = [
    'White Rings', '18k Rings', 'Multistone Rings', 'Women Rings', '14k Rings',
    'Gold Rings', 'Diamond Rings', 'Composite Rings', 'Engagement Rings',
    'Rs 50000 And Above Rings', 'White Gold Rings', 'Akshaya Tritiya Rings',
    'Fashion Rings', 'Wedding Rings', 'Rose Gold Earrings', 'Diamond Pendants',
    'Gold Chains', 'Mangalsutra', 'Solitaire Rings', 'Daily Wear Jewellery',
];

const JEWELLERY_EXPLORE = [
    'Weekend Women Rings', '18k Gold Rings', 'Wedding White Gold Rings',
    'Wedding Women Rings', 'Engagement Diamond Rings', 'Daily Wear Earrings',
    'Office Wear Pendants', 'Festive Bangles', 'Gift For Her Necklaces',
    'Akshaya Tritiya Gold Coins', 'Rose Gold Bracelets', 'Multistone Earrings',
];

const MACHINE_TAGS = [
    'Vacuum Casting Machine', 'Wax Injector', 'Burnout Furnace', 'Ultrasonic Cleaner',
    'Laser Welding Machine', 'Rolling Mill', '3D Wax Printer', 'CNC Machine',
    'Induction Casting Unit', 'Magnetic Polisher', 'Gold Melting Furnace',
    'Automatic Casting Machine', 'Manual Casting Machine', 'Hallmark Machine',
    'New Casting Machines', 'Used Jewellery Machines', 'Single Phase Machines',
    'Italian Casting Machines', 'Indian Jewellery Machines', 'Quality Check Machines',
];

const MACHINE_EXPLORE = [
    'CAD CAM Machines', 'Rubber Mould Machines', 'Tree Making Equipment',
    'Investment Mixers', 'Stone Setting Machines', 'Final Polishing Machines',
    'Chain Making Machines', 'Die Press Machines', 'Refinery Equipment',
    'Dispatch & Packing Machines', 'Automatic Jewellery Machines', 'Manual Workshop Machines',
];

const TOOL_TAGS = [
    'Flat Nose Pliers', 'Ring Mandrel', 'Vernier Caliper', 'Jeweller Saw Frame',
    'Gas Torch', 'Ultrasonic Cleaner', 'Buffing Machine', 'Gold Tester',
    'Diamond Loupe', 'Stone Setting Tools', 'Polishing Compounds', 'Needle Files',
    'Ball Peen Hammer', 'Soldering Tools', 'Engraving Tools', 'Safety Glasses',
    'Hand Tools Kit', 'Measuring Tools', 'PepeTools Brand', 'Foredom Tools',
];

const TOOL_EXPLORE = [
    'Hand Tools For Jewellers', 'Stone Setting Tool Kit', 'Soldering Workshop Tools',
    'Polishing & Finishing Tools', 'Casting Workshop Tools', 'Gold Testing Equipment',
    'Diamond & Gemstone Tools', 'Engraving & Design Tools', 'Electroplating Tools',
    'Cutting & Filing Tools', 'Hammer & Forming Tools', 'Workshop Safety Tools',
];

const DEPARTMENT_CONFIG = {
    jewellery: {
        tags: JEWELLERY_TAGS,
        explore: JEWELLERY_EXPLORE,
        exploreTitle: 'Explore other designs',
    },
    machines: {
        tags: MACHINE_TAGS,
        explore: MACHINE_EXPLORE,
        exploreTitle: 'Explore other machines',
    },
    tools: {
        tags: TOOL_TAGS,
        explore: TOOL_EXPLORE,
        exploreTitle: 'Explore other tools',
    },
};

/** Curated popular search lists per department */
export const getPopularSearchConfig = (department, subCategory = null) => {
    const dept = DEPARTMENT_CONFIG[department] ? department : 'jewellery';
    const base = DEPARTMENT_CONFIG[dept];
    let tags = [...base.tags];

    if (subCategory) {
        tags = [`${subCategory}`, ...tags];
    }

    const uniqueTags = [...new Set(tags.map((t) => t.trim()).filter(Boolean))];

    return {
        department: dept,
        tagsTitle: 'Tags',
        exploreTitle: base.exploreTitle,
        tags: uniqueTags.map((label) => ({
            label,
            href: buildPopularSearchLink(dept, label, subCategory ? { subcategory: subCategory } : {}),
        })),
        exploreLinks: base.explore.map((label) => ({
            label,
            href: buildPopularSearchLink(dept, label),
        })),
    };
};

export const parseTagsString = (value) => {
    if (!value) return [];
    return value
        .split(/[,|]/)
        .map((t) => t.trim())
        .filter(Boolean);
};
