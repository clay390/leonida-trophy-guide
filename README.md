[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/clay390/leonida-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/clay390/leonida-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Trophy Guide

An offline guide and tracker for all 55 GTA VI trophies on PlayStation 5, built for make.fun's **gta6-trophy-guide-01** bounty ($250 pot). Every trophy carries a guide written in our own words with numbered sources, a 7-stage roadmap to the platinum, a missable watch list, per-trophy count trackers, filters, search and a spoiler-safe mode — with progress saved on the device. Nothing leaves the machine: no network requests at run time, no Rockstar artwork or logos.

## What it does

- **Guide & tracker** — checklist of all 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden, 27 visible), grouped by roadmap stage, with per-stage earned counts.
- **Roadmap to platinum** — 7 stages (~200 hours total) with steps, per-stage progress bars and trophy chips, plus the 100% checklist thresholds.
- **Missables** — watch list with the 1 possibly missable trophy and the 7 trophies whose trigger is not yet known, each with its guide.
- **Detail panel** — official description, guide in own words, count tracker with −/+ buttons, Missable? line, Roadmap line, numbered sources, Mark earned button.
- **Filters & search** — All 55 / Story 17 / Missable 1 / Collectibles 4 / Activities 33 / Online 0, grade/status/sort selects, spoiler-free toggle that masks hidden story trophies until earned.
- **Progress saved** — localStorage, with export/import as JSON and reset.

## Run it

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json`. Open `app/index.html` in a browser, or run `node serve.ts` for a local static server.

| File | What it is |
| --- | --- |
| `app/index.html`, `app/style.css`, `app/app.js` | The guide app (static, no build step) |
| `app/data/trophies.json` | All 55 trophies with guides and sources |
| `app/data/roadmap.json` | The 7-stage platinum roadmap |
| `screenshots/` | 4 screenshots of the guide in use |
| `vendor/makefun-frontend.ts` | Kit library, unchanged |
| `shots.json` | Shot list for the screenshots |

## License

MIT — see `LICENSE`.
