// Shared styles for the /admin pages (inline, like /bdr, so nothing leaks into the site CSS).
export const ADMIN_CSS = `
html,body{margin:0;background:#0d0b12}
.adm{--ink:#f3efff;--ink2:#b9b0cf;--ink3:#8a82a3;--line:rgba(196,181,253,.16);--tile:#15121d;--accent:#a78bfa;
  min-height:100vh;color:var(--ink);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:1200px;margin:0 auto;padding:32px 24px 64px;box-sizing:border-box}
.adm *{box-sizing:border-box}
.adm a{color:#c4b5fd}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:24px}
.kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);font-weight:700}
h1{font-size:28px;line-height:1.15;margin:6px 0 0}
h2{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2);margin:32px 0 12px;display:flex;justify-content:space-between;align-items:center;gap:8px}
h2 a{font-size:13px;text-transform:none;letter-spacing:0;font-weight:600;text-decoration:none}
h2.sub{margin-top:20px}
.ghost{border:1px solid var(--line);background:transparent;color:var(--ink);border-radius:10px;padding:9px 16px;font:inherit;font-weight:600;cursor:pointer}
.ghost:hover{background:rgba(167,139,250,.12)}
.warn{background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);color:#fde68a;padding:10px 14px;border-radius:10px}
.stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
.stats div{background:var(--tile);border:1px solid var(--line);border-radius:14px;padding:16px}
.stats b{display:block;font-size:26px;line-height:1.1}
.stats span{font-size:12.5px;color:var(--ink3)}
.tools{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.tool{display:flex;flex-direction:column;gap:4px;background:var(--tile);border:1px solid var(--line);border-radius:14px;padding:16px;text-decoration:none;color:var(--ink)!important}
.tool:hover{border-color:var(--accent)}
.tool:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.tool span{font-size:13.5px;color:var(--ink2)}
.tool.off{opacity:.55}
.split{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.list{list-style:none;margin:0;padding:0;background:var(--tile);border:1px solid var(--line);border-radius:14px}
.list li{display:flex;flex-direction:column;padding:11px 16px;border-top:1px solid var(--line)}
.list li:first-child{border-top:0}
.list small{color:var(--ink3)}
.hint{color:var(--ink3)}
.tablewrap{overflow-x:auto;background:var(--tile);border:1px solid var(--line);border-radius:14px}
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;font-size:12px;color:var(--ink3);font-weight:600;padding:12px 14px;white-space:nowrap}
td{padding:10px 14px;border-top:1px solid var(--line);white-space:nowrap}
td small{color:var(--ink3)}
.pill{font-size:12px;padding:2px 9px;border-radius:999px;background:rgba(167,139,250,.16);color:#ddd6fe}
@media(max-width:960px){.stats{grid-template-columns:repeat(3,1fr)}.tools{grid-template-columns:repeat(2,1fr)}.split{grid-template-columns:1fr}}
@media(max-width:560px){.adm{padding:24px 16px 48px}.stats,.tools{grid-template-columns:1fr 1fr}.top{flex-direction:column;align-items:flex-start}}
.nav{display:flex;gap:6px;margin:0 0 20px;border-bottom:1px solid var(--line)}
.nav a{padding:10px 14px;text-decoration:none;color:var(--ink2);font-weight:600;border-bottom:2px solid transparent;margin-bottom:-1px}
.nav a[aria-current=page]{color:var(--ink);border-color:var(--accent)}
.nav a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
tr.bad td{background:rgba(251,113,133,.10)}
.pill.bad{background:rgba(251,113,133,.2);color:#ffd4dc}
.pill.ok{background:rgba(74,222,128,.16);color:#bbf7d0}
.pill.dim{background:rgba(255,255,255,.08);color:var(--ink3)}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.ev{background:var(--tile);border:1px solid var(--line);border-radius:14px;padding:14px 16px}
.ev h3{margin:0 0 8px;font-size:14px}
.ev dl{margin:0;display:grid;grid-template-columns:1fr auto;gap:2px 10px;font-size:13px;color:var(--ink2)}
.ev dd{margin:0;color:var(--ink);font-weight:700;text-align:right;font-variant-numeric:tabular-nums}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
.filters a{font-size:13px;padding:6px 12px;border:1px solid var(--line);border-radius:999px;text-decoration:none;color:var(--ink2)!important}
.filters a[aria-current=true]{border-color:var(--accent);color:var(--ink)!important;background:rgba(167,139,250,.14)}
`
