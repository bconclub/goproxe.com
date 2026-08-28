/**
 * Track which conversation_ids have already received the on-call WhatsApp.
 * The post-call webhook checks this before sending the generic continuation.
 * Process-local, deliberately: a duplicate after restart is acceptable, and
 * this keeps the implementation simple (no database round-trip on every call).
 */
export const oncallWhatsAppSent = new Map<string, number>()
