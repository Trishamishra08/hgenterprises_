const VC_CART_KEY = 'hg_vc_cart';

export function readGuestVcCart() {
    try {
        const raw = localStorage.getItem(VC_CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function writeGuestVcCart(items) {
    localStorage.setItem(VC_CART_KEY, JSON.stringify(items.slice(0, 5)));
}

export function clearGuestVcCart() {
    localStorage.removeItem(VC_CART_KEY);
}

export function addGuestVcItem(item) {
    const cart = readGuestVcCart();
    const id = String(item.product);
    if (cart.some((x) => String(x.product) === id)) return cart;
    if (cart.length >= 5) {
        const err = new Error('You can add up to 5 designs for a video call');
        err.code = 'CART_FULL';
        throw err;
    }
    const next = [...cart, item];
    writeGuestVcCart(next);
    return next;
}

export function removeGuestVcItem(productId) {
    const next = readGuestVcCart().filter((x) => String(x.product) !== String(productId));
    writeGuestVcCart(next);
    return next;
}

export function groupVcItemsByDepartment(items = []) {
    const jewellery = [];
    const toolsMachines = [];
    items.forEach((item) => {
        const d = (item.department || 'jewellery').toLowerCase();
        if (d === 'tools' || d === 'machines' || d === 'machine' || d === 'tool') {
            toolsMachines.push(item);
        } else {
            jewellery.push(item);
        }
    });
    return { jewellery, toolsMachines };
}
