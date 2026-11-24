# preparation_app

Offline-first exam prep pages. Deployed on Vercel as static files from `public/` (no build step on Vercel).

## HTET PGT Computer Science mock (`htet/`)
- Page: `public/index.html` (self-contained, ~0.4 MB, questions are plain text, no paper images or PDFs). Progress is saved in the browser (localStorage), per address:
  use Backup tab -> Export / Import to move it between the local file and the Vercel URL.
- Rebuild after editing `htet/src/*`, `htet/tags.py` or keys: `cd htet && uv run --with pillow python build.py`, then commit `public/index.html`.
- Checks: `node htet/test.js`; UI test: `htet/ui_test.py <scratch dir>`.
- Question text: `htet/text.json` (auto-extracted English) overridden by `htet/fixed/<year>.json` (checked/typed, incl. Hindi); 2024 Q51-60 poem in `htet/passages.json`. `htet/crops/` (page images, used only to check text) is not committed.
- Re-cropping questions (`seg.py`, `crop.py`) needs the source PDFs in `~/Downloads/HTET/Question_Papers/`.
- Deploy: import the repo in Vercel, framework "Other", no build command, output directory `public` (already in `vercel.json`).

## Subjects in the page
A Subject dropdown (top of the sidebar, top of every screen on phones) switches between PGT Computer Science, TGT Science and PRT. Each keeps its own saved results (CS keeps the original `htetmock` key; the others use `htetmock-sci` and `htetmock-prt`). The page reloads when you switch.
- TGT Science and PRT: 2021, 2022, 2023, 2024 (held July 2025), official BSEH final keys, Set A. July 2026 keys are behind a login, so those papers are not included.
- Data: `htet/exams/text` (auto-extracted PDF text), `htet/exams/fixed` (checked text, overrides), `htet/exams/tags` (topic per question, codes in `TOPICS.txt`), `htet/exams/keys_raw` (answer keys). `htet/exams/run.py` cuts papers from the PDFs in `~/Downloads/HTET`; `htet/build.py` builds all three subjects into `public/index.html`.
- Left out: PRT 2024 Q51-57 and Q60 (they need a comprehension passage that is not included).
