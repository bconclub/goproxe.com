/**
 * The three PROXe fonts, instantiated once.
 *
 * next/font requires module-scope instantiation, which is why page.tsx and
 * thank-you/page.tsx each carry their own copy of this block. New pages
 * (industries, demo) import from here instead; migrating the older pages is
 * optional cleanup, not required.
 */
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-sans',
});

export const heading = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-heading',
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-mono',
});

/** Class string for the .proxe-root wrapper every PROXe page uses. */
export const proxeFontClass = `${inter.variable} ${heading.variable} ${mono.variable}`;
