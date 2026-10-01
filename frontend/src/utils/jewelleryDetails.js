/**
 * Normalize jewellery product details from structured jewelleryDetails
 * or legacy flat specifications[{label,value}] for storefront + PDF.
 */

const emptyJewellery = () => ({
    productDetails: {
        productCode: '',
        height: '',
        width: '',
        productWeight: '',
    },
    diamondDetails: {
        totalWeight: '',
        totalNoOfDiamonds: '',
        rows: [],
    },
    metalDetails: {
        type: '',
        weight: '',
    },
    priceBreakup: {
        gold: 0,
        diamond: 0,
        makingCharge: 0,
        gst: 0,
        total: 0,
    },
    tags: [],
});

const hasAnyValue = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    return Object.values(obj).some((v) => {
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === 'number') return v > 0;
        if (typeof v === 'object' && v !== null) return hasAnyValue(v);
        return String(v || '').trim().length > 0;
    });
};

const findSpec = (specs, ...matchers) => {
    if (!Array.isArray(specs)) return '';
    for (const spec of specs) {
        const label = String(spec.label || '').toUpperCase();
        if (matchers.every((m) => label.includes(m))) {
            return String(spec.value || '').trim();
        }
    }
    return '';
};

const parseMoney = (raw) => {
    if (raw == null || raw === '') return 0;
    if (typeof raw === 'number') return raw;
    const n = Number(String(raw).replace(/[₹,\sRs.]/gi, '').replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : 0;
};

const parseTags = (value) => {
    if (Array.isArray(value)) {
        return value.map((t) => String(t).trim()).filter(Boolean);
    }
    if (!value) return [];
    return String(value)
        .split(/[,|]/)
        .map((t) => t.trim())
        .filter(Boolean);
};

const formatInr = (n) => {
    const num = Number(n) || 0;
    return `₹ ${num.toLocaleString('en-IN')}`;
};

/**
 * Build structured jewellery details from product document.
 * Prefers jewelleryDetails; falls back to flat specifications.
 */
export function normalizeJewelleryDetails(product) {
    const base = emptyJewellery();
    const jd = product?.jewelleryDetails;

    if (jd && hasAnyValue(jd)) {
        return {
            productDetails: {
                productCode: jd.productDetails?.productCode || '',
                height: jd.productDetails?.height || '',
                width: jd.productDetails?.width || '',
                productWeight: jd.productDetails?.productWeight || '',
            },
            diamondDetails: {
                totalWeight: jd.diamondDetails?.totalWeight || '',
                totalNoOfDiamonds: jd.diamondDetails?.totalNoOfDiamonds || '',
                rows: Array.isArray(jd.diamondDetails?.rows)
                    ? jd.diamondDetails.rows
                        .map((r) => ({
                            count: r.count || '',
                            shape: r.shape || '',
                            size: r.size || '',
                            settingType: r.settingType || '',
                        }))
                        .filter((r) => r.count || r.shape || r.size || r.settingType)
                    : [],
            },
            metalDetails: {
                type: jd.metalDetails?.type || '',
                weight: jd.metalDetails?.weight || '',
            },
            priceBreakup: {
                gold: Number(jd.priceBreakup?.gold) || 0,
                diamond: Number(jd.priceBreakup?.diamond) || 0,
                makingCharge: Number(jd.priceBreakup?.makingCharge) || 0,
                gst: Number(jd.priceBreakup?.gst) || 0,
                total: Number(jd.priceBreakup?.total) || 0,
            },
            tags: parseTags(jd.tags),
        };
    }

    // Legacy flat specifications fallback
    const specs = product?.specifications || [];
    base.productDetails = {
        productCode: findSpec(specs, 'PRODUCT CODE') || findSpec(specs, 'CODE'),
        height: findSpec(specs, 'HEIGHT'),
        width: findSpec(specs, 'WIDTH'),
        productWeight:
            findSpec(specs, 'PRODUCT WEIGHT') ||
            findSpec(specs, 'WEIGHT'),
    };

    // Prefer product weight over metal weight for productDetails when both exist
    const metalWeight =
        findSpec(specs, 'GOLD WEIGHT') ||
        findSpec(specs, 'METAL WEIGHT') ||
        (findSpec(specs, 'WEIGHT') && !findSpec(specs, 'PRODUCT WEIGHT')
            ? findSpec(specs, 'WEIGHT')
            : '');

    if (findSpec(specs, 'PRODUCT WEIGHT')) {
        base.productDetails.productWeight = findSpec(specs, 'PRODUCT WEIGHT');
    }

    base.diamondDetails = {
        totalWeight:
            findSpec(specs, 'TOTAL WEIGHT') ||
            findSpec(specs, 'DIAMOND WEIGHT') ||
            findSpec(specs, 'DIAMOND', 'CT'),
        totalNoOfDiamonds:
            findSpec(specs, 'TOTAL NO') ||
            findSpec(specs, 'DIAMOND COUNT') ||
            findSpec(specs, 'TOTAL DIAMONDS') ||
            findSpec(specs, 'NO. OF DIAMONDS'),
        rows: [],
    };

    base.metalDetails = {
        type:
            findSpec(specs, 'METAL TYPE') ||
            findSpec(specs, 'TYPE') ||
            findSpec(specs, 'METAL') ||
            findSpec(specs, 'GOLD PURITY') ||
            findSpec(specs, 'PURITY'),
        weight: metalWeight || findSpec(specs, 'GOLD WEIGHT'),
    };

    const gold = parseMoney(findSpec(specs, 'GOLD') && !findSpec(specs, 'GOLD WEIGHT') ? findSpec(specs, 'GOLD') : findSpec(specs, 'GOLD PRICE') || findSpec(specs, 'GOLD'));
    // Prefer price-looking gold over purity strings
    const goldPrice = (() => {
        for (const spec of specs) {
            const label = String(spec.label || '').toUpperCase();
            if (label.includes('GOLD') && !label.includes('WEIGHT') && !label.includes('PURITY') && !label.includes('TYPE')) {
                return parseMoney(spec.value);
            }
        }
        return 0;
    })();
    const diamondPrice = (() => {
        for (const spec of specs) {
            const label = String(spec.label || '').toUpperCase();
            if (label.includes('DIAMOND') && !label.includes('WEIGHT') && !label.includes('COUNT') && !label.includes('SHAPE')) {
                return parseMoney(spec.value);
            }
        }
        return 0;
    })();
    const making = (() => {
        for (const spec of specs) {
            const label = String(spec.label || '').toUpperCase();
            if (label.includes('MAKING')) return parseMoney(spec.value);
        }
        return 0;
    })();
    const gst = (() => {
        for (const spec of specs) {
            const label = String(spec.label || '').toUpperCase();
            if (label.includes('GST')) return parseMoney(spec.value);
        }
        return 0;
    })();
    const total = (() => {
        for (const spec of specs) {
            const label = String(spec.label || '').toUpperCase();
            if (label === 'TOTAL' || label.includes('TOTAL PRICE') || label.includes('GRAND TOTAL')) {
                return parseMoney(spec.value);
            }
        }
        return 0;
    })();

    base.priceBreakup = {
        gold: goldPrice || gold,
        diamond: diamondPrice,
        makingCharge: making,
        gst,
        total: total || (goldPrice || gold) + diamondPrice + making + gst,
    };

    const tagsSpec = specs.find((s) => {
        const l = String(s.label || '').toUpperCase();
        return l.includes('TAG');
    });
    base.tags = parseTags(tagsSpec?.value);

    return base;
}

/** Whether structured/legacy jewellery details have anything to show */
export function hasJewelleryDetailsContent(details) {
    if (!details) return false;
    const { productDetails, diamondDetails, metalDetails, priceBreakup, tags } = details;
    if (hasAnyValue(productDetails)) return true;
    if (hasAnyValue(metalDetails)) return true;
    if (diamondDetails?.totalWeight || diamondDetails?.totalNoOfDiamonds) return true;
    if (diamondDetails?.rows?.length > 0) return true;
    if (tags?.length > 0) return true;
    if (
        (priceBreakup?.gold || 0) +
            (priceBreakup?.diamond || 0) +
            (priceBreakup?.makingCharge || 0) +
            (priceBreakup?.gst || 0) +
            (priceBreakup?.total || 0) >
        0
    ) {
        return true;
    }
    return false;
}

/** Spec rows for Product Details section */
export function productDetailRows(details) {
    const d = details?.productDetails || {};
    return [
        d.productCode && { label: 'Product Code', value: d.productCode },
        d.height && { label: 'Height', value: d.height },
        d.width && { label: 'Width', value: d.width },
        d.productWeight && { label: 'Product Weight', value: d.productWeight },
    ].filter(Boolean);
}

/** Spec rows for Metal Details */
export function metalDetailRows(details) {
    const d = details?.metalDetails || {};
    return [
        d.type && { label: 'Type', value: d.type },
        d.weight && { label: 'Weight', value: d.weight },
    ].filter(Boolean);
}

/** Spec rows for Diamond summary (not table) */
export function diamondSummaryRows(details) {
    const d = details?.diamondDetails || {};
    return [
        d.totalWeight && { label: 'Total Weight', value: d.totalWeight },
        d.totalNoOfDiamonds && { label: 'Total No. Of Diamonds', value: d.totalNoOfDiamonds },
    ].filter(Boolean);
}

/** Price breakup rows with ₹ formatting */
export function priceBreakupRows(details, { inventFromPrice } = {}) {
    const pb = details?.priceBreakup || {};
    const hasReal =
        (pb.gold || 0) + (pb.diamond || 0) + (pb.makingCharge || 0) + (pb.gst || 0) + (pb.total || 0) > 0;

    let gold = pb.gold || 0;
    let diamond = pb.diamond || 0;
    let making = pb.makingCharge || 0;
    let gst = pb.gst || 0;
    let total = pb.total || 0;

    if (!hasReal && inventFromPrice > 0) {
        gold = Math.round(inventFromPrice * 0.55);
        diamond = Math.round(inventFromPrice * 0.17);
        making = Math.round(inventFromPrice * 0.25);
        gst = Math.round(inventFromPrice * 0.03);
        total = inventFromPrice;
    }

    if (!(gold || diamond || making || gst || total)) return [];

    return [
        { label: 'Gold', value: formatInr(gold) },
        { label: 'Diamond', value: formatInr(diamond) },
        { label: 'Making Charge', value: formatInr(making) },
        { label: 'GST', value: formatInr(gst) },
        { label: 'Total', value: formatInr(total || gold + diamond + making + gst) },
    ];
}

export { formatInr, emptyJewellery, parseTags };
