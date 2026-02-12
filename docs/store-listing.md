# Chrome Web Store Listing

## Category
Productivity

## Short Description (132 chars max)
Block adult content with humor instead of shame. 80+ sites blocked. Zero data collection. Your brain called — it said thanks.

## Full Description
```
CornBlocker — Block the corn. Reclaim your brain.

A lightweight, no-nonsense content blocker that keeps you away from adult sites with humor instead of shame. No accounts, no cloud sync, no judgment — just a funny corn emoji and some real talk when you need it most.

WHAT IT BLOCKS:
- 80+ adult sites including tubes, cams, and creator platforms
- NSFW Reddit subreddits (auto-detected via Reddit's own over_18 flag)
- Sensitive content on Twitter/X
- Specific NSFW boards on 4chan (SFW boards load normally)

WHAT YOU GET:
- A beautiful blocked page with 50 rotating motivational messages across 5 categories (humor, identity, science, action, perspective)
- An urge timer that shows the feeling peaks then passes
- Daily + all-time block counter to track your wins
- Simple on/off toggle in the toolbar popup
- 100% local — zero data collection, zero accounts, zero network requests
- Open source

Built for people who want to build better habits without the shame. Whether you're doing a challenge, building discipline, or just taking back control of your attention — CornBlocker has your back.

Your brain called. It said thanks.
```

## Permissions Justification (for store review)
| Permission | Justification |
|-----------|---------------|
| `declarativeNetRequest` | Block 79 adult website domains at the network level before pages load |
| `webNavigation` | Redirect blocked domain navigations to the extension's blocked page with motivational messaging |
| `storage` | Store user preferences (on/off toggle state) and block counter stats locally on device |
| `host_permissions: <all_urls>` | Required for declarativeNetRequest to intercept and block requests across 80+ adult domains, plus content scripts on reddit.com and x.com/twitter.com for NSFW detection |

### Content Scripts
| Script | Hosts | Purpose |
|--------|-------|---------|
| `content-reddit.js` | `*.reddit.com` | Detects NSFW subreddits via Reddit's JSON API (`over_18` flag) and DOM indicators. Only blocks confirmed NSFW content. |
| `content-twitter.js` | `*.x.com`, `*.twitter.com` | Replaces tweets with sensitive media warnings with an inline notice. Redirects on sensitive profile interstitials. |

## Privacy Policy
CornBlocker collects zero data. All statistics (block counts) are stored locally on your device using Chrome's storage API. No data is transmitted to any server. No analytics. No accounts. No tracking. No network requests are made by the extension except Reddit's own API (same-origin, on reddit.com only) to check the NSFW flag on subreddits.

Full privacy policy: see PRIVACY.md in the repository.

## Required Assets
- [x] Icons: 16x16, 48x48, 128x128, 256x256 PNG (generated via scripts/generate-icons.py)
- [ ] Screenshot 1: Blocked page (1280x800)
- [ ] Screenshot 2: Popup (640x400)
- [ ] Screenshot 3: Reddit NSFW sub being blocked (1280x800)
- [ ] Screenshot 4: Twitter sensitive content notice (1280x800)
- [ ] Promo tile: 440x280 PNG (optional)

## Submission Checklist
- [ ] Developer account registered ($5 one-time fee)
- [x] Extension packaged as zip (see package command below)
- [ ] All screenshots captured
- [x] Privacy policy written (PRIVACY.md)
- [x] Permissions justifications documented (above)
- [ ] Extension tested in fresh Chrome profile via "Load unpacked"
- [ ] Submit at: https://chrome.google.com/webstore/devconsole

## Package Command
```bash
cd cornblocker && zip -r ../cornblocker-v1.0.0.zip . -x "*.DS_Store" -x "__MACOSX/*" -x "docs/*" -x ".claude/*" -x "scripts/*" -x "_metadata/*" -x ".git/*"
```

## Launch Distribution Plan
- [ ] Post to r/NoFap (350k+ members)
- [ ] Post to r/pornfree
- [ ] Post to r/selfimprovement
- [ ] Post to r/dopaminedetox
- [ ] Share blocked page screenshots on Twitter/TikTok
