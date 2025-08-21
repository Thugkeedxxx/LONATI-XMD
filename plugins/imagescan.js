const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

cmd({
  pattern: "imgscan",
  alias: ["scanimg", "imagescan", "analyzeimg"],
  react: '🔍',
  desc: "Scan and analyze images using AI",
  category: "utility",
  use: ".imgscan [reply to image]",
  filename: __filename
}, async (client, message, { reply, quoted }) => {
  try {
    const quotedMsg = quoted || message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType || !mimeType.startsWith('image/')) {
      return reply("❌ Please reply to an image file (JPEG/PNG)");
    }

    const mediaBuffer = await quotedMsg.download();
    const fileSize = formatBytes(mediaBuffer.length);
    
    let extension = '';
    if (mimeType.includes('jpeg')) extension = '.jpg';
    else if (mimeType.includes('png')) extension = '.png';
    else return reply("❌ Unsupported image format. Please use JPEG or PNG");

    const tempPath = path.join(os.tmpdir(), `imgscan_${Date.now()}${extension}`);
    fs.writeFileSync(tempPath, mediaBuffer);

    // Upload image to Catbox
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', fs.createReadStream(tempPath));

    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    const imageUrl = upload.data;
    fs.unlinkSync(tempPath);

    if (!imageUrl || !imageUrl.startsWith("https://")) {
      return reply("❌ Failed to upload image.");
    }

    // Use OCR.space API to extract text
    const apiKey = "helloworld"; // Free demo key
    const ocrRes = await axios.post(`https://api.ocr.space/parse/imageurl`, null, {
      params: {
        apikey: apiKey,
        url: imageUrl,
        language: "eng",
        isOverlayRequired: false
      }
    });

    const result = ocrRes.data;
    if (!result || !result.ParsedResults || result.ParsedResults.length === 0) {
      return reply("❌ No text found in the image.");
    }

    const extractedText = result.ParsedResults[0].ParsedText.trim();
    if (!extractedText) return reply("❌ Couldn't extract any text from image.");

    await reply(
      `🔍 *Image Scan Results*\n\n` +
      `📦 File Size: ${fileSize}\n` +
      `🌐 URL: ${imageUrl}\n\n` +
      `📝 *Extracted Text:*\n` +
      "```" + extractedText + "```\n\n" +
      `> 🔗 Powered by OCR.Space | Catbox | PK-XMD`
    );

  } catch (error) {
    console.error('Image Scan Error:', error);
    await reply(`❌ Error: ${error.message || error}`);
  }
});
    
