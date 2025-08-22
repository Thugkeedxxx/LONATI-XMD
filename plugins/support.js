const { cmd } = require('../command');
const moment = require('moment-timezone');

cmd({
  pattern: "support",
  alias: ["supportgroup", "help", "channel"],
  desc: "Get LONATI-XMD support, channel & developer contact",
  category: "system",
  filename: __filename,
}, async (Void, m, text) => {

  const jtime = moment.tz('Africa/Nairobi').format("HH:mm:ss");
  const jdate = moment.tz('Africa/Nairobi').format("DD/MM/YY");

  // 🧾 Fake Verified Contact
  const fakeContact = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      contactMessage: {
        displayName: "THUGKEED | LONATI-XMD",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: THUGKEED | LONATI-XMD\nORG:THUGKEED;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`,
        jpegThumbnail: Buffer.alloc(0)
      }
    }
  };

  const contextInfo = {
    externalAdReply: {
      title: "📞 LONATI-XMD • Support & Channel",
      body: `🕒 ${jtime} | 📅 ${jdate}`,
      thumbnailUrl: 'https://files.catbox.moe/rn7bsr.jpeg',
      sourceUrl: 'https://whatsapp.com/channel/0029VbB7a9v6LwHqDUERef0M',
      mediaType: 1,
      renderLargerThumbnail: true,
      showAdAttribution: true
    },
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363288304618280@newsletter",
      newsletterName: "LONATI-XMD Official"
    }
  };

  const supportText = `*🛠️ LONATI-XMD Support Center*\n\n╭─❍ *Support Links*\n│👥 Group: https://chat.whatsapp.com/E9OETl0ufFi1RYMdUtkLmG?\n│📡 Channel:https://whatsapp.com/channel/0029VbB7a9v6LwHqDUERef0M\n│📞 Dev: wa.me/27630425996 (THUGKEED)\n╰───────────────╮\n\n📌 Feel free to ask for help, request features or report bugs.\n\n⏰ *Time:* ${jtime}\n📅 *Date:* ${jdate}\n\n*Powered by Thugkeed*`;

  await Void.sendMessage(m.chat, {
    text: supportText,
    contextInfo
  }, { quoted: fakeContact });
});
