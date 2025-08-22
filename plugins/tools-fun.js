const { cmd } = require('../command');
const axios = require('axios');
const fetch = require('node-fetch');
const moment = require('moment-timezone');

// ========== JOKE COMMAND ==========
cmd({
  pattern: "joke",
  desc: "😂 Get a random joke",
  react: "🤣",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;

    if (!joke?.setup || !joke?.punchline) {
      return reply("❌ Failed to fetch a joke. Please try again.");
    }

    await conn.sendMessage(m.chat, {
      text: `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "LONATI-XMD Official"
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("Joke command error:", error);
    reply("⚠️ An error occurred while fetching the joke.");
  }
});

// ========== FLIRT COMMAND ==========
cmd({
  pattern: "flirt",
  alias: ["masom", "line"],
  desc: "Get a random flirt line",
  react: "💘",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const { data } = await axios.get("https://vinuxd.vercel.app/api/pickup");
    
    await conn.sendMessage(m.chat, {
      text: `💘 *Flirty Message* 💘\n\n${data.pickup}`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "LONATI-XMD Official"
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("Flirt command error:", error);
    reply("⚠️ Failed to fetch flirt line. Try again later!");
  }
});

// ========== FACT COMMAND ==========
cmd({
  pattern: "fact",
  desc: "🧠 Get a random fact",
  react: "🧠",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const { data } = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
    
    await conn.sendMessage(m.chat, {
      text: `🧠 *Did You Know?* 🧠\n\n${data.text}`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "LONATI-XMD Official"
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("Fact command error:", error);
    reply("⚠️ Failed to fetch fact. Try again later!");
  }
});

// ========== TRUTH COMMAND ==========
cmd({
  pattern: "truth",
  desc: "❓ Get a truth question",
  react: "❓",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const { data } = await axios.get("https://api.truthordarebot.xyz/v1/truth");
    
    await conn.sendMessage(m.chat, {
      text: `❓ *Truth Question* ❓\n\n${data.question}`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "LONATI-XMD Official"
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("Truth command error:", error);
    reply("⚠️ Failed to fetch truth question!");
  }
});

// ========== DARE COMMAND ==========
cmd({
  pattern: "dare",
  desc: "🎯 Get a dare challenge",
  react: "🎯",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    const { data } = await axios.get("https://api.truthordarebot.xyz/v1/dare");
    
    await conn.sendMessage(m.chat, {
      text: `🎯 *Dare Challenge* 🎯\n\n${data.question}`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "LONATI-XMD Official"
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("Dare command error:", error);
    reply("⚠️ Failed to fetch dare challenge!");
  }
});

// ========== CHARACTER COMMAND ==========
cmd({
  pattern: "character",
  alias: ["char"],
  desc: "🔥 Check someone's character",
  react: "🔥",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { reply, isGroup }) => {
  try {
    if (!isGroup) return reply("❌ Use this in a group!");
    
    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return reply("❌ Mention someone!");

    const traits = ["Kind", "Funny", "Smart", "Shy", "Brave", "Honest", "Loyal"];
    const randomTrait = traits[Math.floor(Math.random() * traits.length)];

    await conn.sendMessage(m.chat, {
      text: `🔥 *Character Analysis* 🔥\n\n@${mentioned.split('@')[0]} is ${randomTrait}!`,
      mentions: [mentioned],
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "LONATI-XMD Official"
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("Character command error:", error);
    reply("⚠️ Error analyzing character!");
  }
});
