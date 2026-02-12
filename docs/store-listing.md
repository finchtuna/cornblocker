# Chrome Web Store Listing

## Category
Productivity

## Short Description (132 chars max)
🌽 Block adult content with humor instead of shame. 80+ sites blocked. Zero data collection. Your brain called — it said thanks.

## Full Description
```
🌽 CornBlocker — Block the corn. Reclaim your brain.

A lightweight, no-nonsense content blocker that keeps you away from adult sites with humor instead of shame. No accounts, no cloud sync, no judgment — just a funny corn emoji and some real talk when you need it most.

✅ Blocks 80+ adult sites including tubes, cams, and creator platforms
✅ Automatically detects NSFW Reddit subreddits (no manual list needed)
✅ Filters sensitive content on Twitter/X
✅ Funny, encouraging blocked page with 50+ rotating motivational messages
✅ Urge timer that shows the feeling peaks then passes
✅ Daily + all-time block counter to track your wins
✅ Simple on/off toggle
✅ 100% local — zero data collection, zero accounts
✅ Open source

Built for people who want to build better habits without the shame. Whether you're doing a challenge, building discipline, or just taking back control of your attention — CornBlocker has your back.

Your brain called. It said thanks.
```

## Permissions Justification (for store review)
| Permission | Justification |
|-----------|---------------|
| `declarativeNetRequest` | Block adult website domains at the network level |
| `storage` | Store user preferences (on/off toggle) and block counter locally |
| `scripting` | Content scripts for Reddit NSFW detection and Twitter sensitive content filtering |
| `host_permissions: reddit.com` | Content script detects NSFW subreddits using Reddit's over_18 API flag |
| `host_permissions: x.com, twitter.com` | Content script detects and filters tweets tagged as sensitive media |

## Privacy Policy
CornBlocker collects zero data. All stats (block counts) are stored locally on your device using Chrome's storage API. No data is transmitted to any server. No analytics. No accounts. No tracking.

## Required Assets
- [ ] Icon: 128x128 PNG
- [ ] Screenshot 1: Blocked page (1280x800)
- [ ] Screenshot 2: Popup (640x400)
- [ ] Screenshot 3: Reddit NSFW sub being blocked (1280x800)
- [ ] Promo tile: 440x280 PNG (optional)

## Submission Checklist
- [ ] Developer account registered ($5 one-time fee)
- [ ] Extension packaged as zip
- [ ] All screenshots captured
- [ ] Privacy policy URL (GitHub gist or repo page)
- [ ] Permissions justifications written
- [ ] Extension tested in fresh Chrome profile via "Load unpacked"
- [ ] Submit at: https://chrome.google.com/webstore/devconsole

## Launch Distribution Plan
- [ ] Post to r/NoFap (350k+ members)
- [ ] Post to r/pornfree
- [ ] Post to r/selfimprovement
- [ ] Post to r/dopaminedetox
- [ ] Share blocked page screenshots on Twitter/TikTok
