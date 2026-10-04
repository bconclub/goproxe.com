import { pageOg, OG_SIZE } from '../lib/pageOg';

export const runtime = 'nodejs';
export const alt = 'The PROXe pitch: your AI for the customer side of your business';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
  return pageOg({
    eyebrow: 'The pitch',
    title: ['Your AI for the customer', 'side of your business.'],
    line: 'The problem, the product, the traction and the round. Narrated, in 10 languages.',
    chips: ['Pre-seed', 'Narrated', '10 languages'],
  });
}
