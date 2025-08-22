const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const { translate } = require('@vitalets/google-translate-api');
const axios = require('axios');

cmd({
  pattern: "quran",
  alias: ["surah"],
  react: "🔮",
  desc: "Get Quran Surah details and explanation.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, quoted, args, reply }) => {
  try {
    let surahInput = args[0];
    if (!surahInput) return reply('Type Surah Number or Type *.Surahmenu* to get Surah list.');

    let surahListRes = await fetchJson('https://quran-endpoint.vercel.app/quran');
    let surahList = surahListRes.data;

    let surahData = surahList.find(surah =>
      surah.number === Number(surahInput) ||
      surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() ||
      surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
    );

    if (!surahData) return reply(`Couldn't find Surah with "${surahInput}"`);

    let res = await axios.get(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);
    if (res.status !== 200) return reply(`API error ${res.status}: ${res.statusText}`);

    let json = res.data;

    let translatedTafsirUrdu = await translate(json.data.tafsir.id, { to: 'ur', autoCorrect: true });
    let translatedTafsirEnglish = await translate(json.data.tafsir.id, { to: 'en', autoCorrect: true });

    let quranSurah = `
🕋 *Quran: The Holy Book ♥️🌹قرآن مجید🌹♥️*

📖 *Surah ${json.data.number}: ${json.data.asma.ar.long} (${json.data.asma.en.long})*
💫Type: ${json.data.type.en}
✅Number of Verses: ${json.data.ayahCount}

⚡🔮 *Explanation (Urdu):*
${translatedTafsirUrdu.text}

⚡🔮 *Explanation (English):*
${translatedTafsirEnglish.text}`;

    await conn.sendMessage(
      from,
      {
        image: { url: `https://files.catbox.moe/rn7bsr.jpeg` },
        caption: quranSurah,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363288304618280@newsletter',
            newsletterName: 'THUGKEED-XMD',
            serverMessageId: 143
          }
        }
      },
      { quoted: mek }
    );

    if (json.data.recitation.full) {
      await conn.sendMessage(from, {
        audio: { url: json.data.recitation.full },
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: mek });
    }

  } catch (error) {
    console.error(error);
    reply(`Error: ${error.message}`);
  }
});
        
