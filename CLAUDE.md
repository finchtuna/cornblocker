# Project Instructions

## Project Overview

CornBlocker is a Chrome extension that blocks adult content with humor and encouragement instead of shame. It targets self-blockers — people who install it for themselves. The humor IS the distribution strategy: the name, the blocked page, and the messages are designed to be screenshot-worthy and shareable.

**This is a Chrome Extension (Manifest V3), not a web app.**

## Tech Stack
- Chrome Extension Manifest V3
- `declarativeNetRequest` — network-level domain blocking (80+ adult sites)
- Content Scripts — Reddit NSFW detection + Twitter/X sensitive content filtering
- `chrome.storage.local` — stats persistence (zero cloud, zero accounts)
- Python PIL/Pillow — icon generation only (build tool, not runtime)
- Vanilla HTML/CSS/JS — no frameworks, no build step, no bundler

## Architecture: Three Blocking Layers

Each layer catches what the others miss:

1. **Layer 1: Domain Blocklist** (`declarativeNetRequest`)
   - Static rules in `rules.json` block 80+ known adult domains at network level
   - Redirects `main_frame` requests to `blocked.html` before page loads
   - Fastest, most reliable layer — same approach as uBlock Origin on MV3

2. **Layer 2: Reddit NSFW Detection** (`content-reddit.js`)
   - Detects Reddit's own `over_18` flag via JSON API + DOM indicators
   - MutationObserver for SPA navigation (Reddit doesn't do full page loads)
   - Redirects to `blocked.html` when NSFW detected

3. **Layer 3: Twitter/X Sensitive Content** (`content-twitter.js`)
   - Hides tweets with sensitive media warnings (inline `🌽` notice)
   - Redirects on sensitive profile interstitials
   - MutationObserver for SPA navigation

## Project Structure
```
cornblocker/
├── CLAUDE.md
├── README.md
├── manifest.json           ← Extension config (Manifest V3)
├── rules.json              ← declarativeNetRequest blocked domain rules (80+)
├── blocked.html            ← The blocked page — messaging, stats, urge timer
├── blocked.js              ← Blocked page logic (messages, timer, stats)
├── blocked.css             ← Blocked page styles
├── popup.html              ← Toolbar popup — toggle + stats
├── popup.js                ← Popup logic
├── popup.css               ← Popup styles
├── background.js           ← Service worker — toggle, init, stats relay
├── content-reddit.js       ← Reddit NSFW detection
├── content-twitter.js      ← Twitter/X sensitive content filter
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon256.png
├── scripts/
│   └── generate-icons.py   ← PIL/Pillow icon generator (dev tool only)
├── docs/
│   ├── plan.md
│   ├── progress.md
│   ├── decisions.md
│   ├── corrections.md
│   └── store-listing.md    ← Chrome Web Store copy + submission checklist
└── .claude/
    └── commands/
        ├── dev.md
        └── walkthrough.md
```

## Commands
- Load extension: Chrome → `chrome://extensions/` → Developer mode → Load unpacked → select `cornblocker/`
- After any code change: Click refresh icon on the extension card in `chrome://extensions/`
- Generate icons: `python scripts/generate-icons.py`
- Package for store: `cd cornblocker && zip -r ../cornblocker-v1.0.0.zip . -x "*.DS_Store" -x "__MACOSX/*" -x "docs/*" -x ".claude/*" -x "scripts/*"`

## No Build Step
This is vanilla JS. No npm, no bundler, no transpilation. Edit files → refresh extension → test. The simplicity is a feature.

## Code Style
- Vanilla JS (ES2020+) — no frameworks, no jQuery, no TypeScript
- `const` by default, `let` when mutation needed, never `var`
- 2-space indent, single quotes, semicolons
- Descriptive function names: `detectNSFWSubreddit()` not `check()`
- Comments explain WHY, not WHAT

## Working Style
- Default to implementing, not suggesting
- If intent unclear, infer and proceed
- Read files before answering questions about code
- Only make changes directly requested or clearly necessary

## Data Model

### Stats Schema (`chrome.storage.local` key: `cornblocker_stats`)
```json
{
  "date": "Wed Feb 11 2026",
  "count": 5,
  "total": 142
}
```
- `date` — today's date string. When it doesn't match current date, reset `count` to 0
- `count` — blocks today (daily reset)
- `total` — all-time blocks (never resets)

### Extension State (`chrome.storage.local` key: `enabled`)
- `true` (default) — all blocking active
- `false` — all blocking disabled (user toggled off via popup)

## Messaging System

50 messages across 5 categories. The messages are the product's brand.

**Design principles:**
- Zero shame — never imply the user is broken or weak
- Agency framing — "you're becoming someone" not "you're fighting something"
- Humor as entry point — lowers defensiveness, makes page shareable
- Scientifically grounded — reference dopamine, neural rewiring accurately

**Categories:** humor, identity, science, action, perspective (10 messages each)

## Blocked Page UX

The blocked page (`blocked.html`) is the core brand experience:
- Dark theme (#0f0f1a background, gold/amber #f5c542 → #e8a020 accent)
- Floating corn emoji background (subtle, animated)
- Rotating motivational message with fade transition
- Urge timer bar (peaks at ~80%, declines over 30+ seconds)
- Daily + all-time block counters
- "Do something else" button → google.com
- "New message" button → cycles random message

## Chrome Web Store Requirements
- Manifest V3 (required for new extensions)
- Permissions must be justified: `declarativeNetRequest`, `storage`, `scripting`
- `host_permissions` for reddit.com, x.com, twitter.com (content scripts)
- Privacy policy required (we collect zero data — simple GitHub gist)
- Icons: 16x16, 48x48, 128x128 PNG (required), 256x256 (store listing)
- Screenshots: 1280x800 or 640x400

## Safety Rules
1. **Never collect user data.** Zero network requests, zero analytics, zero accounts.
2. **Never block SFW content.** Reddit detection must check `over_18` flag, not guess.
3. **Transparency on Twitter.** Show `🌽 Sensitive content blocked` inline — don't silently remove tweets.
4. **Always allow disable.** Toggle must work immediately. Never make it hard to turn off.
5. **Don't block 4chan entirely.** Only specific NSFW boards (/b/, /gif/, /s/, /hc/, /d/, /h/, /soc/).

## Scope Boundaries

### In scope (v1)
- 80+ domain blocklist via declarativeNetRequest
- Reddit NSFW subreddit detection (API + DOM)
- Twitter/X sensitive content filtering
- Blocked page with 50 messages, urge timer, stats
- Popup with on/off toggle + stats
- Generated icons (PIL/Pillow script)
- Chrome Web Store listing copy + assets

### NOT in scope (v1)
- Custom domain blocking (user adds sites) — v1.1
- Streak counter — v1.1
- Accountability code system — v1.2
- Image classification for unknown sites — v1.3
- Export/share stats card — v1.3

## Custom Commands
- `/dev` — Pick highest-priority incomplete task, implement, commit
- `/walkthrough` — Explain what was built in plain English

## Git Workflow
- `git commit` after EVERY completed task
- Commit message format: `task {N}: {short description}`
- Before first session: `git init && git add . && git commit -m "initial scaffold"`

## Context Window Management
- If context is getting long mid-session, commit current work, update docs/progress.md, and tell me to start a new session

## Current Focus
Task 1: Manifest + domain blocklist + basic blocked page
