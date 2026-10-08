const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Applies a premium watermark (logo + elegant brand text) to an image buffer.
 * @param {Buffer} imageBuffer - The original uploaded image buffer.
 * @returns {Promise<Buffer>} - The watermarked image buffer.
 */
async function applyWatermark(imageBuffer) {
    try {
        // Path to official gold transparent brand logo
        const logoPath = path.join(__dirname, '../assets/watermark_logo.png');
        
        // Initialize sharp instance for the main image and fetch metadata
        const mainImage = sharp(imageBuffer);
        const metadata = await mainImage.metadata();
        
        const width = metadata.width || 800;
        const height = metadata.height || 800;
        
        const composites = [];

        // 1. Generate elegant centered brand text watermark in gold
        const fontSize = Math.round(width * 0.055); // Dynamic font size based on width
        const svgText = `
            <svg width="${width}" height="${height}">
                <style>
                    .watermark-text {
                        fill: #D4AF37; /* Premium Metallic Gold */
                        fill-opacity: 0.45; /* Clearly visible */
                        font-size: ${fontSize}px;
                        font-family: 'Cinzel', 'Playfair Display', 'Georgia', serif;
                        font-weight: 900;
                        letter-spacing: 0.2em;
                    }
                    .watermark-shadow {
                        fill: #000000;
                        fill-opacity: 0.18;
                        font-size: ${fontSize}px;
                        font-family: 'Cinzel', 'Playfair Display', 'Georgia', serif;
                        font-weight: 900;
                        letter-spacing: 0.2em;
                    }
                </style>
                <!-- Centered brand watermark with subtle shadow for visibility -->
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                    transform="rotate(-25 ${width * 0.5} ${height * 0.5})"
                    class="watermark-shadow" dx="2" dy="2">
                    HG ENTERPRISES
                </text>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                    transform="rotate(-25 ${width * 0.5} ${height * 0.5})"
                    class="watermark-text">
                    HG ENTERPRISES
                </text>
            </svg>
        `;
        composites.push({
            input: Buffer.from(svgText),
            top: 0,
            left: 0
        });

        // 2. Add logo watermark at the center if the logo file exists
        if (fs.existsSync(logoPath)) {
            // Logo width = 30% of main image width for clear visibility
            const logoWidth = Math.round(width * 0.30);

            // Get logo metadata to calculate centered position
            const logoResized = sharp(logoPath).resize(logoWidth);
            const logoMeta = await logoResized.clone().metadata();
            const logoHeight = logoMeta.height || logoWidth;

            // Apply opacity by multiplying alpha channel: 128/255 ≈ 50% opacity
            const logoBuffer = await logoResized
                .ensureAlpha()
                .linear(1, 0)              // keep RGB unchanged
                .toBuffer({ resolveWithObject: false });

            // Use Sharp's built-in gravity: center for exact centering
            const logoWithOpacity = await sharp(logoBuffer)
                .ensureAlpha()
                .composite([{
                    input: Buffer.alloc(logoWidth * logoHeight * 4, 128), // 50% alpha mask
                    raw: { width: logoWidth, height: logoHeight, channels: 4 },
                    blend: 'dest-in'
                }])
                .toBuffer();

            composites.push({
                input: logoWithOpacity,
                gravity: 'center'   // Perfectly centered on the image
            });
        }

        // Apply all composites to the original image
        return await mainImage
            .composite(composites)
            .toBuffer();

    } catch (error) {
        console.error("Error applying watermark:", error);
        // Fallback to original image if anything goes wrong to avoid breaking the upload pipeline
        return imageBuffer;
    }
}

module.exports = { applyWatermark };
