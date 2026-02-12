Read CLAUDE.md, docs/corrections.md, and docs/progress.md first.
Find the highest-priority incomplete task (first ⬜) in docs/plan.md.

## Execution Process

For the selected task:

1. **Check prerequisites** — Does this task depend on files from a previous task? Verify they exist.
2. **Implement** — Build the feature per the task prompt in docs/plan.md and specs in CLAUDE.md. Follow Manifest V3 conventions.
3. **Validate manifest** — After any manifest.json change, verify the JSON is valid and all referenced files exist.
4. **Test instructions** — Tell me exactly how to test in Chrome:
   - What to type in the address bar
   - What to click
   - What the expected result is
   - How to check the console for errors (`chrome://extensions/` → Details → Inspect service worker, or right-click blocked page → Inspect)
5. **Commit** — `git add -A && git commit -m "task {N}: {short description}"`
6. **Update docs** — Mark task ✅ in plan.md, update progress.md.

## Rules
- ONE task per /dev invocation. Don't combine tasks.
- No frameworks, no npm, no build step. Vanilla HTML/CSS/JS only.
- Every file referenced in manifest.json must exist before committing.
- Test that the extension loads without errors after every change.
- Chrome extension files are flat — no `src/` or `dist/` folders.
- Content scripts run in isolated worlds — they can't access extension APIs directly. Use `chrome.runtime.sendMessage()` to communicate with the background service worker.
- `declarativeNetRequest` rules must have unique sequential integer IDs.
- If something from docs/corrections.md is relevant, follow it.
- The user is a pharmacist building dev skills. Explain Chrome extension concepts clearly when introducing them for the first time. Don't over-explain on subsequent tasks.
