# CornBlocker — Task Plan

## Task Overview

| # | Task | Layer | Acceptance Criteria | Status |
|---|------|-------|-------------------|--------|
| 1 | Manifest + domain blocklist + basic blocked page | L1 | Extension loads in Chrome. Visiting pornhub.com redirects to blocked.html showing a hardcoded message. | ⬜ |
| 2 | Full blocked page UI | UX | Dark theme, floating corn emojis, message rotation with fade, category tags, "new message" button. All 50 messages present. Looks screenshot-worthy. | ⬜ |
| 3 | Urge timer bar | UX | Progress bar animates: rises quickly to ~80%, then slowly declines over 30+ seconds. Visual "you're almost through it" anchor. | ⬜ |
| 4 | Stats system | Core | Block counter increments on each blocked.html load. Daily count resets at midnight. All-time count persists. Stats display on blocked page in two cards. | ⬜ |
| 5 | Popup with toggle | Core | Toolbar popup shows 🌽 icon, ON/OFF toggle, today/all-time stats. Toggle disables/enables declarativeNetRequest ruleset. State persists across Chrome restarts. | ⬜ |
| 6 | Full domain list (80+ rules) | L1 | rules.json contains all 80+ domains organized by category (tubes, premium, cams, creators, images, hentai, erotica, imageboards). All redirect to blocked.html. Spot-check 5 domains from different categories. | ⬜ |
| 7 | Reddit NSFW detection | L2 | Content script runs on reddit.com. Visiting any NSFW subreddit (test: r/nsfw) redirects to blocked.html. SFW subreddits (r/AskReddit) load normally. Works on old.reddit.com and new Reddit. SPA navigation detected via MutationObserver. | ⬜ |
| 8 | Twitter/X sensitive content | L3 | Content script runs on x.com/twitter.com. Tweets with sensitive media warnings show inline 🌽 notice. Sensitive profile interstitials redirect to blocked.html. Normal tweets unaffected. SPA navigation handled. | ⬜ |
| 9 | Icon generation | Assets | Python script generates 16x16, 48x48, 128x128, 256x256 PNGs. Corn emoji with red prohibition circle overlay. Icons display correctly in Chrome toolbar and extensions page. | ⬜ |
| 10 | Chrome Web Store prep | Ship | Store listing copy finalized. Privacy policy written. Screenshots captured. Permissions justifications documented. Extension packaged as zip. Ready to upload to Chrome Web Store Developer Dashboard. | ⬜ |

## Session Grouping

**Session 1 (Tasks 1-3):** Core extension + blocked page experience
**Session 2 (Tasks 4-5):** Stats + popup — extension feels complete
**Session 3 (Tasks 6-7):** Full blocklist + Reddit — real blocking power
**Session 4 (Tasks 8-9):** Twitter + icons — polish
**Session 5 (Task 10):** Store submission prep

## First Prompt to Claude Code

```
Read CLAUDE.md and docs/plan.md. This is a new project.
Start Task 1: Create manifest.json with Manifest V3 config, rules.json with 5 test domains (pornhub.com, xvideos.com, xnxx.com, redtube.com, xhamster.com), a minimal blocked.html that says "🌽 CornBlocked — This site has been husked", and background.js service worker stub.
The extension should load in Chrome via "Load unpacked" and redirect any of those 5 domains to blocked.html.
```

## Prompts for Subsequent Tasks

### Task 2
```
Task 2: Build the full blocked page UI. Read the messaging system and blocked page UX sections in CLAUDE.md for specs.
- Dark theme (#0f0f1a bg, gold #f5c542 → #e8a020 gradient accent)
- Floating corn emoji background (low opacity, animated upward float)
- Large 🌽 pulse animation at top
- "CornBlocked" title in gold gradient, "This site has been husked" subtitle
- Category tag pill badge
- Message card with fade transition between messages
- All 50 messages (10 per category: humor, identity, science, action, perspective)
- "Do something else" button → google.com
- "New message" button → random message with fade
- Footer: "CornBlocker — your prefrontal cortex, finally getting a word in"
Split into blocked.html, blocked.css, blocked.js.
```

### Task 3
```
Task 3: Add the urge timer bar to the blocked page.
- Visual progress bar below the message card
- Rises quickly to ~80% over first 5 seconds
- Slowly declines over the next 30+ seconds
- Label: "Urge intensity" with percentage
- Based on research that urges peak at 10-15 minutes then subside
- Purpose: visual anchor showing "you're almost through it"
- Smooth CSS animation, matches the gold/amber color scheme
```

### Task 4
```
Task 4: Implement the stats system.
- chrome.storage.local key: cornblocker_stats
- Schema: { date: "today string", count: N, total: N }
- Daily count resets when date string doesn't match today
- blocked.html increments stats on load
- Display in two cards on blocked page: "Blocked today" and "All time"
- Stats update in real-time on the page
```

### Task 5
```
Task 5: Build the popup.
- popup.html/popup.css/popup.js
- Header: 🌽 + "CornBlocker" in gold gradient
- Status: green/red dot + "Protection ON/OFF" + toggle switch
- Stats: two small cards showing today + all-time counts
- Footer: "Block the corn. Reclaim your brain."
- Toggle sends message to background.js to enable/disable declarativeNetRequest ruleset
- State persisted in chrome.storage.local (key: enabled, default: true)
- Register popup in manifest.json
```

### Task 6
```
Task 6: Expand rules.json to the full 80+ domain list.
Organize by category with comment-style IDs:
- Tube sites (pornhub, xvideos, xnxx, xhamster, redtube, youporn, tube8, spankbang, thumbzilla, beeg, fuq, tnaflix, drtuber, ixxx, hqporner, eporner, 3movs, porntrex, playvids, txxx, hdzog, vporn, pornone, porngo, sexvid.xxx, tubegalore, pornzog, 4tube, fapvid, xxxbunker, cliphunter, fapster.xxx, porndig)
- Premium/studio (brazzers, bangbros, naughtyamerica, realitykings, mofos, digitalplayground)
- Cam sites (chaturbate, stripchat, livejasmin, cam4, bongacams, myfreecams, camsoda, flirt4free)
- Creator platforms (onlyfans, fansly, manyvids, clips4sale, iwantclips, loyalfans)
- Image/aggregator (erome, motherless, bellesa, pornpics, pornpics.de, imagefap, pornmd, nudevista)
- Hentai/anime (nhentai, hentaihaven, rule34.xxx, rule34video, hanime, gelbooru, danbooru, e621, hitomi, tsumino)
- Erotica (literotica)
- Imageboards NSFW boards only (4chan /b/, /gif/, /s/, /hc/, /d/, /h/, /soc/)
All rules redirect main_frame to blocked.html. Sequential IDs.
```

### Task 7
```
Task 7: Reddit NSFW detection content script.
- content-reddit.js injected on *.reddit.com at document_start
- Detection method 1: Fetch /r/{subreddit}/about.json → check data.over18
- Detection method 2: DOM detection — [data-testid="content-gate"], shreddit-content-gate, NSFW badges, over18 interstitial, body.over18 on old Reddit
- MutationObserver on document.documentElement for SPA navigation
- Re-check on URL changes (popstate, pushstate)
- When NSFW detected: redirect to blocked.html
- Must NOT block SFW subreddits — test with r/AskReddit
- Increment stats on block
- Register in manifest.json content_scripts
```

### Task 8
```
Task 8: Twitter/X sensitive content filter.
- content-twitter.js injected on *.x.com and *.twitter.com at document_idle
- Hide sensitive tweets: watch for [data-testid="tweet"] containing sensitive content warnings. Replace content with inline "🌽 Sensitive content blocked by CornBlocker" notice. Keep space in feed for transparency.
- Block sensitive profile gates: detect "this profile may include sensitive content" interstitial → redirect to blocked.html
- MutationObserver on document.body for SPA tweet loading
- Normal tweets unaffected
- Increment stats on each hide/redirect
- Register in manifest.json content_scripts
```

### Task 9
```
Task 9: Generate extension icons.
- Create scripts/generate-icons.py using PIL/Pillow
- Draw: yellow oval corn body, darker kernel row lines, green husk leaves at bottom
- Overlay: red circle outline + diagonal slash (prohibition sign style)
- Transparent background
- Output: icons/icon16.png, icons/icon48.png, icons/icon128.png, icons/icon256.png
- Update manifest.json icons section
- Verify icons display in Chrome toolbar and extensions page
```

### Task 10
```
Task 10: Chrome Web Store submission prep.
- Finalize docs/store-listing.md with:
  - Short description (132 chars max)
  - Full description
  - Category: Productivity
  - Permissions justifications for store review
- Write privacy policy (zero data collection statement, can be a simple text)
- Capture screenshots of: blocked page, popup, Reddit block, Twitter filter
- Document submission checklist in docs/store-listing.md
- Package extension as zip (excluding docs/, .claude/, scripts/)
- Verify zip loads cleanly via "Load unpacked" in fresh Chrome profile
```

## After Each Task
```
Update docs/progress.md with what was completed.
What should I test to verify this works?
```

## Testing Checklist (Final)

- [ ] Blocked domain redirects to blocked.html
- [ ] Blocked page shows random message on load
- [ ] "New message" button cycles messages with fade
- [ ] Urge timer bar animates (rises then falls)
- [ ] Block counter increments on each visit
- [ ] All-time counter persists across sessions
- [ ] Daily counter resets at midnight
- [ ] Popup toggle turns protection on/off
- [ ] Popup shows correct today/all-time counts
- [ ] Reddit: NSFW subreddit → blocked.html
- [ ] Reddit: SFW subreddits load normally
- [ ] Reddit: SPA navigation detected (clicking between subs)
- [ ] Twitter: sensitive media tweets show 🌽 notice
- [ ] Twitter: sensitive profile gate → blocked.html
- [ ] Twitter: normal tweets display normally
- [ ] Disabling via popup allows blocked sites to load
- [ ] Re-enabling resumes blocking
- [ ] Extension survives Chrome restart with state preserved
- [ ] Icons display correctly at all sizes
- [ ] Zip loads in fresh Chrome profile
