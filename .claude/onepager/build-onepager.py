"""Assemble the black-and-white PROXe one-pager, inlining the real logo.

The Artifact CSP blocks external hosts, so the wordmark has to travel with the
page as a data URI. Both variants are embedded: black for paper and print,
white for viewers reading in a dark theme. CSS swaps them, so neither is a
tinted or filtered fake of the other.
"""
import pathlib

SCRATCH = pathlib.Path(
    r"C:\Users\user\AppData\Local\Temp\claude\C--Users-user-Builds-goproxe"
    r"\5d9fd048-c640-4f2f-88bc-fbcc702ee6ce\scratchpad"
)
black = (SCRATCH / "proxe-logo-black.b64").read_text().strip()
white = (SCRATCH / "proxe-logo-white.b64").read_text().strip()
icon_black = (SCRATCH / "proxe-icon-black.b64").read_text().strip()
icon_white = (SCRATCH / "proxe-icon-white.b64").read_text().strip()
plate = (SCRATCH / "plate.b64").read_text().strip()

template = (SCRATCH / "onepager-template.html").read_text(encoding="utf-8")
out = (template
       .replace("__LOGO_BLACK__", black)
       .replace("__LOGO_WHITE__", white)
       .replace("__ICON_BLACK__", icon_black)
       .replace("__ICON_WHITE__", icon_white)
       .replace("__PLATE__", plate))
(SCRATCH / "proxe-onepager.html").write_text(out, encoding="utf-8")
print("written:", len(out), "chars")
