# BUILD LOG — Leonida Trophy Guide (make.fun gta6-trophy-guide-01)

An offline guide and tracker for all 55 GTA VI trophies on PlayStation 5:
static files under `app/`, no build step, zero network requests — every guide is
written in our own words and cites its sources, with a 7-stage roadmap to the
platinum, a missable watch list, per-trophy count trackers, filters and a
spoiler setting. Nothing from Rockstar/GTA: no logo, no official artwork, no
game screenshots — the look is our own.

## Studying the top 1 first (Bos Kinan's standing rule)

Before designing anything, the leaderboard was fetched twice.

- First check (~21:02 WIB, 19 Nov): top 1 was dyor-crypto's "Grand Theft Auto
  VI Trophy Guide & Tracker" (rate 0.919, 12/12 wins vs house guides), followed
  by "Platinum Atlas" (0.918) and "Leonida Trophy Atlas" (0.916). Their artifact
  sheets were read: dark two-column layout, checklist left with a guide open on
  the right, filter chips (All 55 / Story / Missable / Collectibles /
  Activities / Online), search, spoiler toggle, export/import, a 4-phase roadmap
  with per-phase counts, and a detail panel with the official description, a
  guide in own words, a Missable line, a Roadmap line and numbered sources
  (PowerPyx, Exophase/PSNProfiles, OutputLag, CryptoGames).
- Re-check before finalizing (~21:15 WIB, fresh API fetch): the board had moved
  — 1,731 entries, new top 1 "SUNLINE" (rate 0.936, 12/12). Its sheets were
  read too: a 7-stage platinum roadmap with a per-stage progress strip, a
  checklist grouped by stage with per-stage counts, a Missables tab with a
  watch list (2 possibly missable + 5 trigger-unknown), per-trophy count
  trackers ("9 / 18 spots" with +/−), numbered inline citations, and a stats
  line ("Guides: 55/55 cited"). The entry was reworked to match and beat that
  bar: 7 stages instead of 4, a stage strip in the header, a Missables tab,
  count trackers, grouped checklist, source badges on every row.

## What was built

### Data — `app/data/trophies.json` (written in this session)

All 55 trophies with the official name, description and grade exactly as the
starter lists them (verified: names and descriptions match the kit's starter
byte for byte in meaning; grades 1 platinum, 2 gold, 6 silver, 46 bronze;
28 hidden, 27 visible). Each trophy carries: `kinds` (story 17, collectibles 4,
activities 33, platinum 1), `stage` (1–7), `chapter`/`mission` where it applies,
`count` where PlayStation tracks one, `missable`, `unconfirmed` where no guide
has pinned the trigger, a guide in our own words, and `sources` ([S1]–[S7]).

Sources (retrieved 19 November 2026): [S1] PowerPyx — GTA 6 Trophy Guide &
Roadmap; [S2] Exophase / PSNProfiles — the official list as published on
PlayStation Network; [S3] OutputLag — GTA 6 Trophy List; [S4] CryptoGames —
Full List and Hard Ones; [S5] GTA-Zone — Trophy List; [S6] PlanetGTA6 —
Trophies; [S7] GTABase (as cited by the other guides).

Grounded facts used across the guides: Platinum ~200 hours, difficulty 4/10,
one playthrough, no mission replay, free-roam after the story, 0 online
trophies; only Positive Mental Attitude is possibly missable — 18 meditation
spots in 10 locations, the first Lucia's balcony session at Jason's house in
Chapter 1 (after Down to Earth), gone after Chapter 1, meditating with both
characters at one spot counts double, and the 100% checklist counts 15 spots
against the trophy's 18 (both numbers reported, not picked); 100% checklist
~60% true completion (200/277 vehicles scanned, 100/255 animals studied,
70/80 challenges, 300 stunts, 50/66 weapons); Cunning Stunts 250 of 397
(130 Stunt Jumps, 202 Under the Bridges, 40 Knife Flights, 25 Base Jumps);
The Shootist 42 Shooting Range challenges; You WAiNKer! 100 locations
(31 Landmarks, 35 Curiosities, 23 Sculptures, No Flusher tags); Don't Touch
My Deck 3 of 18 card sets; Master of None 9 activity types; Actions Speak
Louder 500 profile actions, Irredeemable profile permanent; cheats disable
trophies and saving. Seven trophies are marked unconfirmed (Challenging Tank,
In The Beginning…, Capital Offense, Personal Best, Bad Luck I Guess, The Truth
Is Out There, Ten Pin): their guides say what the description plainly reads
and say so, instead of inventing a trigger.

### App — `app/index.html`, `app/style.css`, `app/app.js`, `app/data/roadmap.json`

- Header: progress to platinum (count, %, per-grade counts), stats line
  ("Guides: 55/55 cited · 1 possibly missable · 7 triggers not yet known ·
  0 online trophies"), and a 7-stage strip (S1–S7 with earned/total and a mini
  progress bar each; clicking one jumps to that stage in the roadmap).
- Tabs: Guide & tracker / Roadmap to platinum / Missables / About & sources.
- Tracker: checklist grouped by roadmap stage with per-stage earned counts;
  filters All 55 / Story 17 / Missable 1 / Collectibles 4 / Activities 33 /
  Online 0 (the Online filter shows an explicit empty state: the list has no
  online trophies); search; grade, status and sort selects; spoiler-free
  toggle that masks hidden story trophies' names and descriptions until earned;
  progress saved in localStorage; export/import as JSON; reset.
- Detail panel: official description, guide in own words, a per-trophy count
  tracker with −/+ buttons for every trophy with a count (spots, vehicles,
  dollars, actions — saved in localStorage), a Missable? line, a Roadmap line,
  an Unconfirmed note where it applies, numbered sources with a source list,
  and a Mark earned button.
- Roadmap tab: 7 stages (4/9/9/9/11/11/2 trophies; ~10/~15/~20/~20/~30/~30/~75
  hours, ~200 total) with steps, per-stage progress bars and trophy chips,
  plus the 100% checklist thresholds box.
- Missables tab: the watch list — 1 possibly missable + 7 trigger-unknown,
  each with its guide and a link to open the full guide.
- About tab: method, the 7 sources with links, and the offline/privacy note.
- First load is 3 files, 11,065 bytes gzip-9 (39,112 raw); whole app 5 files,
  79,160 bytes. No external requests at run time.

### Screenshots — `screenshots/` (real renders, headless Chromium 1280×800)

- `1-cover.jpg` — checklist grouped by stage with spoiler-free mode on (a
  "Hidden story trophy" row visible) and the Positive Mental Attitude guide open.
- `2-roadmap.jpg` — the 7-stage roadmap with per-stage bars.
- `3-missables.jpg` — the Missable watch list.
- `4-collectibles.jpg` — Collectibles filter with the You WAiNKer! guide and its
  0 / 100 counter open.
- All JPEG q82, 1280×800, 143–170 KiB (cap 256 KiB). Staged with `?shot=` params
  (demo progress in memory only, never written to localStorage); see `shots.json`.

### Plumbing — `main.ts`, `serve.ts`, `shots.json`, `LICENSE`

`main.ts` copies `app/` and `screenshots/` to `/output` (or
`MAKEFUN_OUTPUT_DIR`) and writes `dossier.json` with `buildDossier` from the
kit's unchanged `vendor/makefun-frontend.ts`. `serve.ts` is a local static
server for development. LICENSE is MIT.

## Verification

- **Data check**: 55 trophies; grades 1/2/6/46; 28 hidden; kinds story 17,
  collectibles 4, activities 33, platinum 1; stages 4/9/9/9/11/11/2; exactly
  1 missable; 7 unconfirmed; every trophy has a non-blank guide and ≥1 source;
  all 55 names and descriptions match the kit starter.
- **Functional test** (`/tmp/test-guide.js`, CDP against headless Chromium,
  27/27 checks): app boots with 55 rows; fresh progress 0/55; ticking saves to
  localStorage and persists across reload; missable filter shows 1 row;
  collectibles 4 rows; online filter shows the empty state; search finds rows;
  spoiler masks hidden story trophies; roadmap shows 7 stages (stage 1: 4
  chips); stage strip has 7 chips; missables list has 8 cards; counter 0/100 →
  + → 1/100 and saves; grouped list shows 7 stage headers; about lists 7
  sources; zero external requests, zero failed requests, zero JS exceptions;
  reload with the external network blocked still renders all 55 rows.
- **Dossier**: `MAKEFUN_OUTPUT_DIR=out node main.ts` → dossier.json 934,905
  bytes (cap 1.5 MiB); first load 3 files, 11,065 bytes gzip-9; whole app 5
  files, 79,160 bytes. Two runs produce a byte-identical dossier.
- **Local gate self-check**: no symlinks; 6 app entries (cap 993); 79,160 app
  bytes (cap 48 MiB); 4 screenshots in spec.
- **Kit pre-submit check** (`node cli/makefun.mjs check --kit . --repo <entry>
  --worktree`): **4 passed, 0 failed, 16 skipped, 5 checked at submission**
  (repo_public, repo_owner, repo_created_after_open, commit_in_repo,
  duplicate_snapshot — all need the GitHub repo, which the parent creates via
  browser; no `.makefun/owner.json` was added because the repo owner will be
  clay390, the account's GitHub login).

## Not done (for the parent)

- GitHub repo creation (MCP create_repository fails; parent does it via browser)
  and submission — NOT submitted by this build.
- Suggested title: "Leonida Trophy Guide — GTA VI: 55 cited guides, 7-stage platinum roadmap, missable watch list, spoiler-safe offline tracker".

## Blockers

None. The build is complete and verified; only repo creation + submission remain.
