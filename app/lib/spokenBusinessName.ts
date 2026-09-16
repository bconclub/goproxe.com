/** Strip listing branch suffixes for speech; the stored prospect name is unchanged. */
export function spokenBusinessName(value: unknown, city?: unknown): string {
  let name = String(value || '').replace(/\s+/g, ' ').trim();
  // Imported listings encode their branch/locality in trailing parentheses.
  name = name.replace(/(?:\s*\([^()]*\))+\s*$/, '').trim();
  const place = String(city || '').trim();
  if (place) {
    const escaped = place.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    name = name.replace(new RegExp('\\s*(?:,|\\|| - )\\s*' + escaped + '$', 'i'), '').trim();
  }
  return name || 'your business';
}
