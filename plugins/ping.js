const { cmd } = require('../command');
const { performance } = require('perf_hooks');
const moment = require('moment-timezone');

cmd({
  pattern: "ping",
  alias: ["speed", "latency"],
  desc: "Check bot response speed",
  category: "system",
  react: "🏓",
  filename: __filename
}, async (Void, mek, m) => {
  try {
    const start = performance.now();
    
    // Get server time
    const time = moment.tz('Africa/Nairobi').format('HH:mm:ss');
    const date = moment.tz('Africa/Nairobi').format('DD/MM/YYYY');
    
    // Calculate ping
    const end = performance.now();
    const speed = (end - start).toFixed(2);
    
    // Beautiful ping message
    const message = `
⚡ *LONATI-XMD PING RESULTS* ⚡

🏓 Response Speed: ${speed}ms
🌍 Server Location: Sout Africa
🕒 Server Time: ${time}
📅 Date: ${date}

🔧 Powered by Thugkeed
`.trim();

    // Newsletter context
    const contextInfo = {
      externalAdReply: {
        title: "LONATI-XMD • PING",
        body: `Response: ${speed}ms`,
        thumbnailUrl: 'https://files.catbox.moe/0yulv3.jpeg',
        sourceUrl: 'https://github.com/Thugkeedxxx/LONATI-XMD',
        mediaType: 1,
        renderLargerThumbnail: true
      },
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363288304618280@newsletter",
        newsletterName: "LONA-XMD Official",
        serverMessageId: 456
      }
    };

    await Void.sendMessage(
      m.chat,
      {
        text: message,
        contextInfo: contextInfo
      },
      {
        quoted: mek
      }
    );

  } catch (error) {
    console.error('Ping command error:', error);
    await Void.sendMessage(
      m.chat,
      {
        text: '⚠️ Error checking ping!'
      },
      {
        quoted: mek
      }
    );
  }
});
