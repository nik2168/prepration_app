# preparation_app

Offline-first exam prep pages. Deployed on Vercel as static files from `public/` (no build step on Vercel).

## HTET PGT Computer Science mock (`htet/`)
- Page: `public/index.html` (self-contained, ~0.4 MB, questions are plain text, no paper images or PDFs). Progress is saved in the browser (localStorage), per address:
  use Settings -> Export / Import to move it between the local file and the Vercel URL.
- Tabs: Mocks, Revise, Progress, Settings. Theme matches the Family Money app (Pastel, Auto/Light/Dark). No page zoom (viewport, 16px inputs, iOS `gesturestart`).
- Revise: `htet/syllabus.json` is the official Level-III syllabus (BSEH HTET bulletin, Annexure-I), subject -> unit -> topic; every tag in `tags.py` belongs to exactly one topic (build asserts it).
  Notes: `htet/revise/<topic id>.html`, an HTML fragment (`h2`, `ul`, `table`, `pre`, `<p class="key">` for the must-know box, `<p class="src">` for sources). Rebuild after adding one.
  Hindi (14 pages, one per HIN tag) is checked against Kamta Prasad Guru, *हिंदी व्याकरण* (Hindi Wikisource, `पृष्ठ:हिंदी_व्याकरण.pdf/<page>`), the Central Hindi Directorate spelling standard and the NCF 2005 position paper on Indian languages; each page links the pages used. Where Guru differs from the school convention HTET follows, the page keeps the school version and says so in a `trap` box. Doubtful BSEH keys are flagged on the pages.
- Rebuild after editing `htet/src/*`, `htet/tags.py` or keys: `cd htet && uv run --with pillow python build.py`, then commit `public/index.html`.
- Checks: `node htet/test.js`; UI test: `htet/ui_test.py <scratch dir>`.
- Question text: `htet/text.json` (auto-extracted English) overridden by `htet/fixed/<year>.json` (checked/typed, incl. Hindi); 2024 Q51-60 poem in `htet/passages.json`. `htet/crops/` (page images, used only to check text) is not committed.
- Re-cropping questions (`seg.py`, `crop.py`) needs the source PDFs in `~/Downloads/HTET/Question_Papers/`.
- Deploy: import the repo in Vercel, framework "Other", no build command, output directory `public` (already in `vercel.json`).

## Cloud sync
`api/sync.js` is a Vercel Function that merges finished mocks into MongoDB Atlas (database `htet`, collection `state`).
- Variables, in `.env` locally and in Vercel (Settings -> Environment Variables): `MONGOURL`, `SYNC_KEY` (long random string).
- Atlas -> Network Access must allow `0.0.0.0/0`, so use a long database password.
- On one device: Settings -> Cloud sync -> enter the `SYNC_KEY`, then **Copy setup link** (`/#setup=<key>`) and open it once on each other device.
- Syncs finished mocks and Revise ticks (`done`: newest tick or untick per topic wins).
- Syncs on page load, after each finished mock, on returning to the app and on reconnecting.
- Checks: `node test/sync.test.js`.

## AI help
`api/ai.js` answers "Ask AI" (under any shown answer, and on Revise topics) through Gemini `generateContent`, using the same `SYNC_KEY` for access.
- Variables: `GEMINI_KEY` (free at aistudio.google.com), optional `GEMINI_MODEL` (default `gemini-3.6-flash`).
