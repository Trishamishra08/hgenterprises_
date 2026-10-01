/**
 * Pick the coupon to advertise on a product: highest-value active, unexpired percent coupon
 * that applies to the product's category (empty applicableCategories = applies to all).
 */
export const getProductOffer = (coupons, product) => {
    const now = Date.now();
    const cat = String(product?.category || '').toLowerCase();
    const dept = String(product?.department || '').toLowerCase();
    const eligible = (coupons || []).filter((c) => {
        if (!c?.active || c.type !== 'percent') return false;
        if (c.validUntil && new Date(c.validUntil).getTime() < now) return false;
        if (c.validFrom && new Date(c.validFrom).getTime() > now) return false;
        const cats = (c.applicableCategories || []).map((x) => String(x).toLowerCase());
        return cats.length === 0 || cats.includes(cat) || cats.includes(dept);
    });
    if (eligible.length === 0) return null;
    return eligible.reduce((best, c) => (c.value > best.value ? c : best));
};
