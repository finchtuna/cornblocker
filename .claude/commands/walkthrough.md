Read CLAUDE.md and docs/progress.md first.
Look at the current state of all project files.

## Your Job

Explain what the extension does RIGHT NOW — every file, every component, every interaction — in plain English. The reader is a pharmacist building dev skills.

## Process

1. **Big picture** — What happens when someone installs this extension and visits a blocked site? Walk through the full flow.
2. **File by file** — For each file in the project:
   - What does it do?
   - How does it connect to other files?
   - What would break if you removed it?
3. **Chrome extension architecture** — ASCII diagram showing:
   - manifest.json → what it registers
   - background.js → what it listens for
   - content scripts → what they detect
   - blocked.html → what the user sees
   - popup.html → what the toolbar shows
   - chrome.storage.local → what persists
4. **The three layers** — How do domain blocking, Reddit detection, and Twitter filtering work together? What does each catch that the others miss?
5. **"What if" scenarios** — Answer 2-3 like:
   - "What happens if I turn off the extension and visit a blocked site?"
   - "What happens if a new NSFW subreddit is created tomorrow?"
   - "What happens if Twitter changes their DOM structure?"

## Output
Write to docs/walkthrough-{date}.md

## Rules
- Don't describe code — explain DECISIONS. Why `declarativeNetRequest` instead of `webRequest`? Why `document_start` for Reddit but `document_idle` for Twitter?
- Use analogies when they help. Chrome extensions are like pharmacy workflow: manifest.json is the P&P manual, background.js is the pharmacist on duty, content scripts are technicians checking specific stations.
- If only Tasks 1-3 are done, don't explain Tasks 4-10 features that don't exist yet.
- 500-800 words is the sweet spot.
