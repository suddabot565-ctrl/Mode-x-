const { cmd } = require('../command');
const axios = require('axios');
const gis = require('g-i-s');

const { createJimp } = require('@jimp/core');
const { defaultFormats, defaultPlugins } = require('jimp');
const webp = require('@jimp/wasm-webp');

const Jimp = createJimp({
    formats: [...defaultFormats, webp],
    plugins: defaultPlugins
});

function searchImages(query) {
    return new Promise((resolve, reject) => {
        gis({
            searchTerm: `${query} cute sticker transparent png`,
            queryStringAddition: '&tbs=ic:trans'
        }, (error, results) => {
            if (error) return reject(error);
            resolve(results || []);
        });
    });
}

async function imageToSticker(url) {
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    const image = await Jimp.fromBuffer(Buffer.from(response.data));

    // WhatsApp sticker size
    image.contain({
        w: 512,
        h: 512
    });

    return await image.getBuffer('image/webp');
}

cmd({
    pattern: 'zty',
    alias: ['stickerpack', 'stickers'],
    react: '🎨',
    desc: 'Search and send stickers',
    category: 'sticker',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.trim()) {
            return await reply(
                `╭━━━〔 🎨 *ZTY STICKER* 〕━━━╮\n` +
                `┃\n` +
                `┃ ❌ Keyword එකක් දෙන්න.\n` +
                `┃\n` +
                `┃ *Examples:*\n` +
                `┃ .zty Cat\n` +
                `┃ .zty Bbuz\n` +
                `┃ .zty Anime\n` +
                `┃ .zty Love\n` +
                `┃ .zty Cute Dog\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        const query = q.trim();

        await reply(
            `🔎 *Searching stickers...*\n\n` +
            `🎨 Search: *${query}*\n` +
            `⏳ Please wait...`
        );

        const results = await searchImages(query);

        if (!results.length) {
            return await reply(
                `❌ *No stickers found!*\n\n` +
                `Try another keyword.\n` +
                `Example: *.zty cat*`
            );
        }

        let sent = 0;

        // Send up to 10 stickers
        for (const item of results.slice(0, 10)) {
            if (!item.url) continue;

            try {
                const sticker = await imageToSticker(item.url);

                await conn.sendMessage(
                    from,
                    {
                        sticker: sticker
                    },
                    {
                        quoted: mek
                    }
                );

                sent++;

                // Small delay to avoid flooding
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (err) {
                console.log('ZTY sticker error:', err.message);
            }
        }

        if (sent === 0) {
            return await reply(
                `❌ *Sticker convert කරන්න බැරි වුණා.*\n\n` +
                `වෙන keyword එකක් try කරන්න.`
            );
        }

    } catch (error) {
        console.log('ZTY ERROR:', error);

        await reply(
            `❌ *ZTY Error!*\n\n` +
            `${error.message || 'Unknown error'}`
        );
    }
});