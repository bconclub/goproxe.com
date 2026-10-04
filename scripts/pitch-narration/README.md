# Pitch narration

Voice: Sarvam Bulbul v3, speaker `kavya`. Pace 1.15 for English, 1.0 for the
Indian languages (that matches the existing clips' speaking rate). Clips are
loudness-normalised to -17 LUFS, 48 kHz mono, then served from
`public/pitch/audio/<lang>/<card>.mp3` (English at the root).

`narration.json` holds the text for the clips re-recorded on 2026-10-04
(founder, how, price). The older clips were made outside this repo.

The founder's name: written in each language's own script (थंज़ील, தன்ஸீல்,
తన్జీల్ ...). In English, Sarvam reads "Thanzeel" with a short vowel
("Tanzil"), so the English founder clip has the Hindi-rendered name spliced in.

The Sarvam key lives on the VPS (`/var/www/proxesi/.env.production`).
