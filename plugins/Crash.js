"use strict";

const { cmd } = require("../command");

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

cmd(
    {
        pattern: "Nazuki-crasher",
        alias: ["scrash-test", "s-crash-test"],
        react: "🦈",
        desc: "Safe Sirimath test command.",
        category: "owner",
        use: ".sirimath-test [lines]",
        filename: __filename
    },

    async (
        conn,
        mek,
        m,
        {
            from,
            q,
            reply,
            isOwner
        }
    ) => {
        try {
            if (!isOwner) {
                return reply("❌ *Owner only command.*");
            }

            let count = parseInt(q);

            if (isNaN(count)) {
                count = 100;
            }

            count = Math.max(10, Math.min(count, 1000));

            const loading = await reply(
`╭━━━〔 🦈 𝐒𝐈𝐑𝐈𝐌𝐀𝐓𝐇 𝐓𝐄𝐒𝐓 〕━━━╮
│
│ 🧪 *Safe Test Mode*
│
│ 📊 Lines : ${count.toLocaleString()}
│
│ ⚠️ Target : None
│
╰━━━━━━━━━━━━━━━━━━━━╯`
            );

            await sleep(700);

            await conn.sendMessage(
                from,
                {
                    text:
`🔄 *Initializing...*

📊 Test size: ${count.toLocaleString()}`,
                    edit: loading.key
                }
            );

            await sleep(700);

            await conn.sendMessage(
                from,
                {
                    text:
`⚙️ *Running test...*

▰▰▰▰▱▱▱▱ 50%`,
                    edit: loading.key
                }
            );

            await sleep(700);

            await conn.sendMessage(
                from,
                {
                    text:
`⚙️ *Running test...*

▰▰▰▰▰▰▰▱ 90%`,
                    edit: loading.key
                }
            );

            await sleep(700);

            await conn.sendMessage(
                from,
                {
                    text:
`╭━━━〔 ✅ 𝐓𝐄𝐒𝐓 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄 〕━━━╮
│
│ 🧪 Mode   : Safe
│ 📊 Lines  : ${count.toLocaleString()}
│ 🎯 Target : None
│ 💥 Attack : Disabled
│
│ ɴᴀᴢᴜᴋɪ ᴍᴅ
╰━━━━━━━━━━━━━━━━━━━━╯`,
                    edit: loading.key
                }
            );

            await conn.sendMessage(from, {
                react: {
                    text: "✅",
                    key: mek.key
                }
            });

        } catch (error) {
            console.error(
                "[SIRIMATH TEST ERROR]",
                error
            );

            return reply(
                `❌ *Test Error*\n\n${error.message || error}`
            );
        }
    }
);