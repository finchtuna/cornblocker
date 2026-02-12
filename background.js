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
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;
  if (!isBlockedDomain(details.url)) return;

  const result = await chrome.storage.local.get('enabled');
  if (result.enabled === false) return;

  chrome.tabs.update(details.tabId, {
    url: chrome.runtime.getURL('blocked.html')
  });
});

// Handle toggle from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'toggle') {
    // Enable or disable the declarativeNetRequest ruleset
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: message.enabled ? ['blocked_domains'] : [],
      disableRulesetIds: message.enabled ? [] : ['blocked_domains']
    });
  }
});

// Set default enabled state on install
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get('enabled');
  if (result.enabled === undefined) {
    await chrome.storage.local.set({ enabled: true });
  }
  console.log('CornBlocker installed');
});
