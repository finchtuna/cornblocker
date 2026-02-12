// CornBlocker — Reddit NSFW detection (Layer 2)
// Detects NSFW subreddits via JSON API + DOM indicators
// Redirects to blocked.html when NSFW content is detected

(() => {
  let lastCheckedUrl = '';
  let checking = false;
  let enabled = true;
  const enabledReady = chrome.storage.local.get('enabled').then((r) => {
    enabled = r.enabled !== false;
  });

  const BLOCKED_PAGE = chrome.runtime.getURL('blocked.html');

  // Cache enabled state
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) enabled = changes.enabled.newValue !== false;
  });

  function redirect() {
    window.location.replace(BLOCKED_PAGE);
  }

  // Extract subreddit name from URL path
  function getSubreddit(path) {
    const match = path.match(/^\/r\/([^/]+)/i);
    return match ? match[1] : null;
  }

  function isValidSubredditName(name) {
    return /^[A-Za-z0-9_]{2,21}$/.test(name);
  }

  // Detection method 1: Fetch subreddit about.json to check over18 flag
  async function checkSubredditAPI(subreddit) {
    if (!isValidSubredditName(subreddit)) return false;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`/r/${encodeURIComponent(subreddit)}/about.json`, {
        credentials: 'same-origin',
        signal: controller.signal
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data || typeof data !== 'object' || typeof data.data !== 'object') return false;
      return data.data.over18 === true;
    } catch {
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Detection method 2: DOM-based NSFW indicators
  function checkDOMIndicators() {
    // New Reddit: content gate / NSFW interstitial
    if (document.querySelector('[data-testid="content-gate"]')) return true;
    if (document.querySelector('shreddit-content-gate')) return true;

    // New Reddit: NSFW badge in subreddit header
    const nsfwBadges = document.querySelectorAll('[class*="nsfw"], [data-testid*="nsfw"]');
    for (const badge of nsfwBadges) {
      const text = badge.textContent || '';
      if (text.toLowerCase().includes('nsfw')) return true;
    }

    // Old Reddit: body.over18 class (null guard for early execution)
    if (document.body && document.body.classList.contains('over18')) return true;

    // Old Reddit: over18 interstitial page
    if (document.querySelector('.over18-notice, .interstitial-subreddit')) return true;

    return false;
  }

  async function checkCurrentPage() {
    const url = window.location.href;
    if (url === lastCheckedUrl || checking) return;
    lastCheckedUrl = url;
    checking = true;

    try {
      await enabledReady;
      if (!enabled) return;

      // DOM check first — fast, no network
      if (checkDOMIndicators()) {
        redirect();
        return;
      }

      // API check for subreddit pages
      const subreddit = getSubreddit(window.location.pathname);
      if (subreddit) {
        const isNSFW = await checkSubredditAPI(subreddit);
        if (isNSFW) {
          redirect();
          return;
        }
      }
    } finally {
      checking = false;
    }
  }

  // Watch for SPA navigation (Reddit doesn't do full page loads)
  let lastUrl = window.location.href;

  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      lastCheckedUrl = '';
      checkCurrentPage();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Catch back/forward navigation
  window.addEventListener('popstate', () => {
    lastCheckedUrl = '';
    checkCurrentPage();
  });

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    lastCheckedUrl = '';
    checkCurrentPage();
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    lastCheckedUrl = '';
    checkCurrentPage();
  };

  // Initial check
  checkCurrentPage();
})();
