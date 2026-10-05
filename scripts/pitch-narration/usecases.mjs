// Narration for the per-brand "Edge solutions" cards (built-<brand>), in the
// deck's narrator (Ziina, eleven_v4) and all 10 languages. English is written
// here; Claude translates it in the style of each language's existing script
// in narration.json. Writes the lines into narration.json, the clips into
// public/pitch/audio[/<lang>]/<card>.mp3 (-17 LUFS, 48 kHz mono, 96k), and
// their lengths into public/pitch/audio/durations.json.
//
//   node --env-file=<file with ANTHROPIC_API_KEY and ELEVENLABS_API_KEY> scripts/pitch-narration/usecases.mjs [lang ...]
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const VOICE = "FaqthkZu1EWxXxUFbAfb"; // Ziina
const MODEL = "eleven_v4";
const NARRATION = "scripts/pitch-narration/narration.json";
const DURATIONS = "public/pitch/audio/durations.json";

// Spelt for the voice: "Proxy" for PROXe, "H S H" said as letters.
const EN = {
  "built-hsh": "Edge solutions, built on Proxy. First, H S H Hospital, one of the top speciality hospitals in Hubli. One agent on chat and calls, in Kannada... and the whole patient journey, on Proxy.",
  "built-lokazen": "Lokazen. AI-based commercial real estate matching, in Bangalore. Brands are matched to properties automatically, and onboarding, from one thousand to ten thousand rupees, is paid right on chat, in minutes.",
  "built-windchasers": "Windchasers. India's premier pilot training academy. High-volume admission leads, from parents and students, scored and routed. Opportunities... up eight hundred percent.",
  "built-bcon": "BCON Club. A brand growth agency. Instagram comments and DMs, answered, followed up, and managed as leads, by Proxy.",
  "built-khadivasthra": "And Khadivasthra. Handlooms, and Indian handicrafts. Complete e-commerce: cart recovery, and catalogs across Google and Instagram.",
};

const NAMES = { "hi-IN": "Hindi", "ta-IN": "Tamil", "te-IN": "Telugu", "kn-IN": "Kannada", "ml-IN": "Malayalam", "mr-IN": "Marathi", "bn-IN": "Bengali", "gu-IN": "Gujarati", "pa-IN": "Punjabi", "od-IN": "Odia" };
const EL_LANG = { "en-IN": "en", "hi-IN": "hi", "ta-IN": "ta", "te-IN": "te", "kn-IN": "kn", "ml-IN": "ml", "mr-IN": "mr", "bn-IN": "bn", "gu-IN": "gu", "pa-IN": "pa", "od-IN": "or" };

async function translate(lang, styleSample) {
  const prompt = `Translate these narration lines for a startup pitch into ${NAMES[lang]}, spoken by a confident, clear narrator. Natural and spoken, not literal or bookish.
Match the style, vocabulary and the way brand and English words are written in this existing ${NAMES[lang]} narration from the same deck:
"""${styleSample}"""
Rules: keep "Proxy" as the product name the way the sample writes it; brand names (Lokazen, Windchasers, BCON Club, Khadivasthra, H S H Hospital) and everyday English business words (chat, calls, leads, DMs, Instagram, Google, e-commerce, cart) as the sample would write them; numbers as spoken words; keep the pauses (... and commas).
Return only a JSON object with exactly the same keys.

${JSON.stringify(EN, null, 2)}`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 8000, messages: [{ role: "user", content: prompt }] }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`claude ${res.status} ${JSON.stringify(j).slice(0, 200)}`);
  const text = j.content.map((c) => c.text ?? "").join("");
  return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
}

async function tts(text, lang) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL, language_code: EL_LANG[lang], voice_settings: { stability: 0.5, similarity_boost: 0.8 } }),
  });
  if (!res.ok) throw new Error(`tts ${lang} ${res.status} ${(await res.text()).slice(0, 200)}`);
  return Buffer.from(await res.arrayBuffer());
}

const narration = JSON.parse(await readFile(NARRATION, "utf8"));
const durations = JSON.parse(await readFile(DURATIONS, "utf8"));
const langs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(narration);
for (const lang of langs) {
  const lines = lang === "en-IN" ? EN : await translate(lang, narration[lang]?.built ?? "");
  const dir = lang === "en-IN" ? "public/pitch/audio" : `public/pitch/audio/${lang}`;
  const dkey = lang === "en-IN" ? "en" : lang;
  await mkdir(dir, { recursive: true });
  for (const [key, line] of Object.entries(lines)) {
    if (!EN[key]) continue;
    const raw = `${dir}/${key}.raw.mp3`;
    await writeFile(raw, await tts(line, lang));
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-af", "loudnorm=I=-17:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "1", "-b:a", "96k", `${dir}/${key}.mp3`]);
    await rm(raw);
    const secs = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `${dir}/${key}.mp3`]).toString());
    (narration[lang] ??= {})[key] = line;
    (durations[dkey] ??= {})[key] = Math.round(secs * 100) / 100;
  }
  await writeFile(NARRATION, JSON.stringify(narration, null, 1) + "\n");
  await writeFile(DURATIONS, JSON.stringify(durations, null, 1) + "\n");
  console.log(`${lang}: done`);
}
