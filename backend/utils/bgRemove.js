const sharp = require('sharp');
const { Blob } = require('buffer');

/**
 * Background removal via remove.bg API
 * Docs: https://www.remove.bg/api
 * Env: REMOVE_BG_API_KEY
 */
async function removeBackgroundRemoveBg(imageBuffer) {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) return null;

    const form = new FormData();
    form.append('image_file', new Blob([imageBuffer], { type: 'image/png' }), 'product.png');
    form.append('size', 'auto');
    form.append('bg_color', 'FFFFFF');
    form.append('format', 'png');

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: form,
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`remove.bg ${res.status}: ${errText.slice(0, 200)}`);
    }

    return Buffer.from(await res.arrayBuffer());
}

async function flattenOnWhite(imageBuffer) {
    return sharp(imageBuffer)
        .rotate()
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize(1400, 1400, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png({ compressionLevel: 8 })
        .toBuffer();
}

/**
 * Cut out subject (remove.bg) then place on pure white #FFFFFF square.
 * If API key is missing or the call fails, still composites onto white.
 */
async function prepareCatalogImage(imageBuffer) {
    let processed = imageBuffer;

    try {
        const cutout = await removeBackgroundRemoveBg(imageBuffer);
        if (cutout) {
            processed = cutout;
            console.log('[bgRemove] Background removed with remove.bg');
        } else {
            console.log('[bgRemove] REMOVE_BG_API_KEY not set — white-canvas fallback only');
        }
    } catch (error) {
        console.warn('[bgRemove] remove.bg failed, using white-canvas fallback:', error.message);
    }

    return flattenOnWhite(processed);
}

module.exports = { prepareCatalogImage, removeBackgroundRemoveBg };
