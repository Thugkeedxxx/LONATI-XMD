const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
  desc: "Convert media to direct Catbox URL",
  category: "utility",
  react: "🖇",
  filename: __filename,
}, async (Void, m, text, { reply }) => {
  try {
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";

    if (!mime) return reply("*❌ Reply to a media file (image, video or audio) to get URL.*");

    const mediaBuffer = await quoted.download();
    const tempFilePath = path.join(os.tmpdir(), `catbox_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    let ext = "";
    if (mime.includes("jpeg")) ext = ".jpg";
    else if (mime.includes("png")) ext = ".png";
    else if (mime.includes("video")) ext = ".mp4";
    else if (mime.includes("audio")) ext = ".mp3";

    const fileName = `upload${ext}`;
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(tempFilePath), fileName);

    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(tempFilePath);

    if (!res.data || typeof res.data !== "string" || !res.data.startsWith("https://")) {
      return reply("*❌ Failed to upload file. Try again later.*");
    }

    const url = res.data;
    const size = formatBytes(mediaBuffer.length);
    let type = "File";
    if (mime.includes("image")) type = "Image";
    else if (mime.includes("video")) type = "Video";
    else if (mime.includes("audio")) type = "Audio";

    // Fake verified contact for context
    const fakeContact = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
      },
      message: {
        contactMessage: {
          displayName: 'FILE UPLOADER ✅',
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:LONATI-XMD BOT\nORG:PK-XMD;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`,
          jpegThumbnail: null
        }
      }
    };

    // Send message with enhanced context info
    await Void.sendMessage(m.chat, {
      text: `✅ *${type} Uploaded Successfully!*\n\n` +
            `🔹 *Size:* ${size}\n` +
            `🔗 *URL:* ${url}`,
      contextInfo: {
        externalAdReply: {
          title: "MEDIA TO URL CONVERTER",
          body: "Powered by Catbox.moe",
          thumbnailUrl: "https://files.catbox.moe/0yulv3.jpeg",
          sourceUrl: "https://github.com/Thugkeedxxx",
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true
        },
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "LONATI-XMD Bot Updates",
          serverMessageId: Math.floor(Math.random() * 1000000).toString(),
        }
      }
    }, { quoted: fakeContact });

  } catch (e) {
    console.error(e);
    return reply("*❌ Error occurred:* " + (e.message || e));
  }
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
