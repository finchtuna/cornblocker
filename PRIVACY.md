# CornBlocker Privacy Policy

**Last updated:** February 11, 2026

## Data Collection

CornBlocker collects **zero** user data.

## What We Store

CornBlocker stores the following data **locally on your device only** using Chrome's `chrome.storage.local` API:

- **Block count statistics:** A daily counter and all-time counter of blocked page loads. These are simple numbers stored on your machine.
- **Toggle state:** Whether the extension is currently enabled or disabled (a single boolean value).

This data **never leaves your device**. There is no server, no database, no cloud sync, and no account system.

## Network Requests

CornBlocker makes **zero network requests** of its own. The only network activity is:

- **Reddit NSFW detection:** When you browse reddit.com, the content script fetches the subreddit's `about.json` endpoint (a same-origin request to Reddit's own API) to check the `over_18` flag. This request goes to Reddit, not to us.

## Third-Party Services

CornBlocker does not integrate with any third-party analytics, advertising, tracking, or data collection services.

## Permissions

- `declarativeNetRequest` — Used to block adult website domains at the network level
- `webNavigation` — Used to redirect blocked navigations to the extension's motivational blocked page
- `storage` — Used to store toggle state and block counts locally
- `host_permissions` — Required for domain blocking and content scripts on Reddit and Twitter/X

## Contact

For questions about this privacy policy, open an issue on the GitHub repository.
