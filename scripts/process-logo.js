const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function removeBgAndLighten(inputPath) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  const { data } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const threshold = 225; // Near-white cutoff

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Remove white background
    if (r > threshold && g > threshold && b > threshold) {
      data[i + 3] = 0;
    } else {
      // Lighten royal blue to electric bright blue for dark backgrounds
      if (b > r + 20 && b > g + 5 && r < 120) {
        data[i] = Math.min(255, r + 45);
        data[i + 1] = Math.min(255, g + 95);
        data[i + 2] = Math.min(255, b + 65);
      }
    }
  }

  return {
    buffer: await sharp(data, { raw: { width, height, channels: 4 } })
      .trim()
      .png()
      .toBuffer(),
    width,
    height,
  };
}

async function processNewLogo() {
  const inputPath = path.join(
    "C:",
    "Users",
    "User",
    ".gemini",
    "antigravity-ide",
    "brain",
    "2f2d5f39-59b8-46d4-bc34-4f78e6999aa7",
    "media__1786652547657.png"
  );
  const publicDir = path.join(__dirname, "..", "public");

  // Copy raw original
  fs.copyFileSync(inputPath, path.join(publicDir, "logo.png"));
  fs.copyFileSync(inputPath, path.join(publicDir, "logo.jpg"));

  // 1. Process full darkmode transparent
  const { buffer: fullPng } = await removeBgAndLighten(inputPath);
  fs.writeFileSync(path.join(publicDir, "logo-darkmode.png"), fullPng);
  fs.writeFileSync(path.join(publicDir, "logo-transparent.png"), fullPng);

  // 2. Emblem only crop (top 60% of original height)
  const meta = await sharp(inputPath).metadata();
  const emblemRaw = await sharp(inputPath)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.60) })
    .toBuffer();

  const { buffer: emblemBuffer } = await removeBgAndLighten(emblemRaw);
  fs.writeFileSync(path.join(publicDir, "logo-emblem-transparent.png"), emblemBuffer);

  // 3. Text only crop (bottom 42% of original height)
  const textTop = Math.floor(meta.height * 0.60);
  const textHeight = meta.height - textTop;
  const textRaw = await sharp(inputPath)
    .extract({ left: 0, top: textTop, width: meta.width, height: textHeight })
    .toBuffer();

  const { buffer: textBuffer } = await removeBgAndLighten(textRaw);
  fs.writeFileSync(path.join(publicDir, "logo-text-transparent.png"), textBuffer);

  // 4. Horizontal logo composite
  const targetEmblemH = 220;
  const resizedEmblem = await sharp(emblemBuffer)
    .resize({ height: targetEmblemH })
    .png()
    .toBuffer();
  const resEmblemMeta = await sharp(resizedEmblem).metadata();

  const targetTextH = Math.floor(targetEmblemH * 0.65);
  const resizedText = await sharp(textBuffer)
    .resize({ height: targetTextH })
    .png()
    .toBuffer();
  const resTextMeta = await sharp(resizedText).metadata();

  const gap = 30;
  const canvasW = resEmblemMeta.width + gap + resTextMeta.width;
  const canvasH = Math.max(resEmblemMeta.height, resTextMeta.height);

  const emblemTopOffset = Math.floor((canvasH - resEmblemMeta.height) / 2);
  const textTopOffset = Math.floor((canvasH - resTextMeta.height) / 2);

  const horizontalLogo = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: resizedEmblem, left: 0, top: emblemTopOffset },
      { input: resizedText, left: resEmblemMeta.width + gap, top: textTopOffset },
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, "logo-horizontal-darkmode.png"), horizontalLogo);

  console.log("New logo processed successfully!");
}

processNewLogo().catch(console.error);
