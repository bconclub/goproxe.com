# Verification: No-Lead Dial Race Fix

## Quick Reference
- **PR**: https://github.com/bconclub/goproxe.com/pull/108
- **Branch**: `cursor/fix-no-lead-dial-race-5fbe`
- **Commit**: `fb96258cac3e0035bf8823a78e374a9cf1d43f33`

## Root Cause Identified

PR #107 moved `recordCallbackDial` to execute immediately after ElevenLabs returns 200, closing the 504 timeout race. However, the function had an early return:

```typescript
// OLD CODE (line 517)
if (!existing) return  // "No row means nothing to annotate"
```

**Impact**: Outreach Batch LOW targets that don't yet exist in `all_leads` (only in Arc `outreach_targets`) had no timestamp written on the first dial, so `lastCallbackAt` returned null and the cooldown check passed on retry.

## The Fix

Upsert a minimal stub lead when no row exists:

```typescript
// NEW CODE
if (!existing) {
  const { data: created } = await supabase
    .from('all_leads')
    .insert({
      phone: input.phone ?? null,
      customer_phone_normalized: normalized,
      first_touchpoint: 'voice',
      last_touchpoint: 'voice',
      last_interaction_at: new Date().toISOString(),
      brand: BRAND,
      unified_context: { voice: { source: 'outreach_dial_record' } },
    })
    .select('id, unified_context')
    .single()
  existing = created
}
```

## How It Blocks All Three Race Conditions

### 1. No `all_leads` row exists yet
- **Before**: `recordCallbackDial` early return → no timestamp → `lastCallbackAt` returns null → second dial proceeds
- **After**: Stub lead created → timestamp written to `voice.last_call_at` → `lastCallbackAt` returns timestamp → second dial blocked ✅

### 2. Client aborted / timed out
- **Before**: PR #107 already moved record before HTTP response, but record was no-op for missing leads
- **After**: Stub created before response, timestamp persists even if client never receives response ✅

### 3. `conversation_id` is still null at record time
- **Before**: `recordCallbackDial` only cared about phone, but early-return prevented writing anything
- **After**: Stub created with just phone + normalized phone, `conversation_id` can be null or filled later ✅

## Verification Test Plan

### Scenario A: First dial to new outreach target

**Setup**: Pick a phone number NOT in `all_leads` (e.g., fresh Batch LOW target: +919999999999)

**Steps**:
```bash
# 1. Verify phone NOT in database
curl -X POST https://api.supabase.io/rest/v1/all_leads \
  -H "apikey: $SUPABASE_KEY" \
  -G --data-urlencode "customer_phone_normalized=eq.9999999999" \
  -G --data-urlencode "brand=eq.proxe"
# Expected: []

# 2. Place first dial
curl -X POST https://goproxe.com/api/outreach-dial \
  -H "Authorization: Bearer $DIAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "agent": "noname"}'
# Expected: { ok: true, dialed: "+919999999999", conversation_id: "conv_xxx" }

# 3. Verify stub lead created with timestamp
curl -X POST https://api.supabase.io/rest/v1/all_leads \
  -H "apikey: $SUPABASE_KEY" \
  -G --data-urlencode "customer_phone_normalized=eq.9999999999" \
  -G --data-urlencode "select=unified_context->>voice->>last_call_at"
# Expected: [{ "last_call_at": "2026-09-08T10:40:57.123Z" }]
```

### Scenario B: Second dial within 24h cooldown

**Steps**:
```bash
# 4. Attempt second dial immediately (within 24h)
curl -X POST https://goproxe.com/api/outreach-dial \
  -H "Authorization: Bearer $DIAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "agent": "noname"}'
# Expected: { ok: false, reason: "recently_called", last_called_at: "2026-09-08T10:40:57.123Z" }
```

### Key Assertion
✅ **First dial with no pre-existing `all_leads` row still blocks second dial within cooldown**

## Post-Call Enrichment

The stub lead is minimal by design. The ElevenLabs post-call webhook (`/api/webhooks/elevenlabs`) will enrich it with:
- Transcript turns
- Call summary
- Duration
- Caller name (if extracted from conversation)
- Business type, city, interest (if discussed)

Pattern already exists in `recordCallTranscript` with `createIfMissing` (lines 630-650).

## Safety Checklist

- [x] No live dials placed during development
- [x] `DIAL_ALLOWLIST` unchanged
- [x] Agent IDs unchanged
- [x] Quiet hours logic unchanged
- [x] Auth behavior unchanged
- [x] Existing leads' behavior unchanged (stub creation only happens when `!existing`)
- [x] Draft PR (not merged, awaiting CEO gate)

## Related Files

- `app/lib/leadsSupabase.ts`: Main fix location
- `app/api/outreach-dial/route.ts`: Caller of `recordCallbackDial`
- `app/api/webhooks/elevenlabs/route.ts`: Post-call enrichment handler
