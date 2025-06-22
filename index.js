/**
 * 🌟 THE-LEGENDARY-N1L-BOT | By 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑
 * ✅ WhatsApp Bot starter file
 */

const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// 🧠 Bot instance
const client = new Client({
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu"
        ]
    }
});

// 🔐 QR Code generator
client.on("qr", qr => {
    console.clear();
    console.log("🔐 Scan this QR to log in:\n");
    qrcode.generate(qr, { small: true });
});

// ✅ Ready status
client.on("ready", () => {
    console.log("🔥 𝚴𝚯𝚻 BOT IS NOW LIVE AND CONNECTED");
});

// 🤖 Command handler
client.on("message", async msg => {
    const text = msg.body.toLowerCase();

    if (text === ".alive") {
        msg.reply("✅ *THE-LEGENDARY-N1L-BOT* is online!\n_Powered by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑_");
    }

    if (text === ".ping") {
        msg.reply("🏓 Pong!");
    }

    // Add more commands here...
});

// 🚀 Start bot
client.initialize();
