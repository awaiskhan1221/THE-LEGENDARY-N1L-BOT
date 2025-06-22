// 💘 Legendary Menu Panel — Designed by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑

const plugins = require("../lib/system");
const { System, isPrivate, isUrl, config } = require("../lib");
const { BOT_INFO, MEDIA_DATA, MENU_FONT } = require("../config");
const { uptime } = require("os");
const { version } = require('../package.json');
const fancy = require('./client/fancy');

const clockString = (ms) => {
  const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
  const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

async function readMore() {
  return String.fromCharCode(8206).repeat(4001);
}

System({
  pattern: 'menu ?(.*)',
  fromMe: isPrivate,
  desc: 'Flirty command menu',
  type: 'romantic',
  dontAddCommandList: true,
}, async (message, match) => {
  const [date, time] = new Date().toLocaleString("en-IN", { timeZone: config.TIMEZONE }).split(",");
  const ownerName = BOT_INFO.split(';')[1];
  const botName = BOT_INFO.split(';')[0];
  const image = BOT_INFO.split(';')[2];

  let menu = `╭─╮ ♡╭──⌛ *𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 𝐌𝐄𝐍𝐔* ⌛──╮♡╭─╮
│
│ 👑 *Owner:* ${ownerName}
│ 🤖 *Bot:* ${botName}
│ 💋 *User:* ${message.pushName.replace(/[\r\n]+/gm, "")}
│ 📆 *Date:* ${date}
│ ⏰ *Time:* ${time}
│ 🔋 *Uptime:* ${clockString(uptime() * 1000)}
│ 🛠️ *Version:* v${version}
│
│ 💖 *Hey cutie... I'm ready to obey your commands.*
│ 💌 *Whisper my name followed by your desire...*
│
╰───⧪ *𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐙𝐎𝐍𝐄* ⧪───╯`;

  const cmnd = [];
  const category = [];

  for (const command of plugins.commands) {
    const cmd = command.pattern?.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)?.[2];
    if (!command.dontAddCommandList && cmd) {
      const type = (command.type || "misc").toUpperCase();
      cmnd.push({ cmd, type });
      if (!category.includes(type)) category.push(type);
    }
  }

  const [typFont, ptrnFont] = MENU_FONT.split(';').map(f => isNaN(f) || parseInt(f) > 35 ? null : f);
  cmnd.sort();

  for (const cmmd of category.sort()) {
    let typ = typFont ? await fancy.apply(fancy[parseInt(typFont) - 1], cmmd) : cmmd;
    menu += `\n\n💎 *${typ}*\n`;

    for (const { cmd, type } of cmnd.filter(({ type }) => type === cmmd)) {
      let ptrn = ptrnFont ? await fancy.apply(fancy[parseInt(ptrnFont) - 1], cmd.trim()) : cmd;
      menu += `➥ ${ptrn}\n`;
    }
  }

  menu += `\n🍷 *Designed & Delivered by* ✨ 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑`;

  let options = image.includes('&gif')
    ? { gifPlayback: true, caption: menu }
    : { caption: menu };

  const url = image.replace(/&gif/g, '');

  if (isUrl(url)) return await message.sendFromUrl(url, options);
  return await message.send(menu);
});
