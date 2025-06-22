/*═══════════════════════════════════════════════════════════════❏
 🔱 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 - Premium Server Control Panel
 ⚙️ 100% Stylish | Romantic | Feature-Packed
 🔐 Built for ultimate deployment freedom
═══════════════════════════════════════════════════════════════❏*/

const { System, isPrivate, shell, sleep, config: Config, setData, platform: { heroku, koyeb, render, railway }, changeVar, bot } = require("../lib/");
const { version } = require('../package.json');
const simpleGit = require("simple-git");
const pm2 = require("pm2");
const git = simpleGit();

// 💔 Shutdown System
System({
  pattern: "shutdown",
  fromMe: true,
  type: "server",
  alias: ["poweroff"],
  desc: "❌ Turns off the bot lovingly",
}, async (m) => {
  await m.reply("*🥀 𝙈𝙮 𝙝𝙚𝙖𝙧𝙩 𝙞𝙨 𝙨𝙝𝙪𝙩𝙩𝙞𝙣𝙜 𝙙𝙤𝙬𝙣... 💔*");
  await bot.stop();
});

// 💌 Set Environment Variable
System({
  pattern: "setvar",
  fromMe: true,
  type: "server",
  desc: "🌹 Sets an environment variable with love",
}, async (m, match) => {
  if (!match) return await m.reply("*💬 Format:* `.setvar KEY:VALUE`");

  const [key, ...val] = match.split(":");
  const value = val.join(":").trim();
  const k = key.toUpperCase();

  if (!k || !value) return await m.reply("*⛔ Invalid format. Try:* `.setvar WORK_TYPE:public`");

  let successMsg = `💘 *𝚺𝚱𝚲𝚴 𝚅𝚨𝚁 𝙐𝙋𝘿𝘼𝙏𝙀𝘿:* \`${k}:${value}\``;

  switch (m.client.server) {
    case "HEROKU": await heroku.setVar(k, value); break;
    case "RENDER": await render.setVar(k, value); break;
    case "KOYEB": await koyeb.setVar(k, value); break;
    case "RAILWAY": await railway.setVar(k, value, m); break;
    default:
      const local = await changeVar(k, value);
      if (!local) return m.reply("*⛔ Failed to set var locally*");
      await setData(k, value, !!value, "vars");
      await bot.restart();
  }

  return await m.reply(successMsg);
});

// ❌ Delete Environment Variable
System({
  pattern: "delvar",
  fromMe: true,
  type: "server",
  desc: "💔 Deletes any environment variable",
}, async (m, match) => {
  if (!match) return await m.reply("*💬 Format:* `.delvar KEY`");

  const key = match.trim().toUpperCase();

  switch (m.client.server) {
    case "HEROKU": await heroku.setVar(key, null); break;
    case "RENDER": await render.delVar(key); break;
    case "KOYEB": await koyeb.setVar(key, null); break;
    case "RAILWAY": await railway.setVar(key, null, m); break;
    default:
      const success = await changeVar(key, "");
      if (!success) return await m.reply("*⛔ Failed to delete var*");
      await setData(key, null, false, "vars");
      await bot.restart();
  }

  return await m.reply(`💘 *𝚻𝚵𝚱 𝙑𝘼𝙍 𝘿𝙀𝙇𝙀𝙏𝙀𝘿:* \`${key}\``);
});

// 🔍 View All Vars
System({
  pattern: "allvar",
  fromMe: true,
  type: "server",
  desc: "📜 Shows all your env variables",
}, async (m) => {
  delete Config.DATABASE;
  let output = `🌹 *𝙔𝙤𝙪𝙧 𝙑𝙖𝙧𝙞𝙖𝙗𝙡𝙚𝙨 💖*\n\n`;
  for (const k in Config) output += `*${k}:* ${Config[k]}\n`;
  await m.reply(output);
});

// 🔍 Get Specific Var
System({
  pattern: "getvar",
  fromMe: true,
  type: "server",
  desc: "🔎 Fetch a specific variable",
}, async (m, match) => {
  if (!match) return m.reply("*Format:* `.getvar SUDO`");

  const k = match.toUpperCase();
  const val = process.env[k] || Config[k];

  return val ? m.reply(`*${k}:* ${val}`) : m.reply(`🔍 *No variable found by name* \`${k}\``);
});

// 🧠 Get Current Platform
System({
  pattern: "platform",
  fromMe: true,
  type: "server",
  alias: ["server"],
  desc: "🔧 Shows deployment platform",
}, async (m) => {
  return m.reply(`*⚙️ Platform:* ${m.client.server}`);
});

// 💞 Get & Set SUDO
System({
  pattern: "setsudo",
  fromMe: true,
  type: "server",
  desc: "👑 Set SUDO users",
}, async (m, match) => {
  let sudo;
  if (m.mention?.jid?.[0]) sudo = m.mention.jid[0].split("@")[0];
  else if (m.reply_message?.sender) sudo = m.reply_message.sender.split("@")[0];
  else if (match) sudo = match.trim();
  else return m.reply("💘 _Reply to or mention a user to add as SUDO_");

  const updated = `${Config.SUDO},${sudo}`.replace(/,,/g, ",");
  await m.reply(`💖 *New SUDO list:* \`\`\`${updated}\`\`\`\n_Takes 30 seconds to apply_`);

  switch (m.client.server) {
    case "HEROKU": await heroku.setVar("SUDO", updated); break;
    case "RENDER": await render.setVar("SUDO", updated); break;
    case "KOYEB": await koyeb.setVar("SUDO", updated); break;
    case "RAILWAY": await railway.setVar("SUDO", updated, m); break;
    default:
      const done = await changeVar("SUDO", updated);
      if (!done) return m.reply("❌ Error updating local SUDO");
      await setData("SUDO", updated, true, "vars");
      await bot.restart();
  }
});

// 🚫 Delete SUDO
System({
  pattern: "delsudo ?(.*)",
  fromMe: true,
  type: "server",
  desc: "🗑 Remove SUDO access",
}, async (m, match) => {
  let toRemove = match || (m.reply_message?.sender || "").split("@")[0];
  if (!toRemove) return m.reply("*Mention/Reply a number to remove*");

  const list = Config.SUDO.split(",").filter(n => n!== toRemove);
  const newList = list.join(",");

  await m.reply(`*💘 Updated SUDO:* \`\`\`${newList}\`\`\``);

  switch (m.client.server) {
    case "HEROKU": await heroku.setVar("SUDO", newList); break;
    case "RENDER": await render.setVar("SUDO", newList); break;
    case "KOYEB": await koyeb.setVar("SUDO", newList); break;
    case "RAILWAY": await railway.setVar("SUDO", newList, m); break;
    default:
      await changeVar("SUDO", newList);
      await setData("SUDO", newList, true, "vars");
      await bot.restart();
  }
});

// 🔁 Restart Bot
System({
  pattern: "restart",
  fromMe: true,
  type: "server",
  desc: "🔄 Reboots the bot engine",
}, async (m) => {
  await m.reply("♻️ *Rebooting bot system...*");
  switch (m.client.server) {
    case "HEROKU": await heroku.restart(m); break;
    case "RENDER": await render.restart(); break;
    case "RAILWAY": await railway.restart(); break;
    default: await bot.restart();
  }
});

// 💘 Worktype Mode Switch
System({
  pattern: "mode",
  fromMe: true,
  type: "server",
  alias: ["worktype"],
  desc: "💼 Switch work mode (private/public)",
}, async (m, match) => {
  const val = match?.toLowerCase();
  if (!["private", "public"].includes(val)) return m.reply("⚠️ _Use:_ `.mode private` or `.mode public`");

  await m.reply(`🌈 *Worktype changed to:* ${val}`);

  switch (m.client.server) {
    case "HEROKU": await heroku.setVar("WORK_TYPE", val); break;
    case "RENDER": await render.setVar("WORK_TYPE", val); break;
    case "KOYEB": await koyeb.setVar("WORK_TYPE", val); break;
    case "RAILWAY": await railway.setVar("WORK_TYPE", val, m); break;
    default:
      await changeVar("WORK_TYPE", val);
      await setData("WORK_TYPE", val, true, "vars");
      await bot.restart();
  }
});

// 🌟 Update System
System({
  pattern: "update",
  fromMe: true,
  type: "server",
  desc: "🆕 Checks and applies updates",
}, async (m, match) => {
  await git.fetch();
  const commits = await git.log([`${Config.BRANCH}..origin/${Config.BRANCH}`]);

  if (match == "now") {
    if (!commits.total) return m.reply(`💫 Already up-to-date v${version}`);
    switch (m.client.server) {
      case "HEROKU": return await heroku.update(m);
      case "RENDER": await render.update(); await pm2.stop("jarvis-md"); break;
      case "KOYEB": return await koyeb.update();
      default: await bot.update(m); await bot.restart();
    }
  } else {
    if (!commits.total) return m.reply(`✨ Already latest v${version}`);
    let log = "*📥 Available Updates:*\n\n";
    commits.all.forEach((c, i) => log += `${i + 1}. ${c.message}\n`);
    return await m.reply(`${log}\n\nType *.update now* to apply.`);
  }
});
