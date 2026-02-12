# 🌽 CornBlocker

**Block the corn. Reclaim your brain.**

A Chrome extension that blocks adult content with humor and encouragement instead of shame. Built for self-blockers — people installing it for themselves.

## Features

- 80+ adult domains blocked at the network level
- Automatic NSFW Reddit subreddit detection
- Twitter/X sensitive content filtering
- 50 rotating motivational messages (funny, not preachy)
- Urge timer showing the feeling peaks then passes
- Daily + all-time block counter
- Simple on/off toggle
- 100% local — zero data collection

## Install

### From Chrome Web Store
*(Coming soon)*

### From Source (Developer)
1. Clone this repo
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" → select the project folder
5. Visit a blocked domain to verify

## Privacy

CornBlocker collects zero data. All stats are stored locally on your device. No analytics, no accounts, no tracking.

## Tech

- Chrome Extension Manifest V3
- `declarativeNetRequest` for domain blocking
- Content scripts for Reddit + Twitter detection
- `chrome.storage.local` for stats
- Vanilla HTML/CSS/JS — no frameworks, no build step
