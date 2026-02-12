// CornBlocker service worker

const BLOCKED_DOMAINS = [
  // Tubes
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com',
  'youporn.com', 'tube8.com', 'spankbang.com', 'thumbzilla.com', 'beeg.com',
  'fuq.com', 'tnaflix.com', 'drtuber.com', 'ixxx.com', 'hqporner.com',
  'eporner.com', '3movs.com', 'porntrex.com', 'playvids.com', 'txxx.com',
  'hdzog.com', 'vporn.com', 'pornone.com', 'porngo.com', 'sexvid.xxx',
  'tubegalore.com', 'pornzog.com', '4tube.com', 'fapvid.com', 'xxxbunker.com',
  'cliphunter.com', 'fapster.xxx', 'porndig.com',
  // Premium
  'brazzers.com', 'bangbros.com', 'naughtyamerica.com', 'realitykings.com',
  'mofos.com', 'digitalplayground.com',
  // Cams
  'chaturbate.com', 'stripchat.com', 'livejasmin.com', 'cam4.com',
  'bongacams.com', 'myfreecams.com', 'camsoda.com', 'flirt4free.com',
  // Creators
  'onlyfans.com', 'fansly.com', 'manyvids.com', 'clips4sale.com',
  'iwantclips.com', 'loyalfans.com',
  // Image/aggregator
  'erome.com', 'motherless.com', 'bellesa.co', 'pornpics.com', 'pornpics.de',
  'imagefap.com', 'pornmd.com', 'nudevista.com',
  // Hentai/anime
  'nhentai.net', 'hentaihaven.xxx', 'rule34.xxx', 'rule34video.com',
  'hanime.tv', 'gelbooru.com', 'danbooru.donmai.us', 'e621.net',
  'hitomi.la', 'tsumino.com',
  // Erotica
  'literotica.com'
];

// 4chan NSFW boards — matched by path, not full domain
const BLOCKED_4CHAN_BOARDS = ['/b/', '/gif/', '/s/', '/hc/', '/d/', '/h/', '/soc/'];

function isBlockedDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return BLOCKED_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
  } catch {
    return false;
  }
}

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

// Redirect to blocked.html before the navigation completes
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;
  if (!isBlockedDomain(details.url) && !is4chanNSFW(details.url)) return;

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
