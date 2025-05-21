const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

const OWNER_NUMBERS = ['1234567890@c.us']; // Replace this with your real WhatsApp ID

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ THE LEGENDARY N1L is ready!');
});

client.on('message', async msg => {
    const body = msg.body.toLowerCase();
    const isOwner = OWNER_NUMBERS.includes(msg.from);

    if (body === '!ping') {
        msg.reply('🏓 Pong! THE LEGENDARY N1L is online.');
    }

    if (body === '!menu') {
        const media = MessageMedia.fromFilePath('./menu.jpg');
        client.sendMessage(msg.from, media, {
            caption: '*👑 THE LEGENDARY N1L BOT MENU*

Commands:
!ping
!menu
!ytmp3
!sticker

NSFW (Owner only):
!porn

𝗙𝗞 𝗜𝟱𝗥𝟰𝗟 𝗕𝗬 𝗡𝟭𝗟'
        });
    }

    if (body === '!ytmp3') {
        msg.reply('🎵 YouTube MP3 download feature coming soon...');
    }

    if (body === '!sticker' && msg.hasMedia) {
        const media = await msg.downloadMedia();
        msg.reply(media, undefined, { sendMediaAsSticker: true });
    }

    if (body === '!porn' && isOwner) {
        msg.reply('🔞 NSFW content accessed. (OWNER ONLY)');
    }
});

client.initialize();