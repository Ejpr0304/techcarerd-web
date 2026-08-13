const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function processLogo() {
  const inputPath = path.join(
    "C:",
    "Users",
    "User",
    ".gemini",
    "antigravity-ide",
    "brain",
    "2f2d5f39-59b8-46d4-bc34-4f78e6999aa7",
    "media__1786651857791.jpg"
  );
  const publicDir = path.join(__dirname, "..", "public");

  // Load raw image buffer
  const image = sharp(inputPath);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const threshold = 225; // Near-white cutoff

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r > threshold && g > threshold && b > threshold) {
      data[i + 3] = 0;
    }
  }

  // 1. Trim blank padding from full transparent logo
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim() // Remove empty transparent borders so logo is max size
    .png()
    .toFile(path.join(publicDir, "logo-transparent.png"));

  // 2. Trim blank padding from darkmode version with enhanced colors
  const darkData = Buffer.from(data);
  for (let i = 0; i < darkData.length; i += 4) {
    const a = darkData[i + 3];
    if (a > 0) {
      let r = darkData[i];
      let g = darkData[i + 1];
      let b = darkData[i + 2];

      // Lighten royal blue to vivid electric blue for dark backgrounds
      if (b > r + 30 && b > g + 10 && r < 100) {
        darkData[i] = Math.min(255, r + 40);
        darkData[i + 1] = Math.min(255, g + 80);
        darkData[i + 2] = Math.min(255, b + 60);
      }
    }
  }

  await sharp(darkData, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .png()
    .toFile(path.join(publicDir, "logo-darkmode.png"));

  // 3. Emblem only trimmed (Laptop + Syringe + Brush + Wrench + Gear)
  const emblemHeight = Math.floor(info.height * 0.68);
  const emblemData = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left: 0, top: 0, width: info.width, height: emblemHeight })
    .png()
    .toBuffer();

  await sharp(emblemData)
    .trim()
    .png()
    .toFile(path.join(publicDir, "logo-emblem-transparent.png"));

  console.log("Trimmed logo assets generated successfully!");
}

processLogo().catch(console.error);
