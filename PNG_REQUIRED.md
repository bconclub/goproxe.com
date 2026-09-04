# MISSING: PNG Binary Required

**CRITICAL**: This PR is incomplete without the hero image.

## Required File
- **Path**: `public/blog/a-draft-is-not-a-reply.png`
- **Dimensions**: 1536x864 (Growth kit spec)
- **Status**: NOT YET COMMITTED

## Background
The PNG was referenced in the task instructions as "attached" at `/workspace/blog-thumbs/a-draft-is-not-a-reply.png`, but this file was not accessible in the cloud agent filesystem. 

The instructions explicitly stated:
- "You MUST commit it as `public/blog/a-draft-is-not-a-reply.png` in the same PR"
- "Do not skip. Do not restamp. Do not generate a substitute."
- "PR incomplete without this binary PNG on the branch"

## What's Complete
- ✅ Blog post page: `app/blog/a-draft-is-not-a-reply/page.tsx`
- ✅ Registry entry: Added to top of `BLOG_POSTS` in `app/lib/blog.ts`
- ✅ Copy: CEO-approved copy verbatim, ASCII-only, no em dashes
- ✅ Structure: Mirrors chrome of sibling posts
- ❌ PNG: Missing from `public/blog/`

## Action Required
Add the 1536x864 PNG binary to `public/blog/a-draft-is-not-a-reply.png` on this branch before marking ready or merging.
