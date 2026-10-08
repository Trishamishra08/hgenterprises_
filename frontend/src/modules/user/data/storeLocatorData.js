/** HG store cities — aligned with Store Locator page */
export const STORE_CITIES = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Chennai',
    'Kolkata',
];

/** Pincode prefix (first 3 digits) → city */
const PINCODE_PREFIX_TO_CITY = {
    '400': 'Mumbai',
    '401': 'Mumbai',
    '410': 'Mumbai',
    '411': 'Pune',
    '412': 'Pune',
    '413': 'Pune',
    '110': 'Delhi',
    '121': 'Delhi',
    '122': 'Delhi',
    '201': 'Delhi',
    '560': 'Bangalore',
    '561': 'Bangalore',
    '562': 'Bangalore',
    '500': 'Hyderabad',
    '501': 'Hyderabad',
    '502': 'Hyderabad',
    '380': 'Ahmedabad',
    '382': 'Ahmedabad',
    '600': 'Chennai',
    '601': 'Chennai',
    '602': 'Chennai',
    '700': 'Kolkata',
    '711': 'Kolkata',
    '712': 'Kolkata',
};

const CITY_ALIASES = {
    mumbai: 'Mumbai',
    bombay: 'Mumbai',
    delhi: 'Delhi',
    'new delhi': 'Delhi',
    bangalore: 'Bangalore',
    bengaluru: 'Bangalore',
    hyderabad: 'Hyderabad',
    pune: 'Pune',
    ahmedabad: 'Ahmedabad',
    chennai: 'Chennai',
    madras: 'Chennai',
    kolkata: 'Kolkata',
    calcutta: 'Kolkata',
};

function hashString(str) {
    let hash = 0;
    const s = String(str);
    for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

/** Resolve city from a 6-digit pincode or city name */
export function getCityFromPincode(input) {
    const raw = String(input || '').trim();
    if (!raw) return null;

    if (/^\d{6}$/.test(raw)) {
        const prefix = raw.slice(0, 3);
        return PINCODE_PREFIX_TO_CITY[prefix] || null;
    }

    const alias = CITY_ALIASES[raw.toLowerCase()];
    return alias || null;
}

export function isValidPincodeInput(input) {
    const raw = String(input || '').trim();
    return Boolean(getCityFromPincode(raw));
}

/** Cities where this product is stocked (stable per product id) */
export function getProductStoreCities(product) {
    if (Array.isArray(product?.storeCities) && product.storeCities.length > 0) {
        return product.storeCities;
    }

    const id = String(product?.id || product?._id || product?.name || '');
    const hash = hashString(id);
    const cities = STORE_CITIES.filter((_, i) => (hash + i * 17) % 3 !== 0);

    return cities.length > 0 ? cities : [STORE_CITIES[hash % STORE_CITIES.length]];
}

export function isProductAvailableInPincode(product, pincode) {
    const city = getCityFromPincode(pincode);
    if (!city) return false;

    if (Array.isArray(product?.storePincodes) && product.storePincodes.length > 0) {
        const prefix = String(pincode).trim().slice(0, 3);
        return product.storePincodes.some(
            (p) => String(p) === String(pincode).trim() || String(p).startsWith(prefix)
        );
    }

    return getProductStoreCities(product).includes(city);
}

export function getStoreAreaLabel(pincode) {
    const city = getCityFromPincode(pincode);
    if (!city) return null;
    return `${city} (${pincode})`;
}
