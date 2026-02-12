// CornBlocker service worker

// 4chan NSFW boards — only these need webNavigation (path-based matching)
const BLOCKED_4CHAN_BOARDS = ['/b/', '/gif/', '/s/', '/hc/', '/d/', '/h/', '/soc/'];

function is4chanNSFW(url) {
  try {
    const u = new URL(url);
    const hostname = u.hostname;
    if (hostname === '4chan.org' || hostname.endsWith('.4chan.org')) {
      return BLOCKED_4CHAN_BOARDS.some(board => u.pathname.startsWith(board));
    }
  } catch {}
  return false;
}

// 4chan board-path redirect (declarativeNetRequest handles all domain blocking)
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;
  if (!is4chanNSFW(details.url)) return;
  const result = await chrome.storage.local.get('enabled');
  if (result.enabled === false) return;

  chrome.tabs.update(details.tabId, {
    url: chrome.runtime.getURL('blocked.html')
  });
});

// Handle toggle from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'toggle') {
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
