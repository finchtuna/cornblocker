# Architectural Decisions

## AD-001: Manifest V3 over Manifest V2
- **Decision:** Use Manifest V3 exclusively
- **Why:** Chrome Web Store requires MV3 for all new extensions as of 2024. MV2 extensions can't be published.
- **Trade-off:** `declarativeNetRequest` is less flexible than MV2's `webRequest` (can't modify headers dynamically), but for static domain blocking it's actually faster and more battery-efficient.

## AD-002: Three-layer blocking architecture
- **Decision:** Domain blocklist + Reddit content script + Twitter content script
- **Why:** No single approach catches everything. Static domains handle the 80% case. Reddit has infinite NSFW subs that can't be listed statically. Twitter's sensitive content is per-tweet, not per-domain.
- **Trade-off:** Three layers means three things to maintain. But each is independent — a bug in the Twitter script doesn't break domain blocking.

## AD-003: Zero data collection
- **Decision:** All data stays in `chrome.storage.local`. No analytics, no accounts, no network requests from extension code.
- **Why:** Privacy is a feature for this audience. Self-blockers are embarrassed enough installing a porn blocker — they won't install one that phones home. Also dramatically simplifies Chrome Web Store review.
- **Trade-off:** No usage analytics means we can't measure engagement. Store reviews + download count are our only signals.

## AD-004: Humor as distribution
- **Decision:** The blocked page messages prioritize being funny and screenshot-worthy over being clinical or preachy.
- **Why:** Existing blockers are shame-based or utilitarian. The name "CornBlocker" and the messaging are designed to be shareable. People tell friends about things that make them laugh. The humor IS the growth strategy.
- **Trade-off:** Some users may want a more serious tone. v1 doesn't offer tone customization.

## AD-005: Vanilla JS, no build step
- **Decision:** No React, no bundler, no npm. Plain HTML/CSS/JS.
- **Why:** Chrome extensions don't need frameworks. The entire extension is ~10 files. A build step adds complexity with zero benefit. Also makes the codebase approachable for contributors.
- **Trade-off:** No component reuse between blocked.html and popup.html. Acceptable at this scale.
