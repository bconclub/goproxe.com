# Pitch narration

Voice: ElevenLabs `eleven_v4`, narrator "Ziina", confident and clear (voice `FaqthkZu1EWxXxUFbAfb`),
every card in all 10 languages. Recorded and played at her own pace. Clips are
loudness-normalised to -17 LUFS, 48 kHz mono, then served from
`public/pitch/audio/<lang>/<card>.mp3` (English at the root). The ElevenLabs key
lives on the VPS (`/var/www/goproxe/.env.local`).

`narration.json` is the whole deck, every card in every language, re-recorded
on 2026-10-05 in the one voice, written to be recited: short lines, a pause
between beats, each card with its own opening. Edit a line there, re-record that card, then
rewrite `public/pitch/audio/durations.json` (the deck reads clip lengths from
it to time each card and stretch its animations to the voice).

The founder's name is said thun-ZEEL, /tænˈziːl/: a plain dental t (not the
breathy "th"), short "u", long "ee". Each language writes it in its own script
with a plain t (तन्ज़ील, தன்ஸீல், తన్జీల్ ...). The English script spells it
"Tanzeel", which Sarvam says correctly.

The brand name: these texts spell it "Proxy" so the voice says it right.
That spelling is for the audio only; on screen it is always PROXe.

The Sarvam key lives on the VPS (`/var/www/proxesi/.env.production`).
