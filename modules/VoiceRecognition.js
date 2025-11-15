// src/modules/VoiceRecognition.js
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import prism from "prism-media";

import config from "../config.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientOpenAI = new OpenAI({ apiKey: config.OPENAI_API_KEY });

// Helper to write PCM buffer to file and convert to WAV using prism
function createWavFromOpus(opusStream, outPath) {
  return new Promise((resolve, reject) => {
    const decoder = new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });
    const out = createWriteStream(outPath);
    pipeline(opusStream, decoder, out, (err) => err ? reject(err) : resolve());
  });
}

export async function transcribeUserStream(opusStream) {
  // create temp file
  const tempDir = path.join(__dirname, "..", "tmp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  const filename = `rec-${Date.now()}.wav`;
  const filePath = path.join(tempDir, filename);

  // Convert opus -> wav file
  await createWavFromOpus(opusStream, filePath);

  // send to OpenAI whisper (speech-to-text)
  const fileStream = fs.createReadStream(filePath);
  try {
    const resp = await clientOpenAI.audio.transcriptions.create({
      file: fileStream,
      model: "gpt-4o-transcribe" // or "whisper-1" depending on OpenAI naming; update to valid model in your account
    });
    const text = resp.text ?? (resp.data && resp.data[0] && resp.data[0].text) ?? null;
    return text;
  } catch (e) {
    console.error("Whisper error:", e);
    return null;
  } finally {
    try { fs.unlinkSync(filePath); } catch {}
  }
}
