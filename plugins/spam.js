const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "spam",
  desc: "Spam a message multiple times",
  category: "fun",
  react: "📣",
  use: "<count> <text>",
  filename: __filename
}, async (conn, mek, m, { from, args, isGroup, isAdmin, reply }) => {
  const count = parseInt(args[0]);
  const text = args.slice(1).join(" ");

  if (!count || isNaN(count) || count > 20) {
    return reply("❌ *Enter a valid count (max 20)*\n\n_Example: .spam 5 Hello_");
  }

  if (!text) return reply("❌ *Provide a message to spam*\n\n_Example: .spam 5 Hello_");

  if (isGroup && !isAdmin) return reply("🔐 Only *group admins* can use this command.");

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363288304618280@newsletter',
      newsletterName: 'PK-XMD',
      serverMessageId: 143
    }
  };

  for (let i = 0; i < count; i++) {
    await conn.sendMessage(from, { text, contextInfo }, { quoted: mek });
    await new Promise(resolve => setTimeout(resolve, 400)); // slight delay to avoid flood
  }
});
