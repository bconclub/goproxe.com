/**
 * The business name as the agent should SAY it; the stored prospect name is
 * unchanged. Only the core name: no branch, area or city ("V Dental and
 * Implant Center, Indiranagar" -> "V Dental and Implant Center"), no
 * slash-joined abbreviations ("Excel Acadamics NEET/JEE" -> "Excel
 * Acadamics"). Z, 26 Oct 2026: if we are not sure how a word is said, leave
 * it out.
 */
export function spokenBusinessName(value: unknown, city?: unknown): string {
  let name = String(value || '').replace(/\s+/g, ' ').trim();
  // Imported listings encode their branch/locality in trailing parentheses.
  name = name.replace(/(?:\s*\([^()]*\))+\s*$/, '').trim();
  // Anything after a comma, a pipe or a spaced dash is a locality or a tagline.
  name = name.split(/\s*(?:,|\||\s[-–]\s)\s*/)[0].trim();
  // Slash-joined words (NEET/JEE, Skin/Hair) read badly: drop them.
  name = name.split(' ').filter((w) => !w.includes('/')).join(' ').trim();
  const place = String(city || '').trim();
  if (place) {
    const escaped = place.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    name = name.replace(new RegExp('\\s+' + escaped + '$', 'i'), '').trim();
  }
  return name || 'your business';
}
