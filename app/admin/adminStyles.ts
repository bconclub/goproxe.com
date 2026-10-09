// Shared styles for the /admin pages (inline, like /bdr, so nothing leaks into the site CSS).
// Look: the PROXe moodboard (Oct 2026): night navy, glass cards, lavender accent, Inter.
export const ADMIN_CSS = `
html,body{margin:0;background:#0b0c20}
.adm{--night:#0b0c20;--card:rgba(21,21,47,.82);--card-solid:#15152f;--row:#121230;--line:rgba(255,255,255,.08);--line-2:rgba(255,255,255,.14);
  --ink:#ffffff;--ink2:rgba(255,255,255,.75);--ink3:rgba(255,255,255,.55);--accent:#a997fb;--track:#2d2d49;
  --good:#42bf8c;--warnc:#f1bd22;--bad:#fb7185;--blue:#6fa8ff;
  position:relative;min-height:100vh;color:var(--ink);font:15px/1.5 var(--font-admin),Inter,system-ui,sans-serif;
  background:linear-gradient(180deg,#0b0c20 0%,#0f122f 60%,#1a1840 100%) fixed;
  max-width:1600px;margin:0 auto;padding:36px 40px 80px;box-sizing:border-box;font-variant-numeric:tabular-nums}
.adm *{box-sizing:border-box}
.adm a{color:#cec4ff}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:22px}
.kicker{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink3);font-weight:500}
h1{font-size:34px;line-height:1.1;margin:8px 0 0;font-weight:600;letter-spacing:-.03em}
h2{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink3);font-weight:500;margin:40px 0 14px;display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
h2 small{font-size:13px;letter-spacing:0;text-transform:none;color:var(--ink3);font-weight:400}
h2 a{font-size:13px;text-transform:none;letter-spacing:0;font-weight:600;text-decoration:none}
h2.sub{margin-top:22px}
.ghost{border:1px solid var(--line-2);background:transparent;color:var(--ink);border-radius:999px;padding:9px 18px;font:inherit;font-weight:600;cursor:pointer}
.ghost:hover{background:rgba(169,151,251,.12)}
.ghost:focus-visible,.adm a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.warn,.banner{display:flex;gap:12px;align-items:flex-start;background:rgba(241,189,34,.08);border:1px solid rgba(241,189,34,.35);color:#fde68a;padding:14px 18px;border-radius:18px;margin:0 0 18px;font-size:14.5px;line-height:1.5}
.banner b{color:#fff3c4}
.banner code{font-size:13px;background:rgba(0,0,0,.25);padding:1px 6px;border-radius:6px}
.stats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}
.stats div{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:18px 20px}
.stats b{display:block;font-size:34px;line-height:1.05;font-weight:700;letter-spacing:-.03em}
.stats span{font-size:13px;color:var(--ink3)}
.stats .bad b{color:var(--bad)}
.tools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.tool{display:flex;flex-direction:column;gap:4px;background:var(--card);border:1px solid var(--line);border-radius:22px;padding:18px 20px;text-decoration:none;color:var(--ink)!important}
.tool:hover{border-color:var(--accent)}
.tool:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.tool strong{font-weight:600}
.tool span{font-size:13.5px;color:var(--ink2)}
.tool.off{opacity:.55}
.split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px}
.list{list-style:none;margin:0;padding:0;background:var(--card);border:1px solid var(--line);border-radius:22px;overflow:hidden}
.list li{display:flex;flex-direction:column;padding:12px 18px;border-top:1px solid var(--line)}
.list li:first-child{border-top:0}
.list small{color:var(--ink3)}
.hint{color:var(--ink3)}
.tablewrap{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:22px}
table{width:100%;border-collapse:collapse;font-size:14.5px}
thead th{position:sticky;top:0;background:var(--card-solid);z-index:1}
th{text-align:left;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink3);font-weight:500;padding:14px 16px;white-space:nowrap}
td{padding:14px 16px;border-top:1px solid var(--line);vertical-align:top}
tbody tr:hover td{background:rgba(255,255,255,.025)}
td small,.sub-line{display:block;color:var(--ink3);font-size:13px;margin-top:2px}
td.when{white-space:nowrap;color:var(--ink2)}
td.name{min-width:180px;font-weight:600}
td.name i{font-weight:400;color:var(--ink3)}
.nowrap{white-space:nowrap}
.pill{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;line-height:1.6;padding:2px 10px;border-radius:999px;background:rgba(169,151,251,.16);color:#ddd6fe;white-space:nowrap}
.pill.bad{background:rgba(251,113,133,.18);color:#fecdd3}
.pill.ok{background:rgba(66,191,140,.18);color:#a7f3d0}
.pill.dim{background:rgba(255,255,255,.08);color:var(--ink3)}
.pill.warn{background:rgba(241,189,34,.16);color:#fde68a;border:0;padding:2px 10px;margin:0;display:inline-flex;border-radius:999px;font-size:12.5px}
.pill.blue{background:rgba(111,168,255,.18);color:#cfe1ff}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{display:inline-flex;flex-direction:column;gap:0;padding:6px 10px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid var(--line);font-size:12.5px;line-height:1.35;white-space:nowrap}
.chip b{font-weight:600}
.chip span{color:var(--ink3);font-size:11.5px}
.chip.good{border-color:rgba(66,191,140,.4);background:rgba(66,191,140,.08)}
.chip.good b{color:#a7f3d0}
.chip.junk{border-color:rgba(241,189,34,.35);background:rgba(241,189,34,.06)}
.chip.junk b{color:#fde68a}
.chip.wrong{border-color:rgba(251,113,133,.6);background:rgba(251,113,133,.12)}
.chip.wrong b{color:#fecdd3}
tr.bad td{background:rgba(251,113,133,.07)}
tr.bad td:first-child{box-shadow:inset 3px 0 0 var(--bad)}
@media(max-width:1100px){.stats{grid-template-columns:repeat(3,minmax(0,1fr))}.tools{grid-template-columns:repeat(2,minmax(0,1fr))}.split{grid-template-columns:minmax(0,1fr)}}
@media(max-width:600px){.adm{padding:24px 16px 56px}.stats,.tools{grid-template-columns:repeat(2,minmax(0,1fr))}.top{flex-direction:column;align-items:flex-start}h1{font-size:28px}}
.nav{display:flex;gap:4px;margin:0 0 24px;border-bottom:1px solid var(--line)}
.nav a{padding:10px 16px;text-decoration:none;color:var(--ink3)!important;font-weight:600;border-bottom:2px solid transparent;margin-bottom:-1px}
.nav a[aria-current=page]{color:var(--ink)!important;border-color:var(--accent)}
.nav a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.ev{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:18px 20px;display:flex;flex-direction:column;gap:12px}
.ev h3{margin:0;font-size:14px;font-weight:600;display:flex;justify-content:space-between;gap:8px;align-items:center}
.ev h3 em{font-style:normal;font-size:12px;font-weight:500;color:var(--ink3)}
.ev dl{margin:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ev dl div{display:flex;flex-direction:column}
.ev dt{font-size:12px;color:var(--ink3)}
.ev dd{margin:0;font-size:26px;line-height:1.1;font-weight:700;letter-spacing:-.02em}
.spark{margin:0;display:flex;flex-direction:column;gap:4px}
.spark svg{display:block}
.spark rect{transition:opacity .15s}
.spark rect:hover{opacity:1}
.spark figcaption{display:flex;justify-content:space-between;gap:6px;font-size:11px;color:var(--ink3)}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}
.filters a{font-size:13.5px;padding:7px 14px;border:1px solid var(--line-2);border-radius:999px;text-decoration:none;color:var(--ink2)!important}
.filters a[aria-current=true]{border-color:var(--accent);color:var(--ink)!important;background:rgba(169,151,251,.16)}
.filters .sep{width:1px;background:var(--line-2);margin:4px 6px}
.legend{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--ink3);margin:0 0 14px}
.legend span{display:inline-flex;align-items:center;gap:6px}
.legend i{width:10px;height:10px;border-radius:3px;display:inline-block}
`
