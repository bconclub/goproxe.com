import { WATCH_EPISODES, type WatchEpisode } from '../lib/watch'

/**
 * Permanent links for the PROXe videos (Z, 27 Oct 2026: "this is going out in
 * PDFs"). goproxe.com/watch/<name> is the link to print: it stays the same when
 * a video is re-recorded, because the publisher keeps each video's slug and
 * file name. <name> is the slug without its "watch-" prefix.
 */
export const shortSlug = (ep: WatchEpisode) => ep.slug.replace(/^watch-/, '')

export const watchEpisodes = () => [...WATCH_EPISODES].sort((a, b) => a.order - b.order)

export function findEpisode(name: string): WatchEpisode | undefined {
  return WATCH_EPISODES.find((e) => shortSlug(e) === name || e.slug === name)
}

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
