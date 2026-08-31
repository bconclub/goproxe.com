# Blog Post Thumbnail Images

This directory contains unique thumbnail images for each blog post. Each image serves as:
- Hub card thumbnail on /blog
- Hero image on individual post pages
- OpenGraph/social share image
- Related/recent post thumbnail

## Current Status

⚠️ **PLACEHOLDER FILES**: The 13 PNG files in this directory are minimal placeholders (1200x630, dark purple #140d30) created to ensure paths return 200 instead of 404.

✅ **READY FOR REPLACEMENT**: The actual branded thumbnail designs need to be swapped in place of these placeholders.

## Required Files (1200x630 PNG)

All 13 blog posts have their corresponding placeholder PNG files:

1. ✅ `people-miss-conversations.png` - "People miss conversations. Then they lose the lead."
2. ✅ `what-is-proxe.png` - "An AI that runs the customer side"
3. ✅ `crm-wont-answer.png` - "Your CRM will not answer that WhatsApp"
4. ✅ `not-a-whatsapp-bot.png` - "PROXe is not a WhatsApp chatbot"
5. ✅ `after-hours-whatsapp.png` - "After-hours WhatsApp is how you lose the lead"
6. ✅ `how-fast-to-reply-whatsapp.png` - "First useful reply gets the slot"
7. ✅ `one-memory-every-channel.png` - "One lead, four channels, one memory"
8. ✅ `clinics-whatsapp-during-consult.png` - "The clinic that answered got the patient"
9. ✅ `coaching-parents-at-night.png` - "The institute that answered got the admission"
10. ✅ `paid-lead-no-reply.png` - "You paid for the lead. Then you answered tomorrow"
11. ✅ `wellness-after-hours.png` - "They wanted 7pm. You replied at 10am"
12. ✅ `home-services-on-a-job.png` - "The crew that answered got the work"
13. ✅ `professional-services-with-a-client.png` - "The firm that answered got the brief"

## Infrastructure Complete

✅ Code changes:
- `app/lib/blog.ts` - All 13 thumbnail paths point to `/blog/{slug}.png`
- All 13 blog post `page.tsx` files - OpenGraph images use `https://goproxe.com/blog/{slug}.png`
- All PNG files committed and reachable

## Next Steps

**To complete the visual design:**

1. Export the 13 branded thumbnail designs as PNG (1200x630)
2. Replace the placeholder files in `public/blog/` with the actual designs
3. Commit and push the updated files

## Fallback Behavior

The blog components include fallback logic if images fail to load:
- `BlogHero.tsx` falls back to `/home/Conversations.webp` or `/home/Leads.webp`
- `BlogHub.tsx` renders an SVG placeholder on error
- `BlogRelatedRecent.tsx` falls back to `/home/Conversations.webp` or `/home/Leads.webp`

With the placeholder PNGs committed, paths return 200 and fallbacks won't trigger. Once branded designs are swapped in, each post will display its unique thumbnail throughout the site.

