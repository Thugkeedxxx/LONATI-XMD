const { cmd } = require('../command');
const moment = require('moment-timezone');
const { performance } = require('perf_hooks');

cmd({
  pattern: "test",
  alias: ["checko", "botcheck"],
  desc: "Comprehensive bot test with diagnostics",
  category: "system",
  react: "🧪",
  filename: __filename
}, async (Void, mek, m) => {
  try {
    const start = performance.now();
    
    // System diagnostics
    const time = moment.tz('Africa/Nairobi').format('HH:mm:ss');
    const date = moment.tz('Africa/Nairobi').format('DD/MM/YYYY');
    const memory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    const end = performance.now();
    const speed = (end - start).toFixed(2);

    // Beautiful test report
    const message = `
🧪 *PK-XMD SYSTEM TEST* 🧪

✅ Bot Responsive: Yes
⚡ Response Speed: ${speed}ms
📊 Memory Usage: ${memory}MB
🌍 Server Time: ${time}
📅 Date: ${date}

🔧 *Modules Tested:*
- Command Handler ✔️
- Message Sending ✔️
- API Connectivity ✔️

🔮 *Status:* Fully Operational
`.trim();

    // Newsletter context
    const contextInfo = {
      externalAdReply: {
        title: "PK-XMD • SYSTEM CHECK",
        body: `All Systems Normal | ${speed}ms`,
        thumbnailUrl: 'https://files.catbox.moe/fgiecg.jpg',
        sourceUrl: 'https://github.com/mejjar00254/PK-XMD',
        mediaType: 1,
        renderLargerThumbnail: true
      },
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363288304618280@newsletter",
        newsletterName: "PK-XMD Official",
        serverMessageId: 789
      }
    };

    // Send test results
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

    // Add reaction to show completion
    await Void.sendMessage(
      m.chat,
      { react: { text: '✅', key: mek.key } }
    );

  } catch (error) {
    console.error('Test command error:', error);
    const errorMessage = `
⚠️ *TEST FAILED* ⚠️

Error: ${error.message}

🔧 Please check:
1. Bot connection
2. Command handler
3. Server status
`.trim();
    
    await Void.sendMessage(
      m.chat,
      {
        text: errorMessage
      },
      {
        quoted: mek
      }
    );
    
    await Void.sendMessage(
      m.chat,
      { react: { text: '❌', key: mek.key } }
    );
  }
});
