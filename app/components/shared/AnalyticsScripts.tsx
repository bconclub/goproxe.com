import Script from 'next/script'

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-GZ7HN8BM1M'
const googleTagManagerId = process.env.NEXT_PUBLIC_GTM_ID
// Defaulted like GA/Clarity above, deliberately. A pixel id is public by
// definition (it ships in the client bundle and is readable in any page's
// source), so there is nothing to protect by holding it in env — and env is
// exactly what kept this pixel dark: the loader below was written months ago
// but NEXT_PUBLIC_META_PIXEL_ID was never set in Vercel, so the guard was
// always false and the site has never reported a single ad conversion.
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1480338647459819'
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'u43ad5p156'

const AnalyticsScripts = () => {
  // Only load tags in a production build. `npm run dev` (NODE_ENV=development)
  // must NOT report to the live GA property — otherwise local testing shows up
  // as real users/events in the dashboard.
  if (process.env.NODE_ENV !== 'production') return null

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Script
            id="ga-init"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {googleTagManagerId && (
        <>
          <Script id="gtm-loader" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${googleTagManagerId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {metaPixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
              n.callMethod.apply(n,arguments) : n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/*
        The id MUST NOT be "clarity". Any element with id="x" becomes window.x
        (DOM named access), so <Script id="clarity"> made `window.clarity` the
        <script> ELEMENT. The snippet below opens with
        `c[a] = c[a] || function(){...}`, saw that truthy element, and kept it —
        so the queue stub was never installed. When the real library then called
        window.clarity(...) it threw "a[c] is not a function" and Clarity never
        started: no _clck/_clsk cookies, nothing posted to l.clarity.ms/collect.
        The tag was on the page and downloading fine the whole time, which is
        why this read as "installed but not receiving data".

        Verified on production: renaming the id makes typeof window.clarity
        "function", the cookies appear and /collect starts posting.

        The other ids here are safe because none of them shadow a global their
        snippet depends on (gtag, dataLayer, fbq are all distinct from the ids).
      */}
      {clarityProjectId && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `}
        </Script>
      )}
    </>
  )
}

export default AnalyticsScripts

