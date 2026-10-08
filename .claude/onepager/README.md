# PROXe one-pager (print PDF)

Black-and-white single-A4 press-ad style pitch sheet.

## Build
```
python build-onepager.py     # inlines logo/icon/plate base64 into the template
python make-pdf.py           # wraps as a standalone A4 doc, strips dark theme
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu \
  --no-pdf-header-footer --print-to-pdf="C:\Users\user\Downloads\PROXe-one-pager.pdf" \
  "file:///<this folder>/proxe-onepager-print.html"
```
Paths inside the two .py files are ABSOLUTE and point at the old session
scratchpad. Update `SCRATCH` in build-onepager.py and make-pdf.py to this
folder before running.

## Files
- onepager-template.html  the page; __LOGO_*__/__ICON_*__/__PLATE__ are placeholders
- *.b64                   base64 assets (proxe logo, icon, and the hero plate)
- build-onepager.py       placeholder substitution
- make-pdf.py             print CSS + A4 wrapper (this is where sizes live)

## Fitting rules learned the hard way
- A4 minus margins is ~711 CSS px, which trips the 780px mobile breakpoint.
  make-pdf.py forces the 2-column press layout for print.
- Headline size and image height compete for the same page. Pairs that hold
  one page: 36pt/plate 1600:520, 40pt/1600:480, 44pt/1600:440, 48pt/1600:400.
  Current: 40pt headline, plate 1600:580 (with the 8 connectors on one line).
- Verify with page count + fill %, not by eye; rendering previews is expensive.

## Hero art
Supplied by the user, greyscaled in-script. Latest source:
C:\Users\user\Desktop\PROXe One Pager.png
