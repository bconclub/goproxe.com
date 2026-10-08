"""Wrap the one-pager fragment as a standalone A4 document for PDF export.

The artifact version is a fragment (the host supplies doctype/head/body). A PDF
needs the whole document, plus @page sizing and margins, and the dark-theme
blocks removed so a printer never receives a black page.
"""
import pathlib
import re

SCRATCH = pathlib.Path(
    r"C:\Users\user\AppData\Local\Temp\claude\C--Users-user-Builds-goproxe"
    r"\5d9fd048-c640-4f2f-88bc-fbcc702ee6ce\scratchpad"
)
frag = (SCRATCH / "proxe-onepager.html").read_text(encoding="utf-8")

# Strip the two dark-theme override blocks: a PDF has exactly one appearance,
# and it is ink on paper.
frag = re.sub(
    r"\s*@media \(prefers-color-scheme: dark\) \{.*?\n  \}\n", "\n", frag, flags=re.S
)
frag = re.sub(r"\s*:root\[data-theme=\"dark\"\] \{.*?\n  \}\n", "\n", frag, flags=re.S)

title_match = re.search(r"<title>(.*?)</title>", frag)
title = title_match.group(1) if title_match else "PROXe"
frag = re.sub(r"<title>.*?</title>\s*", "", frag, count=1)

PAGE_CSS = """
  @page { size: A4; margin: 9mm 11mm; }
  html, body { background: #ffffff; }
  .sheet { padding: 0 !important; max-width: none !important; }
  /* A4 minus margins is about 711 CSS px, which trips the 780px single-column
     breakpoint. Hold the three-column press setting for paper. */
  .cols { columns: 2 !important; column-gap: 28px !important; }
  /* Shorter plate: the picture sets the scene, the copy has to fit under it. */
  .plate { aspect-ratio: 1600 / 580 !important; }
  .terms { grid-template-columns: auto minmax(0, 1fr) !important; column-gap: 24px !important; }
  .eyebrow { font-size: 9.2px !important; margin-top: 10px !important; }
  h1 { font-size: 40px !important; margin-top: 10px !important; }
  .deck { font-size: 13px !important; margin-top: 6px !important; }
  .plate-note { font-size: 8.8px !important; margin-top: 5px !important; }
  .cols { margin-top: 9px !important; padding-top: 8px !important; }
  p { font-size: 11.6px !important; margin-bottom: 6px !important; }
  .run-in { font-size: 11.2px !important; }
  h2 { font-size: 10px !important; margin-bottom: 6px !important; }
  h2:not(:first-of-type) { margin-top: 11px !important; }
  .rail { gap: 5px 6px !important; }
  .stand { font-size: 12px !important; margin-top: 9px !important; }
  .rail-label { font-size: 9px !important; margin: 9px 0 5px !important; padding-top: 8px !important; }
  .ch { font-size: 10.6px !important; padding: 5px 11px 5px 8px !important; }
  .ch svg { width: 12px !important; height: 12px !important; }
  .terms { margin-top: 13px !important; padding: 11px 15px !important; }
  .fee { font-size: 27px !important; }
  .fee .was { font-size: 13px !important; }
  .fee .per { font-size: 9.4px !important; }
  .terms p { font-size: 10.6px !important; }
  .ask { margin-top: 16px !important; padding-top: 13px !important; }
  .ask p { font-size: 11.6px !important; }
  .contact { font-size: 11.4px !important; }
  .signoff { width: 26px !important; height: 26px !important; }
  .slug { font-size: 10.5px !important; margin-top: 13px !important; letter-spacing: 0.1em !important; }
"""

doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
</head>
<body>
{frag}
<style>{PAGE_CSS}</style>
</body>
</html>
"""

out = SCRATCH / "proxe-onepager-print.html"
out.write_text(doc, encoding="utf-8")
print("standalone written:", out, len(doc), "chars")
