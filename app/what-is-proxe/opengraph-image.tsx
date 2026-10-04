import { pageOg, OG_SIZE } from '../lib/pageOg';

export const runtime = 'nodejs';
export const alt = 'What is PROXe? Never miss a lead, ever again';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return pageOg({
    eyebrow: 'What is PROXe?',
    title: ['Never miss a lead.', 'Ever again.'],
    line: 'Every lead answered in seconds, on every channel, followed up until they buy.',
    chips: ['WhatsApp', 'Instagram', 'Voice', 'Web chat'],
  });
}
