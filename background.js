// CornBlocker service worker

const BLOCKED_DOMAINS = [
  'pornhub.com',
  'xvideos.com',
  'xnxx.com',
  'redtube.com',
  'xhamster.com'
];

function isBlockedDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return BLOCKED_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
  } catch {
    return false;
  }
}

// Redirect to blocked.html before the navigation completes
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;
  if (isBlockedDomain(details.url)) {
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL('blocked.html')
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('CornBlocker installed');
});
