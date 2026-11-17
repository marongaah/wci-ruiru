# WCI Ruiru website (Eleventy)

## First-time setup
```bash
npm install
```

## Work on the site (live preview)
```bash
npm start
```
Open the address it shows (usually http://localhost:8080). The page refreshes when you save.

## Build the final site
```bash
npm run build
```
The finished website is created in the `_site` folder. Upload that folder to your host.

## Add a weekly prayer or teaching
1. Create a file in `src/resources/`, named like `2026-11-23-walking-in-faith.md`
2. Put this at the top, then write your text underneath:
```
---
title: Walking in Faith
date: 2026-11-23
type: teaching        # or: prayer
summary: One short line shown on the Resources page.
audio: /Assets/audio/walking-in-faith.mp3   # optional
---
Your text here...
```
3. Save. It shows up on the Resources page automatically, newest first.

Delete the two "sample" files in `src/resources/` when you add real posts.

## Where things live
- `src/*.njk`        one file per page
- `src/_includes/`   navbar, footer and the page shell (edit once, changes everywhere)
- `src/_data/site.json`  site name and menu links
- `src/css/`, `src/js/`, `src/Assets/`  copied as-is into the site
