# Pitch narration

Voice: Sarvam Bulbul v3, speaker `kavya`. Pace 1.15 for English, 1.0 for the
Indian languages (that matches the existing clips' speaking rate). Clips are
loudness-normalised to -17 LUFS, 48 kHz mono, then served from
`public/pitch/audio/<lang>/<card>.mp3` (English at the root).

`narration.json` holds the text for the clips re-recorded on 2026-10-04
(founder, how, price, plus the new stack and team cards). The older clips were made outside this repo.

The founder's name is said thun-ZEEL, /tænˈziːl/: a plain dental t (not the
breathy "th"), short "u", long "ee". Each language writes it in its own script
with a plain t (तन्ज़ील, தன்ஸீல், తన్జీల్ ...). Sarvam's English reads
"Thanzeel" with a short vowel, so the English founder clip has the Hindi
तन्ज़ील spliced in.

The brand name: these texts spell it "Proxy" so the voice says it right.
That spelling is for the audio only; on screen it is always PROXe.

The Sarvam key lives on the VPS (`/var/www/proxesi/.env.production`).
