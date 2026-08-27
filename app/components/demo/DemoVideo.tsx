'use client';

/**
 * The recorded dashboard walkthrough for one industry.
 *
 * Vimeo, same host as the landing hero, but a deliberately simpler embed: this
 * is a user-initiated watch, so native controls stay on and there is no
 * autoplay/mute choreography to manage. When the industry has no recording yet
 * (videoId null - Z records them one by one), a styled placeholder holds the
 * slot so the page ships before the recordings exist.
 */

export default function DemoVideo({ videoId, accent, title }: { videoId?: string | null; accent: string; title: string }) {
  if (!videoId) {
    return (
      <div
        className="demo-gate-video demo-gate-video--placeholder"
        style={{ ['--acc' as string]: accent }}
        aria-label="Walkthrough video coming soon"
      >
        <span className="demo-gate-video-badge">Walkthrough coming</span>
        <p>A recorded tour of the {title} dashboard lands here. The live demo below is ready now.</p>
      </div>
    );
  }
  return (
    <div className="demo-gate-video" style={{ ['--acc' as string]: accent }}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?byline=0&title=0&portrait=0&dnt=1&playsinline=1`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={`${title} dashboard walkthrough`}
      />
    </div>
  );
}
